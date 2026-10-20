# Module Specification: `IpXactComponent`

> **Source:** `ts/src/modules/IpXactComponent/`
> **Status:** Draft

---

## Overview

Wraps an existing **IP-XACT XML component description** and a pre-existing SystemVerilog file into a TSSV `Module`. At elaboration time it parses the XML to discover the component's bus interfaces, maps them to TSSV AMBA interface types, and wires them up — making a vendor-supplied black-box IP block first-class in a TSSV design. The wrapper is the only RTL it generates. The original `.sv` file is instantiated in it, and included verbatim in `writeSystemVerilog()`'s output.

---

## Parameters

| Parameter | Type | Description |
|---|---|---|
| `name` | `string` | Module name. Set it: the name derived from the two paths isn't a legal SV identifier ([#123](https://github.com/TypeScriptSystemVerilog/TSSV/issues/123)) |
| `svFilePath` | `string` | Path to the SystemVerilog file that defines the component's module |
| `xmlDataPath` | `string` | Path to the IP-XACT XML component description |

---

## IO Ports

Ports are derived entirely from the IP-XACT XML at elaboration time. The module has no statically declared `IOs`. Each bus interface the XML declares becomes an interface port, of the TSSV AMBA interface type that matches its bus type (AHB, AHBLite, APB, ATB, AXI, AXI4, LPI, etc.). An interface whose name starts with `Init` gets the `inward` role, and one whose name starts with `Targ` gets the `outward` role.

---

## Functional Description

1. The XML file is parsed using `fast-xml-parser` to extract the `busInterface` definitions, their parameters, and the width of each port of the component's model (`<model><ports>`).
2. Each bus interface's `busType` attribute is matched against a static `knownInterfaces` registry that maps IP-XACT bus type URIs to TSSV interface classes (e.g. `tssv/lib/interfaces/AMBA/AMBA3/APB/…` → `amba.APB`).
3. The matching TSSV `Interface` is instantiated with its role (`inward` for `Init*`, `outward` for `Targ*`) and the interface's parameters from the XML, and added to the module via `addInterface`.
4. `addSystemVerilogSubmodule` instantiates the SV file's module as `u_ip`. Each port the XML maps to a bus signal is bound to that signal (`<interface>.<signal>`), and every other input is tied off, as below. No port is bound by name (`autoBind` is off).

### Ports the XML doesn't connect

- **An input of the SV module that the XML maps to no bus signal** (`tm` in both samples) is tied to 0. The constant takes the port's width from the XML's `<model><ports>`, and a comment in the wrapper lists the tied inputs.
- **A bus input that no port reads** is read into `unused_bus_inputs`, a signal that nothing uses. A `lint_off UNUSEDSIGNAL` waiver covers that one declaration (LINT-3). This happens for two reasons:
  - the XML maps the signal to no port, like `PCLKEN` in the APB sample, or `WUSER` on the AXI sample's `Init*` interfaces;
  - the XML maps the signal to a port that another interface's signal already drives, like the clock and reset that several interfaces share (`node0_pclk`, `noc_prstn`). A port takes one binding, the one from the last interface the XML lists, so the other interfaces' clock and reset go unread.
- **A bus output that no port drives** is left undriven: `WUSER` on the AXI sample's `Targ*` interfaces. So are `ACLK`, `ACLKEN` and `ARESETn` on its `Init*` interfaces: the AMBA3 `AXI` class makes them outputs of an `inward` port ([#174](https://github.com/TypeScriptSystemVerilog/TSSV/issues/174)), and tying them to 0 would drive a clock. Bus outputs get tied to 0 once #174 is fixed. Lint doesn't report these signals. It checks an interface signal across all instances of the interface, and each one is driven on another instance.
- **An output of the SV module that the XML maps to no bus signal** is left unconnected. Neither sample has one.

### Errors

The constructor throws, naming the module and the XML file:

- when a port's width in `<model><ports>` differs from the width of the bus signal it's mapped to (PARAM-5). A port that `<model><ports>` doesn't list isn't checked: the AXI sample's leaves out its reset, `noc_arstn`;
- when an input of the SV module needs tying off but `<model><ports>` doesn't list it;
- when a bus interface's bus type isn't in `knownInterfaces`, or its name starts with neither `Init` nor `Targ`.

### Supported bus interfaces

AHB, AHBLite, AHBLiteInitiator, AHBLiteTarget, APB, ATB, AXI (AMBA3), AXI_RO, AXI_WO, LPI (r2p0, r2p1, r3p0), AXI4, AXI4-Lite, ACE, ACE-Lite, ACP, AHB5, and others from the AMBA 2–5 family.

---

## Dependencies

| Import | Source |
|---|---|
| `Module`, `Sig`, `TSSVParameters` | `tssv/lib/core/TSSV` |
| `parseSVModules`, `selectSVModule` | `tssv/lib/core/SVModuleHeader` |
| AMBA interface classes (`amba.*`) | `tssv/lib/interfaces/AMBA/…` |
| `fast-xml-parser` | npm dependency |
| `fs` | Node.js standard library |

---

## Test Plan

**Test script:** `ts/test/modules/IpxactComponent/componentExample.ts`

The script wraps two sample components. Each pairs an IP-XACT XML file, which defines the bus interfaces, the parameters that decide which ports each interface has, and the width of each port, with a SystemVerilog file that declares the physical ports to bind to them:

| Component | XML | SystemVerilog | Output |
|---|---|---|---|
| `axiComponent` | `ts/test/modules/IpxactComponent/AXI/axiSample.xml` | `ts/test/modules/IpxactComponent/AXI/architectureSample.sv` | `sv-examples/IpXactComponent/axiComponent/` |
| `apbComponent` | `ts/test/modules/IpxactComponent/APB/apbSample.xml` | `ts/test/modules/IpxactComponent/APB/apbArchitecture.sv` | `sv-examples/IpXactComponent/apbComponent/` |

Each is instantiated the same way:

```typescript
const component = new IpXactComponent({
  name: 'axiComponent',
  xmlDataPath: 'ts/test/modules/IpxactComponent/AXI/axiSample.xml',
  svFilePath: 'ts/test/modules/IpxactComponent/AXI/architectureSample.sv'
})
```

For each component, the script writes one definition per file: the wrapper (`<component>.sv`), the interface its ports use, and a lint wrapper that instantiates the interfaces. It also writes a filelist, `<component>_lint_top.f`, for `verilator --lint-only -Wall`.

| Test case | Checked |
|---|---|
| Both samples | The wrapper lints clean with `-Wall`, through the lint wrapper: `npm run check:generated-sv` |
| Unmapped input | `tm` is bound to a 0 constant |
| Port width | The AXI sample, with `Init0_Ar_Len` widened to 8 bits in `<model><ports>`, throws |
| Unknown bus type | The AXI sample, with its first bus type renamed, throws |

**The sample SV files aren't generated SV.** Each one stands in for the vendor's RTL, and declares the module's ports and nothing else, so its outputs are undriven and its inputs unused. The script writes the wrapper without that module, and the filelist names the sample file where it is, as `ts/test/test_importParse.ts` does for its imported files. `npm run check:generated-sv` checks only files under `sv-examples/`, so it leaves the sample's findings out. The sample files carry no waivers and no tie-offs.

The samples are consistent with the bus interfaces they map to. In the AXI sample, the `Ar_Len` and `Aw_Len` ports are 4 bits, as AMBA3 AXI's `ARLEN` and `AWLEN` are, and its `wLen` parameter is 4. In the APB sample, `<model><ports>` lists the ports its SV file declares, at their widths, reset included.

Run it from the repo root:

```bash
npx tsc
node out/test/modules/IpxactComponent/componentExample.js
verilator --lint-only -Wall doc/rtl-style/sv-style/common_waivers.vlt -F sv-examples/IpXactComponent/axiComponent/axiComponent_lint_top.f
```

The last command also reports the sample module's own findings, all of them in `architectureSample.sv`, and none in the wrapper.

---

## Implementation Notes

- **Style-guide deviations.** The module follows the [TSSV guide](../../rtl-style/tssv-style/tssv-coding-style.md) and the [SV guide](../../rtl-style/sv-style/sv-coding-style.md), except for these SHOULD rules:
  - **IDENT-2** (TSSV guide): the interface ports are named after the XML's bus interfaces (`Init0`, `Targ1`), not in lower snake_case.
  - **TEST-2** (TSSV guide): the samples cover the AXI and APB bus types only.
