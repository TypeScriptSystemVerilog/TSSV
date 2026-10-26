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
| `svFilePath` | `string` | Path to the SystemVerilog file that defines the component's module. Environment variables in it are expanded, and it must then be absolute, as in `$TSSV_ROOT/...`: a relative path throws |
| `xmlDataPath` | `string` | Path to the IP-XACT XML component description, expanded and checked as `svFilePath` is |
| `moduleName` | `string` | The module in `svFilePath` that the component wraps. Required: it's never inferred, and one the file doesn't declare throws |

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

The bus type's `library`, `name` and `version` in the XML pick the class: `AMBA3`, `APB`, `r2p0_0` gives `AMBA3/APB/r2p0_0/APB`. Eight classes can be picked this way: AHB (AMBA2), AHBLite, AHBLiteInitiator, AHBLiteTarget, APB, ATB and AXI (AMBA3), and AXI4 (AMBA4). `knownInterfaces` lists 74 more, such as AXI4-Lite, ACE and AXI4-Stream, but no XML can reach them yet ([#176](https://github.com/TypeScriptSystemVerilog/TSSV/issues/176)).

---

## Example: an adder on an APB port

### The IP

`apb_adder` stands in for a vendor's IP: an adder behind an APB target port. Write the operands to A (`0x0`) and B (`0x4`), and read their sum from SUM (`0x8`). Its ports are the APB signals, under its own names:

```systemverilog
module apb_adder (
    input  logic        pclk,
    input  logic        presetn,
    input  logic [15:0] paddr,
    input  logic        psel,
    input  logic        penable,
    input  logic        pwrite,
    input  logic [31:0] pwdata,
    output logic [31:0] prdata,
    output logic        pready,
    output logic        pslverr
);
```

The whole module is `ts/test/modules/IpxactComponent/Adder/apb_adder.sv`.

### Its XML

`ts/test/modules/IpxactComponent/Adder/adder.xml` describes it. IpXactComponent reads three parts of the XML:

- **The bus interface:** its name, its bus type, and one `portMap` per signal, from the APB signal (`logicalPort`) to the IP's port (`physicalPort`).
- **The interface's parameters,** which size the bus: `wAddr` sets `ADDR_WIDTH` and `wData` sets `DATA_WIDTH`, so the bus is `APB_16_32`.
- **`<model><ports>`:** the width of each IP port.

The interface is named `Init0` because IpXactComponent takes the role from the name. An interface named `Init…` is `inward`: the IP responds on it, as an APB target does. One named `Targ…` is `outward`.

Here is the XML with all but two of the port maps and ports left out:

```xml
<spirit:component xmlns:spirit="http://www.spiritconsortium.org/XMLSchema/SPIRIT/1.5">
  <spirit:vendor>example.com</spirit:vendor>
  <spirit:library>samples</spirit:library>
  <spirit:name>apb_adder</spirit:name>
  <spirit:version>1.0</spirit:version>
  <spirit:busInterfaces>
    <spirit:busInterface>
      <spirit:name>Init0</spirit:name>
      <spirit:busType spirit:vendor="amba.com" spirit:library="AMBA3" spirit:name="APB" spirit:version="r2p0_0"/>
      <spirit:abstractionType spirit:vendor="amba.com" spirit:library="AMBA3" spirit:name="APB_rtl" spirit:version="r2p0_0"/>
      <spirit:slave/>
      <spirit:portMaps>
        <spirit:portMap>
          <spirit:logicalPort><spirit:name>PCLK</spirit:name></spirit:logicalPort>
          <spirit:physicalPort><spirit:name>pclk</spirit:name></spirit:physicalPort>
        </spirit:portMap>
        <spirit:portMap>
          <spirit:logicalPort><spirit:name>PADDR</spirit:name></spirit:logicalPort>
          <spirit:physicalPort><spirit:name>paddr</spirit:name></spirit:physicalPort>
        </spirit:portMap>
        <!-- … one portMap for each of the other APB signals the IP has a port for -->
      </spirit:portMaps>
      <spirit:parameters>
        <spirit:parameter><spirit:name>wAddr</spirit:name><spirit:value>16</spirit:value></spirit:parameter>
        <spirit:parameter><spirit:name>wData</spirit:name><spirit:value>32</spirit:value></spirit:parameter>
      </spirit:parameters>
    </spirit:busInterface>
  </spirit:busInterfaces>
  <spirit:model>
    <spirit:ports>
      <spirit:port>
        <spirit:name>pclk</spirit:name>
        <spirit:wire>
          <spirit:direction>in</spirit:direction>
        </spirit:wire>
      </spirit:port>
      <spirit:port>
        <spirit:name>paddr</spirit:name>
        <spirit:wire>
          <spirit:direction>in</spirit:direction>
          <spirit:vector><spirit:left>15</spirit:left><spirit:right>0</spirit:right></spirit:vector>
        </spirit:wire>
      </spirit:port>
      <!-- … one port for each of the other IP ports -->
    </spirit:ports>
  </spirit:model>
</spirit:component>
```

All ten port maps:

| APB signal | `apb_adder` port | APB signal | `apb_adder` port |
|---|---|---|---|
| `PCLK` | `pclk` | `PWRITE` | `pwrite` |
| `PRESETn` | `presetn` | `PWDATA` | `pwdata` |
| `PADDR` | `paddr` | `PRDATA` | `prdata` |
| `PSELx` | `psel` | `PREADY` | `pready` |
| `PENABLE` | `penable` | `PSLVERR` | `pslverr` |

### Instantiating it

Construct the wrapper from the two files, then use it like any other module. Its port is named after the XML's interface, `Init0`:

```typescript
import { Module } from 'tssv/lib/core/TSSV'
import { APB } from 'tssv/lib/interfaces/AMBA/AMBA3/APB/r2p0_0/APB'
import { IpXactComponent } from 'tssv/lib/modules/IpXactComponent'

// The wrapper, from the IP's SV file and its IP-XACT description
const adder = new IpXactComponent({
  name: 'adderComponent',
  xmlDataPath: '$TSSV_ROOT/ts/test/modules/IpxactComponent/Adder/adder.xml',
  svFilePath: '$TSSV_ROOT/ts/test/modules/IpxactComponent/Adder/apb_adder.sv',
  moduleName: 'apb_adder'
})

// A design that instantiates it, and passes its own APB port through to the adder's
class AdderTop extends Module {
  constructor () {
    super({ name: 'adder_top' })
    this.addInterface('apb', new APB({ ADDR_WIDTH: 16, DATA_WIDTH: 32 }, 'inward'))
    this.addSubmodule('u_adder', adder, { Init0: 'apb' })
  }
}

console.log(new AdderTop().writeSystemVerilog())
```

That prints the `APB_16_32` interface, `apb_adder.sv` as is, the wrapper below, and then the parent:

```systemverilog
module adder_top (
    APB_16_32.inward apb
);


  adderComponent u_adder (.Init0(apb));

endmodule
```

### The generated wrapper

The wrapper module, as the test writes it to `sv-examples/IpXactComponent/adderComponent/adderComponent.sv`:

```systemverilog
module adderComponent (
    APB_16_32.inward Init0
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // moduleName = apb_adder
  // svFilePath = $TSSV_ROOT/ts/test/modules/IpxactComponent/Adder/apb_adder.sv
  // xmlDataPath = $TSSV_ROOT/ts/test/modules/IpxactComponent/Adder/adder.xml
  // ------------------------------------------------------------------

  // Bus inputs that no port of apb_adder reads
  /* verilator lint_off UNUSEDSIGNAL */
  logic unused_bus_inputs;
  /* verilator lint_on UNUSEDSIGNAL */
  assign unused_bus_inputs = ^{Init0.PCLKEN};

  apb_adder u_ip (
      .pclk(Init0.PCLK),
      .presetn(Init0.PRESETn),
      .paddr(Init0.PADDR),
      .psel(Init0.PSELx),
      .penable(Init0.PENABLE),
      .pwrite(Init0.PWRITE),
      .pwdata(Init0.PWDATA),
      .prdata(Init0.PRDATA),
      .pready(Init0.PREADY),
      .pslverr(Init0.PSLVERR)
  );

endmodule
```

Each IP port is bound to the bus signal its port map names. The adder has no port for `PCLKEN`, so the wrapper reads it into `unused_bus_inputs` ("Ports the XML doesn't connect"). Every IP input has a port map, so nothing is tied to 0.

---

## Dependencies

| Import | Source |
|---|---|
| `Module`, `Sig`, `TSSVParameters`, `absolutePath` | `tssv/lib/core/TSSV` |
| `parseSVModules`, `selectSVModule` | `tssv/lib/core/SVModuleHeader` |
| AMBA interface classes (`amba.*`) | `tssv/lib/interfaces/AMBA/…` |
| `fast-xml-parser` | npm dependency |
| `fs` | Node.js standard library |

---

## Test Plan

**Test script:** `ts/test/modules/IpxactComponent/componentExample.ts`

The script wraps three sample components. Each pairs an IP-XACT XML file, which defines the bus interfaces, the parameters that decide which ports each interface has, and the width of each port, with a SystemVerilog file that declares the physical ports to bind to them. The AXI and APB samples come from a NoC generator, with two to four interfaces each. The adder is the example above, with one:

| Component | XML | SystemVerilog | Output |
|---|---|---|---|
| `axiComponent` | `ts/test/modules/IpxactComponent/AXI/axiSample.xml` | `ts/test/modules/IpxactComponent/AXI/architectureSample.sv` | `sv-examples/IpXactComponent/axiComponent/` |
| `apbComponent` | `ts/test/modules/IpxactComponent/APB/apbSample.xml` | `ts/test/modules/IpxactComponent/APB/apbArchitecture.sv` | `sv-examples/IpXactComponent/apbComponent/` |
| `adderComponent` | `ts/test/modules/IpxactComponent/Adder/adder.xml` | `ts/test/modules/IpxactComponent/Adder/apb_adder.sv` | `sv-examples/IpXactComponent/adderComponent/` |

Each is instantiated as in the example. For each component, the script writes one definition per file: the wrapper (`<component>.sv`), the interface its ports use, and a lint wrapper that instantiates the interfaces. It also writes a filelist, `<component>_lint_top.f`, for `verilator --lint-only -Wall`.

| Test case | Checked |
|---|---|
| Every sample | The wrapper lints clean with `-Wall`, through the lint wrapper: `npm run check:generated-sv` |
| Unmapped input | In the AXI and APB samples, `tm` is bound to a 0 constant |
| One of each | The adder's XML has a single bus interface, port map list and parameter list, which the XML parser returns as an object rather than an array |
| Port width | The AXI sample, with `Init0_Ar_Len` widened to 8 bits in `<model><ports>`, throws |
| Unknown bus type | The AXI sample, with its first bus type renamed, throws |
| Relative path | The AXI sample, with `svFilePath` or `xmlDataPath` given relative to the repo, throws, naming it |
| Unknown module | The AXI sample, with a `moduleName` its SV file doesn't declare, throws |

**The sample SV files aren't generated SV.** Each one stands in for the vendor's RTL. The AXI and APB ones declare the module's ports and nothing else, so their outputs are undriven and their inputs unused. The script writes the wrapper without the sample's module, and the filelist names the sample file where it is, as `ts/test/test_importParse.ts` does for its imported files. `npm run check:generated-sv` checks only files under `sv-examples/`, so it leaves the sample's findings out. The sample files carry no waivers and no tie-offs. `apb_adder.sv` is a working module, and lints clean with `-Wall`.

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
