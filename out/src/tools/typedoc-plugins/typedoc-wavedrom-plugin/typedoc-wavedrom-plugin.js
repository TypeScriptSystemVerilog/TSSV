//import { renderWaveForm } from 'wavedrom'
import * as typedoc from 'typedoc';
function createHeadScript() {
    return String.raw `
<script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/skins/default.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/wavedrom.min.js" type="text/javascript"></script>  
`;
}
function createBodyScript() {
    return String.raw `
<script>
    const h4Elements = document.querySelectorAll('h4');
    h4Elements.forEach(h4Element => {
        if (h4Element.textContent === 'Wavedrom') {
            h4Element.parentNode.removeChild(h4Element);
        }
    });
    WaveDrom.ProcessAll();
</script>
`;
}
const wavedromBlockStart = '<div style="background-color: white;"><script type="WaveDrom">';
const wavedromBlockEnd = '</script></div>';
export class WaveDromPlugin {
    constructor(app) {
        this.app = app;
    }
    initialize() {
        this.app.converter.on(typedoc.Converter.EVENT_RESOLVE_BEGIN, (context) => {
            this.onResolveBegin(context);
        });
        this.app.renderer.on(typedoc.PageEvent.END, (event) => {
            this.onEndPage(event);
        });
    }
    onResolveBegin(context) {
        context.project.getReflectionsByKind(typedoc.ReflectionKind.All).forEach(reflection => {
            if (reflection.comment) {
                reflection.comment.getTags('@wavedrom').forEach(part => {
                    console.log("WAVEDROM!!!!");
                    const p = part.content[0];
                    // Regex to match code blocks
                    const codeBlockRegex = /```(?:\w+)?\s*([\s\S]+?)\s*```/g;
                    // Array to store matches
                    const codeBlocks = [];
                    let match;
                    if (p?.text) {
                        if ((match = codeBlockRegex.exec(p.text)) !== null) {
                            p.text = this.renderWaveDrom(match[1]);
                        }
                    }
                });
            }
        });
    }
    renderWaveDrom(waveDromCode) {
        return `${wavedromBlockStart}${waveDromCode}${wavedromBlockEnd}`;
    }
    onEndPage(event) {
        if (event.contents !== undefined) {
            event.contents = this.insertWaveDromScript(event.contents);
        }
    }
    insertWaveDromScript(html) {
        if (!html.includes(wavedromBlockStart)) {
            // this page doesn't need to load WaveDrom
            return html;
        }
        // find the closing </body> tag and insert our mermaid scripts
        const headEndIndex = html.indexOf('</head>');
        html = html.slice(0, headEndIndex) + createHeadScript() + html.slice(headEndIndex);
        // find the closing </body> tag and insert our mermaid scripts
        const bodyEndIndex = html.lastIndexOf('</body>');
        return (html.slice(0, bodyEndIndex) +
            createBodyScript() +
            html.slice(bodyEndIndex));
    }
}
export function load(app) {
    new WaveDromPlugin(app).initialize();
}
