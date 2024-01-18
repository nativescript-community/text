<template>
    <Page>
        <ActionBar title="Simple Demo" />
        <StackLayout>
            <Label text="test" fontSize="16" />
            <HTMLLabel text="test" fontSize="16" />
            <HTMLLabel :text="nativeText" fontSize="16" />
            <HTMLLabel html='<span style="color:red;">test</span>' fontSize="16" />
            <CanvasLabel height="22">
                <CSpan fontSize="16" text="test" />
            </CanvasLabel>
            <CanvasView height="20" @draw="onDraw" />
            <CanvasView height="40" @draw="onDraw1" />
            <Button verticalTextAlignment="center" horizontalTextAlignment="center" textAlignment="center">
                <FormattedString>
                    <Span fontWeight="bold" text="A" verticalAlignment="center" fontSize="35" />
                    <Span text="test" fontSize="24" verticalAlignment="center" />
                </FormattedString>
            </Button>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { Frame } from '@nativescript/core';
import { createNativeAttributedString } from '@nativescript-community/text';
import { Canvas, CanvasView, LayoutAlignment, Paint, StaticLayout } from '@nativescript-community/ui-canvas';
const nativeText = createNativeAttributedString({
    spans: [
        {
            fontSize: 16,
            text: 'test'
        }
    ]
});
const textPaint = new Paint();
textPaint.setTextSize(16);
@Component
export default class Simple extends Vue {
    nativeText = nativeText;
    onBack() {
        Frame.topmost().goBack();
    }
    onDraw({ canvas, object }: { canvas: Canvas; object: CanvasView }) {
        canvas.drawText('test', 0, 16, textPaint);
    }
    onDraw1({ canvas, object }: { canvas: Canvas; object: CanvasView }) {
        const w = canvas.getWidth();
        const staticLayout = new StaticLayout(nativeText, textPaint, w, LayoutAlignment.ALIGN_NORMAL, 1, 0, true, 'end');
        canvas.translate(0, 0);
        staticLayout.draw(canvas);
    }
}
</script>
