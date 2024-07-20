import * as typedoc from 'typedoc';
export declare class WaveDromPlugin {
    private readonly app;
    constructor(app: typedoc.Application);
    initialize(): void;
    private onResolveBegin;
    private renderWaveDrom;
    private onEndPage;
    insertWaveDromScript(html: string): string;
}
export declare function load(app: typedoc.Application): void;
