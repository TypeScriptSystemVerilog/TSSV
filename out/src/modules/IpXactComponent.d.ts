import { Module, type TSSVParameters, type Sig } from 'tssv/lib/core/TSSV';
export interface ComponentData {
    version: string;
    abstractionName: string;
    abstractionLibrary: string;
    busName: string;
    ports: Record<string, string>;
}
export interface IpXactComponent_Parameters extends TSSVParameters {
    xmlData: string;
    svFilePath?: string;
}
export declare class IpXactComponent extends Module {
    params: IpXactComponent_Parameters;
    static knownInterfaces: Record<string, any>;
    constructor(params: IpXactComponent_Parameters, newBindings: Record<string, string | Sig | bigint>);
    createDictionary(xmlData: string): Record<string, ComponentData>;
    addInterfaces(interfaceData: Record<string, ComponentData>): void;
    addInterfaceToExport(instanceName: string, pathString: string): Promise<void>;
}
