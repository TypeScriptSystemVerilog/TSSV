import { writeFileSync, mkdirSync } from 'fs';
// import * as fs from 'fs'
import { IpXactComponent } from 'tssv/lib/modules/IpXactComponent';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
try {
    mkdirSync('sv-examples/IpxactComponent');
}
catch (e) { }
/*
const xml_path = '/Users/bennettva/TSSV/ts/test/modules/IpxactComponent/axiSample.xml'
// const xml_path = '/Users/bennettva/amba-interface-parser/torus/torus_4x3_nodes_2024-06-05_08.50.40_Specification.Architecture.Structure_xml_2024-06-05_08.50.40_ipxact/Specification.Architecture.Structure.xml'
const sv_path = '/Users/bennettva/TSSV/ts/test/modules/IpxactComponent/architectureSample.sv'
// const sv_path = '/Users/bennettva/amba-interface-parser/Specification_Architecture_Structure.stub.v'
*/
// Define the relative paths to the XML and SV files
const xml_path = join(__dirname, '../../../../ts/test/modules/IpxactComponent/axiSample.xml');
// const xml_path = join(__dirname, '../amba-interface-parser/torus/torus_4x3_nodes_2024-06-05_08.50.40_Specification.Architecture.Structure_xml_2024-06-05_08.50.40_ipxact/Specification.Architecture.Structure.xml')
const sv_path = join(__dirname, '../../../../ts/test/modules/IpxactComponent/architectureSample.sv');
// const sv_path = join(__dirname, '../amba-interface-parser/Specification_Architecture_Structure.stub.v')
const subI_tb = new IpXactComponent({
    name: 'newComponent',
    xmlDataPath: xml_path,
    svFilePath: sv_path
});
try {
    const TB = `
    // verilator lint_off DECLFILENAME
    // verilator lint_off UNUSED
    ${subI_tb.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/IpxactComponent/componentExample.sv', TB);
}
catch (err) {
    console.error(err);
}
