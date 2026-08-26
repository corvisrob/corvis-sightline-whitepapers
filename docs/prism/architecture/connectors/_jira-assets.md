Collects asset data from Jira issues and normalizes to the `BaseAsset` schema.

## Overview

This connector treats Jira issues as asset records. Common use cases:
- **Asset tracking project**: Dedicated Jira project for hardware/software inventory
- **CMDB integration**: Jira as lightweight CMDB
- **IT asset management**: Track laptops, servers, licenses as issues

## Configuration

Set these environment variables in your `.env` file:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=prism

# Jira API
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_api_token
JIRA_PROJECT_KEY=ASSET
```

## Jira Setup

### 1. Create Asset Project

1. Create a new Jira project (or use existing)
2. Create issue type "Asset" (or use existing type)

### 2. Configure Custom Fields

Add custom fields for asset properties:

| Field Name | Field Type | `fieldIds` key | Purpose |
|-----------|------------|-------------------|---------|
| Asset ID | Text | `assetId` | Unique asset identifier |
| Asset Type | Select | `assetType` | computer/network/control-device |
| Location | Text | `location` | Physical location |
| Owner | Text | `owner` | Asset owner/contact |
| IP Address | Text | `ip` | Network address |
| Serial Number | Text | `serialNumber` | Hardware serial |
| Manufacturer | Text | `manufacturer` | Vendor/manufacturer |
| Model | Text | `model` | Model/SKU |
| Host Name | Text | `hostName` | Required. Both sync directions match on it (see `extendedData.hostname` in the transformed asset) |
| MAC Address | Text | `mac` | Optional - exposed as `extendedData.jiraMacAddress` |

**Field ids are per-instance.** Every Jira site numbers its own custom fields, so this
connector ships no ids of its own. Set `config.fieldIds` in
`.connectors/jira-assets.<instance>/manifest.json` to the ids your site assigned. Section 3
reads them for you.

`hostName` is required. Both sync directions match on it, and a collect without it stops
and names the missing key.

The ids below are illustrative. Every site numbers its own fields, so yours are different.

```json
{
  "config": {
    "baseUrl": "https://your-domain.atlassian.net",
    "projectKey": "ASSET",
    "fieldIds": { "hostName": "customfield_10001", "ip": "customfield_10002" }
  }
}
```

### 3. Read the field ids

Run discovery against the instance:

```bash
npm run discover:jira-assets -- <instance>
```

Discovery asks Jira for its field catalogue and writes every custom field to the
manifest's `discovery` key:

```json
{
  "discovery": {
    "discoveredAt": "2026-08-26T03:04:19.624Z",
    "fields": [
      { "id": "customfield_10001", "name": "Host Name", "type": "string" },
      { "id": "customfield_10002", "name": "IP Address", "type": "string" }
    ]
  }
}
```

Copy the ids you need into `config.fieldIds`. Discovery never writes `config`, so
re-running it leaves your choices alone.

## Running Locally

```bash
# Install dependencies
npm install

# Run connector
npm run collect:jira-assets
```

## Production Setup

### Install HTTP Client

For production use, install axios:

```bash
npm install axios
```

Then update `collect.ts` to use real Jira API:

```typescript
import axios from 'axios';

async function fetchJiraAssets(): Promise<JiraIssue[]> {
  const jiraUrl = process.env.JIRA_URL;
  const projectKey = process.env.JIRA_PROJECT_KEY || 'ASSET';
  
  const auth = Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
  ).toString('base64');
  
  const issues: JiraIssue[] = [];
  let startAt = 0;
  const maxResults = 100;
  
  // Paginate through all issues
  while (true) {
    const response = await axios.get(
      `${jiraUrl}/rest/api/3/search`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
        },
        params: {
          jql: `project = ${projectKey} AND issuetype = Asset ORDER BY created DESC`,
          startAt,
          maxResults,
          fields: [
            'summary',
            'description',
            'issuetype',
            'status',
            'labels',
            'created',
            'updated',
            'customfield_XXXXX', // your own ids, read from the discovery key
            'customfield_YYYYY',
            // ... etc
          ],
        },
      }
    );
    
    issues.push(...response.data.issues);
    
    if (response.data.issues.length < maxResults) {
      break; // Last page
    }
    
    startAt += maxResults;
  }
  
  return issues;
}
```

### Jira Authentication

1. **Generate API Token**:
   - Go to https://id.atlassian.com/manage-profile/security/api-tokens
   - Click "Create API token"
   - Save the token securely

2. **Set Environment Variables**:
   ```bash
   JIRA_EMAIL=your-email@company.com
   JIRA_API_TOKEN=your_generated_token
   ```

### JQL Query Customization

Customize the JQL query to filter assets:

```typescript
// Only active assets
jql: `project = ASSET AND status != Retired ORDER BY created DESC`

// Specific asset type
jql: `project = ASSET AND "Asset Type" = computer ORDER BY created DESC`

// Updated in last 30 days
jql: `project = ASSET AND updated >= -30d ORDER BY updated DESC`
```

## Data Mapping

### Jira Issue → BaseAsset

| Jira Field | BaseAsset Field | Notes |
|-----------|----------------|-------|
| `key` | `extendedData.jiraIssueKey` | Issue key (ASSET-101) |
| `fields.summary` | `name` | Issue summary as asset name |
| `fields.description` | `description` | Issue description |
| `fields.labels` | `tags` | Labels as tags |
| the `assetId` field id | `id` | Falls back to the issue key when unset |
| the `assetType` field id | `type` | Asset type (computer/network/etc) |
| the `location` field id | `location.building` | Location text |
| the `owner` field id | `ownership.owner` | Owner email/name |

### Extended Data

Jira-specific fields stored in `extendedData`:
- `jiraIssueKey`: Issue key
- `jiraStatus`: Current status
- `jiraIssueType`: Issue type name
- `jiraCreated`: Issue creation date
- `jiraUpdated`: Last updated date
- `jiraIpAddress`: IP address custom field
- `jiraSerialNumber`: Serial number
- `jiraManufacturer`: Manufacturer/vendor
- `jiraModel`: Model number
- `assetStatus`: Normalized status (active/retired/etc)

## Custom Field Mapping

Match the connector to your Jira site through the manifest. There is no code to edit.

1. Run `npm run discover:jira-assets -- <instance>` to read your site's field ids.
2. Read the ids out of the manifest's `discovery` key.
3. Set them under `config.fieldIds`, keyed by the names in the table above.

The connector reads each value by its configured id at collect time.

## Filtering by Asset Type

Route to specific schemas based on asset type:

```typescript
function transformToSpecificSchema(issue: JiraIssue): any {
  const assetType = issue.fields.customfield_XXXXX; // the id configured as `assetType`
  
  switch (assetType) {
    case 'computer':
      return transformToAssetComputer(issue);
    case 'network':
      return transformToAssetNetwork(issue);
    case 'control-device':
      return transformToAssetControlDevice(issue);
    default:
      return transformToBaseAsset(issue);
  }
}
```

## Output

Creates snapshots in MongoDB collection: `snapshots_jira-assets`

Each snapshot contains:
- Timestamp
- Schema version (typically BaseAsset v1)
- Array of normalized assets
- Metadata (item counts, validation errors, duration)

## Use Cases

### IT Asset Tracking
Track laptops, monitors, peripherals with:
- Assignment tracking (who has what)
- Lifecycle management (requisition → deployment → retirement)
- Warranty and support information

### License Management
Track software licenses as Jira issues:
- License keys
- Seat counts
- Renewal dates
- Cost tracking

### Equipment Inventory
Manufacturing or lab equipment:
- Calibration schedules
- Maintenance history
- Compliance documentation

## Windmill Integration

See `windmill/templates/jira-assets-collector.ts` in the `sightline-prism-windmill` repository for the Windmill deployment template. [Install Windmill](/docs/prism/install/windmill) covers the setup.

## Security Considerations

- Use API tokens, not passwords
- Store credentials securely (environment variables, Windmill resources)
- Use read-only Jira permissions if possible
- Rotate API tokens regularly
- Monitor API usage in Jira admin console
