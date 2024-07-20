import * as wavedrom from 'wavedrom';
export function renderWavedrom(jsonString) {
    try {
        const diagram = wavedrom.renderWaveForm(0, JSON.parse(jsonString), 'json', 0);
        return `<div class="wavedrom">${diagram.innerHTML}</div>`;
    }
    catch (error) {
        return `<div class="wavedrom-error">Invalid WaveDrom JSON: ${error.message}</div>`;
    }
}
