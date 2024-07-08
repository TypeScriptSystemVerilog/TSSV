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
    protected addSystemVerilogSubmoduleWithBindings(componentDataRecord: Record<string, ComponentData>): Module;
    private extractInputSignalsFromVerilog;
    protected createDictionary(xmlData: string): Record<string, ComponentData>;
    protected addInterfaces(interfaceData: Record<string, ComponentData>, parameterData: Record<string, Record<string, ParameterData>>): void;
    protected parseParameters(xmlInput: string): Record<string, Record<string, ParameterData>>;
}
export default IpXactComponent;
