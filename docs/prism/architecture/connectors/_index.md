Prism ships ten connectors. Eight collect from real systems. Two are test fixtures.

## What each connector collects

| Connector | Source system | Type | Produces | Status |
|---|---|---|---|---|
| [`azure-vms`](/docs/prism/architecture/connectors/azure-vms) | Azure Compute | Cloud | `AssetComputer` | Production |
| [`crowdstrike`](/docs/prism/architecture/connectors/crowdstrike) | CrowdStrike Falcon | Endpoint security | `AssetComputer` | Production |
| [`cylance`](/docs/prism/architecture/connectors/cylance) | Cylance / BlackBerry Aurora | Endpoint security | `AssetComputer` | Production |
| [`jira-assets`](/docs/prism/architecture/connectors/jira-assets) | Jira | Tracking | `BaseAsset` | Production |
| [`spreadsheet`](/docs/prism/architecture/connectors/spreadsheet) | Workbook files, mapping-driven | File | `BaseAsset` | Production |
| [`ad-computers`](/docs/prism/architecture/connectors/ad-computers) | Active Directory | On-premise agent | `AssetComputer` | Production |
| [`local-host-python`](/docs/prism/architecture/connectors/local-host-python) | The local machine | On-premise agent | `AssetComputer` | Production |
| [`local-host-powershell`](/docs/prism/architecture/connectors/local-host-powershell) | The local machine | On-premise agent | `AssetComputer` | Production |
| [`aws-ec2-mock`](/docs/prism/architecture/connectors/aws-ec2-mock) | None — synthetic data | **Test fixture** | `AssetComputer` | **Fixture, not an integration** |
| [`jira-assets-mock`](/docs/prism/architecture/connectors/jira-assets-mock) | None — synthetic data | **Test fixture** | `BaseAsset` | **Fixture, not an integration** |

## About the two fixtures

`aws-ec2-mock` and `jira-assets-mock` connect to nothing. They emit synthetic records and need no credentials.

They exist so you can run a complete collection, sync and review cycle before you configure a real source. A fixture proves your Prism installation works; it tells you nothing about a vendor integration.

**Prism does not ship an AWS integration.** `aws-ec2-mock` produces records shaped like EC2 instances for testing. Do not read it as AWS support.

## Agent connectors run differently

Three connectors run on the machine or domain they collect from, rather than calling a remote API.

- `ad-computers` runs on a domain-joined Windows host and queries Active Directory.
- `local-host-powershell` collects the machine it runs on, on Windows.
- `local-host-python` collects the machine it runs on, anywhere Python runs.

These need placement, not just credentials. Read their pages before you plan a deployment.

## Choosing between the two endpoint-security connectors

`crowdstrike` and `cylance` both produce `AssetComputer` records about endpoints. If you run both products, run both connectors and let the sync engine merge them — that is the case Prism is built for. Set the priority on each rule to say which vendor you trust for which field.

## Where to go next

| Question | Document |
|---|---|
| What is a connector, and what is a manifest? | [Connector model](/docs/prism/architecture/connector-model) |
| How do I build one? | [Writing a connector](/docs/prism/architecture/writing-a-connector) |
| How do I run one? | [Running a collector](/docs/prism/usage/collect) |
