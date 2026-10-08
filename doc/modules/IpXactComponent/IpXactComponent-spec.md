# Module Specification: `IpXactComponent`

> **Source:** `ts/src/modules/IpXactComponent/`
> **Status:** Draft

---

## Overview

Wraps an existing **IP-XACT XML component description** and a pre-existing SystemVerilog file into a TSSV `Module`. At elaboration time it parses the XML to discover the component's bus interfaces, maps them to TSSV AMBA interface types, and wires them up — making a vendor-supplied black-box IP block first-class in a TSSV design. No RTL is generated; the original `.sv` file is included verbatim.

---

## Parameters

| Parameter | Type | Description |
|---|---|---|
| `name` | `string` | Instance name |
| `svFilePath` | `string` | Path to the pre-existing SystemVerilog file to include |
| `xmlDataPath` | `string` | Path to the IP-XACT XML component description |

---

## IO Ports

Ports are derived entirely from the IP-XACT XML at elaboration time. The module has no statically declared `IOs` — they are populated dynamically by parsing the XML bus interfaces and mapping each to its corresponding TSSV AMBA interface type (AHB, AHBLite, APB, ATB, AXI, AXI4, LPI, etc.).

---

## Functional Description

1. The XML file is parsed using `fast-xml-parser` to extract `busInterface` definitions.
2. Each bus interface's `busType` attribute is matched against a static `knownInterfaces` registry that maps IP-XACT bus type URIs to TSSV interface classes (e.g. `tssv/lib/interfaces/AMBA/AMBA3/APB/…` → `amba.APB`).
3. The matching TSSV `Interface` is instantiated with the appropriate role (`inward`/`outward`/`monitor`) and added to the module via `addInterface`.
4. `addSystemVerilogSubmodule` includes the pre-existing `.sv` file, with port bindings generated from the interface signal map.
5. Interfaces not present in `knownInterfaces` are skipped with a warning.

### Supported bus interfaces

AHB, AHBLite, AHBLiteInitiator, AHBLiteTarget, APB, ATB, AXI (AMBA3), AXI_RO, AXI_WO, LPI (r2p0, r2p1, r3p0), AXI4, AXI4-Lite, ACE, ACE-Lite, ACP, AHB5, and others from the AMBA 2–5 family.

---

## Dependencies

| Import | Source |
|---|---|
| `Module`, `TSSVParameters` | `tssv/lib/core/TSSV` |
| AMBA interface classes (`amba.*`) | `tssv/lib/interfaces/AMBA/…` |
| `fast-xml-parser` | npm dependency |
| `fs` | Node.js standard library |

---

## Test Plan

| Test case | Notes |
|---|---|
| APB peripheral wrap | Parse XML, verify APB interface instantiated with correct role |
| AXI4 manager wrap | Verify AXI4 inward interface and signal bindings |
| Unknown bus type | Verify graceful skip with warning, no crash |
| Round-trip SV include | Verify `svFilePath` appears in `writeSystemVerilog()` output |

### Example

**Test script:** `ts/test/modules/IpxactComponent/componentExample.ts`

The script wraps two sample components. Each pairs an IP-XACT XML file, which defines the bus interfaces and the parameters that decide which ports each interface has, with a SystemVerilog file that lists the physical ports to bind to them:

| Component | XML | SystemVerilog | Output |
|---|---|---|---|
| `axiComponent` | `ts/test/modules/IpxactComponent/AXI/axiSample.xml` | `ts/test/modules/IpxactComponent/AXI/architectureSample.sv` | `sv-examples/IpXactComponent/axiComponent/componentExample.sv` |
| `apbComponent` | `ts/test/modules/IpxactComponent/APB/apbSample.xml` | `ts/test/modules/IpxactComponent/APB/apbArchitecture.sv` | `sv-examples/IpXactComponent/apbComponent/apbComponentExample.sv` |

Each is instantiated the same way:

```typescript
const component = new IpXactComponent({
  name: 'axiComponent',
  xmlDataPath: xml_path,
  svFilePath: sv_path
})
```

Run it from the repo root:

```bash
npx tsc
node out/test/modules/IpxactComponent/componentExample.js
cat sv-examples/IpXactComponent/axiComponent/componentExample.sv
```

The output is a complete component: every interface the XML declares, with each physical port bound to its interface's corresponding signal.
