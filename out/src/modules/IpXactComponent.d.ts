import { Module, type TSSVParameters } from 'tssv/lib/core/TSSV';
export interface ComponentData {
    version: string;
    abstractionName: string;
    abstractionLibrary: string;
    busName: string;
    ports: Record<string, string>;
}
interface ParameterData {
    value: string;
    realName: string;
}
export interface IpXactComponent_Parameters extends TSSVParameters {
    xmlData: string;
    svFilePath: string;
}
export declare class IpXactComponent extends Module {
    params: IpXactComponent_Parameters;
    static knownInterfaces: Record<string, any>;
    constructor(params: IpXactComponent_Parameters);
    addSystemVerilogSubmoduleWithBindings(componentDataRecord: Record<string, ComponentData>): Module;
    private extractInputSignalsFromVerilog;
    createDictionary(xmlData: string): Record<string, ComponentData>;
    addInterfaces(interfaceData: Record<string, ComponentData>, parameterData: Record<string, Record<string, ParameterData>>): void;
    parseParameters(xmlInput: string): Record<string, Record<string, ParameterData>>;
}
export default IpXactComponent;
