import Vue from 'nativescript-vue';
import Spans from './Spans.vue';
import { overrideSpanAndFormattedString } from '@nativescript-community/text';

export function installPlugin() {
    overrideSpanAndFormattedString();
}

export const demos = [{ name: 'Spans', path: 'Spans', component: Spans }];
