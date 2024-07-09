# How to add an IP-Xact component

This process is centered around adding an IpXactComponent which is an extension of the TSSV Module class. This IpXactComponent (IXC) Module inherets all the parameters the standard Module posseses. It has additional parameters too, which are path locations for an XML file, and a SystemVerilogFile.

Parameters will be listed below:

| Name | Inherited | Type | Description |
|------|-----------|------|-------------|
| Name | Yes | string | Name of the module that will be written in the verilog output. |
| xmlData | No | string | File path of XML architecture structure file |
| svFilePath | No | string | File path of SystemVerilog file which contains signal definitions |

An example was created [here](/ts/test/modules/IpxactComponent/componentExample.ts)

As seen in this file, instantiating an IpXactComponent follows this format:

```
const component = new IpXactComponent(
  {
    name: 'newComponent',
    xmlDataPath: xml_path,
    svFilePath: sv_path
  })
```

Here the parameters are seen passed in being the name, XML file path, and SystemVerilog file path.

In the example above [this](/ts/test/modules/IpxactComponent/axiSample.xml) is the XML file which defines the struture of the interface and the parameters which decide which ports will be present on the interfaces.

Then the last parameter is the SystemVerilog [file](/ts/test/modules/IpxactComponent/architectureSample.sv) which provides the list of physical ports which will be connected to the various present interfaces.

This example can be run by running:
```
cd TSSV
npx tsc
node out/test/modules/IpxactComponent/componentExample.js
cat /Users/bennettva/TSSV/sv-examples/IpxactComponent/componentExample.sv
```

This provides this [output](/sv-examples/IpxactComponent/componentExample.sv) which is a complete component with all the interfaces listed and all the physical ports bound to the interfaces corresponding ports.