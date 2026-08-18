Collects local system information from the machine it runs on and pushes an `AssetComputer` snapshot straight to MongoDB — entirely in PowerShell, no Python or Node.js required.

Native counterpart to the [`local-host-python`](/docs/prism/architecture/connectors/local-host-python) connector: same data, same `AssetComputer` schema — just collected via `Get-CimInstance` instead of `psutil`, and written to its own `snapshots_local-host-powershell` collection. Use this variant on Windows machines where you don't want to install Python.

## Features

- Gathers CPU, memory, storage, and network information via CIM (`Win32_OperatingSystem`, `Win32_ComputerSystem`, `Win32_Processor`, `Win32_LogicalDisk`, `Win32_NetworkAdapterConfiguration`)
- Detects operating system, build, and architecture
- Single script — collects and pushes to MongoDB in one run, no intermediate file
- No external API dependencies

## Prerequisites

- PowerShell 5.1+ or PowerShell 7+
- `Mdbc` module (MongoDB driver for PowerShell):
  ```powershell
  Install-Module Mdbc -Scope CurrentUser
  ```

## Usage

```powershell
# Uses $env:MONGODB_URI / $env:MONGODB_DB / $env:AGENT_SOURCE_ID, or their defaults
.\Collect-LocalHost.ps1

# Explicit connection settings
.\Collect-LocalHost.ps1 -MongoUri $env:MONGODB_URI -Database $env:MONGODB_DB

# Custom source identifier (affects tags + snapshots_<id> collection name)
.\Collect-LocalHost.ps1 -SourceId local-host-powershell-workstation
```

Connection defaults:
- `MongoUri`: `$env:MONGODB_URI` or `mongodb://localhost:27017`
- `Database`: `$env:MONGODB_DB` or `prism`
- `SourceId`: `$env:AGENT_SOURCE_ID` or `local-host-powershell`
- `Collection`: `snapshots_<SourceId>`

## Schema Mapping

| CIM Source | AssetComputer Field | Notes |
|---|---|---|
| `$env:COMPUTERNAME` | `id` (`local-<hostname>`), `hostname`, `name` | |
| `[System.Net.Dns]::GetHostEntry` | `fqdn` | Falls back to hostname if DNS resolution fails |
| `Win32_OperatingSystem.Caption` | `os` | e.g. "Microsoft Windows 11 Pro" |
| `Win32_OperatingSystem.BuildNumber` | `osVersion` | e.g. "Build 22631" |
| `Win32_OperatingSystem.OSArchitecture` | `extendedData.architecture`, `tags` | e.g. "64-bit" |
| `Win32_Processor.NumberOfLogicalProcessors` (summed) | `cpu` | |
| `Win32_Processor.MaxClockSpeed` | `extendedData.cpuFreq` | MHz |
| `Win32_OperatingSystem.TotalVisibleMemorySize` / `FreePhysicalMemory` | `memory`, `extendedData.memoryAvailable` | Converted KB → MB |
| `Win32_LogicalDisk` (`$env:SystemDrive`) | `storage`, `extendedData.storageUsed` | System drive only, matches the Python connector's `disk_usage('/')` semantics |
| `Win32_NetworkAdapterConfiguration` (IPEnabled) | `network[]` | IPv4 addresses only |
| `Win32_OperatingSystem.LastBootUpTime` | `extendedData.bootTime` | |

## Scheduling

Set up a Windows Scheduled Task to collect and push daily:

```powershell
$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
    -Argument '-File C:\scripts\Collect-LocalHost.ps1'
$trigger = New-ScheduledTaskTrigger -Daily -At '02:00'
Register-ScheduledTask -TaskName 'Prism-Agent-Collection' -Action $action -Trigger $trigger
```

To scope credentials to the task rather than the machine-wide environment, set `MONGODB_URI`/`MONGODB_DB` as environment variables on the scheduled task's action, or pass `-MongoUri`/`-Database` directly in the `-Argument` string.

## Security Considerations

- Run with minimal privileges (a dedicated service account, not an admin)
- Use read-only MongoDB credentials
- Secure MongoDB connection (TLS recommended)
- Store credentials in environment variables or a scheduled-task secure action, not in the script
- Rotate MongoDB credentials regularly
