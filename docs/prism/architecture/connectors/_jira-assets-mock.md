**This connector is a test fixture. It emits synthetic data, needs no credentials, and connects to nothing.** Use it to exercise the collection and sync pipeline before you point a real connector at a live system.

For collection from a real Jira instance, use the [`jira-assets`](/docs/prism/architecture/connectors/jira-assets) connector.

## Purpose

Generates mock asset data simulating a Jira asset management system. Useful for:
- Development and testing
- Demo environments
- Understanding sync patterns without external dependencies

## Mock Data Generated

Creates 15 mock assets with:
- Asset IDs (ASSET-0001 to ASSET-0015)
- Asset tags (physical identifiers)
- Various types (Server, Workstation, Network Device, Storage)
- Location data
- Ownership and cost center information
- Hardware details (manufacturer, model, serial number)
- Lifecycle information (purchase date, criticality, status)

## Running the Collector

```bash
# From project root
npx tsx connectors/jira-assets-mock/collect.ts
```

## Output

Creates a snapshot in MongoDB collection `datasets_jira-assets-mock` with:
- Source: `jira-assets-mock`
- Schema: `BaseAsset`
- 15 mock assets

## Sync Rule Example

```json
{
  "id": "jira-assets-mock-sync",
  "name": "Jira Assets Mock to Consolidated",
  "sourceDataset": "jira-assets-mock",
  "targetDataset": "consolidated-assets",
  "targetSchema": "BaseAsset",
  "enabled": true,
  "priority": 60,
  "matchOn": ["id"],
  "fieldRules": [
    {
      "sourceField": "extendedData.jiraAssetTag",
      "targetField": "assetTag",
      "mode": "auto",
      "priority": 85
    },
    {
      "sourceField": "ownership.costCenter",
      "targetField": "costCenter",
      "mode": "auto",
      "priority": 80
    }
  ]
}
```

## Switching to Real Jira

When ready for production:
1. Configure the real `jira-assets` connector
2. Update sync rules to use `sourceDataset: "jira-assets"`
3. Disable or remove this mock connector
