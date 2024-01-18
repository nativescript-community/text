import Vue from 'nativescript-vue';
import Spans from './Spans.vue';
import { overrideSpanAndFormattedString } from '@nativescript-community/text';

export function installPlugin() {
    Vue.registerElement('HTMLLabel', () => require('@nativescript-community/ui-label').Label);
    Vue.registerElement('CanvasView', () => require('@nativescript-community/ui-canvas').CanvasView);
    Vue.registerElement('CanvasLabel', () => require('@nativescript-community/ui-canvaslabel').CanvasLabel);
    Vue.registerElement('CSPan', () => require('@nativescript-community/ui-canvaslabel').Span);
    overrideSpanAndFormattedString();
}

export const demos = [{ name: 'Spans', path: 'Spans', component: Spans }];
