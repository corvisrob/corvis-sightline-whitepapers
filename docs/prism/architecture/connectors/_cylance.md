Collects endpoint devices from Cylance, now BlackBerry Aurora, and produces `AssetComputer` records.

This is a production connector. It calls the vendor API with real credentials.

## What it collects

Every device the Cylance tenant reports, with its operating system, network interfaces and run status.

| Produces | Schema |
|---|---|
| One record per device | `AssetComputer` |

The connector maps the device's reported state to a Prism run status: `online` becomes `running`, and both `offline` and `inactive` become `stopped`. Any other value is left unknown rather than guessed.

It parses the vendor's combined operating-system string into a separate name and version. It maps each reported IP address to a network interface, and pairs it with the MAC address at the same position. The first interface is named `primary`.

## Credentials

The connector authenticates with a signed token exchange. Your manifest supplies three credential references.

| Logical name | What it identifies |
|---|---|
| `tenantId` | The Cylance tenant |
| `appId` | The application registered in that tenant |
| `appSecret` | The secret issued with that application |

All three are required. The collector stops with a clear message if any is missing, rather than failing later at the API.

As with every connector, a manifest holds an `env:` reference for each of these, never the value. See [Connector model](/docs/prism/architecture/connector-model).

## Configuration

Two optional settings, both in the manifest's `config` object.

| Setting | Default | When to change it |
|---|---|---|
| `baseUrl` | The Australian regional endpoint | Your tenant is in another region |
| `devicesPath` | The extended devices endpoint | The vendor moves or versions the endpoint |

The default `baseUrl` is region-specific. A tenant outside that region must set it, or authentication fails against the wrong regional service.

## How it runs

The collector performs the four standard steps:

1. It exchanges its credentials for an access token.
2. It pages through the devices endpoint until the tenant reports no more.
3. It transforms each device to `AssetComputer`.
4. It transmits the snapshot to the instance inbox.

It allows partial success. A device that fails schema validation is reported and skipped; the remaining devices still transmit. A collection is not lost because one record is malformed.

## Where to go next

| Question | Document |
|---|---|
| How do I configure an instance? | [Connector model](/docs/prism/architecture/connector-model) |
| How do I run it? | [Running a collector](/docs/prism/usage/collect) |
| What happens to the snapshot? | [Sync engine](/docs/prism/architecture/sync-engine) |
