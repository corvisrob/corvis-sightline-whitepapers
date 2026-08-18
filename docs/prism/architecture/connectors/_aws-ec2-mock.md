# AWS EC2 Mock Connector

**This connector is a test fixture. It emits synthetic data, needs no credentials, and connects to nothing.** Use it to exercise the collection and sync pipeline before you point a real connector at a live system.

Prism does not ship an AWS EC2 integration. This fixture produces records shaped like EC2 instances so you can test the pipeline; it does not collect from AWS.

## Configuration

Set these environment variables in your `.env` file:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=prism

# AWS Credentials
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

## Running Locally

```bash
# Install dependencies
npm install

# Run connector
npm run collect:aws-ec2
```

## Production Setup

### Install AWS SDK

For production use, install the AWS SDK:

```bash
npm install @aws-sdk/client-ec2
```

Then update `collect.ts` to use real AWS API calls instead of mock data.

### Running in Windmill

1. Import the connector script to Windmill
2. Configure AWS credentials as Windmill resources/secrets
3. Schedule as a daily job

See `windmill/templates/aws-ec2-collector.ts` in the `sightline-prism-windmill` repository for a Windmill collector template. [Install Windmill](/docs/prism/install/windmill) covers the setup.

## Data Mapping

### EC2 Instance → AssetComputer

| EC2 Field | AssetComputer Field | Notes |
|-----------|-------------------|-------|
| `InstanceId` | `id` | Unique identifier |
| `Tags[Name]` | `name` | Falls back to InstanceId |
| `InstanceType` | `extendedData.awsInstanceType` | Also used to estimate CPU/memory |
| `State.Name` | `status` | running/stopped |
| `PrivateIpAddress` | `network[].ipAddress` | Private IP |
| `PublicIpAddress` | `network[].ipAddress` | Public IP |
| `ImageId` | `extendedData.awsImageId` | AMI ID |
| `Tags` | `extendedData.awsTags` | All tags as object |

### Extended Data

AWS-specific fields are stored in `extendedData`:
- `awsInstanceType`: Instance type (t3.large, etc.)
- `awsImageId`: AMI ID
- `awsVpcId`: VPC ID
- `awsSubnetId`: Subnet ID
- `awsLaunchTime`: Launch timestamp
- `awsTags`: All instance tags

## Output

Creates snapshots in MongoDB collection: `snapshots_aws-ec2`

Each snapshot contains:
- Timestamp
- Schema version
- Array of normalized `AssetComputer` objects
- Metadata (item counts, validation errors, duration)
