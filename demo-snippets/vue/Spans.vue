<template>
    <Page>
        <ActionBar title="Simple Demo" />
        <GridLayout rows="*,auto">
            <StackLayout ref="holder">
                <!-- GOOD -->
                <HTMLLabel :html="`<span style=&quot;color:green;&quot;>${text}</span>`" :fontSize="fontSize" textWrap="false" />
                <HTMLLabel :html="`<span style=&quot;color:yellow;font-size:${fontSize};&quot;>${text}</span>`" textWrap="false" />
                <HTMLLabel :text="nativeText" textWrap="false" />
                <HTMLLabel :text="text" :fontSize="fontSize" textWrap="false" />
                <CanvasView :height="canvasHeight" @draw="onDraw" />
                <CanvasView @draw="onDraw1" :height="canvasHeight"/>
                <!-- <GridLayout rows="auto"  ref="holder"> -->
                    <Label :text="text" :fontSize="fontSize" color="yellow" />
                    <CanvasLabel >
                <CSpan :fontSize="fontSize" :text="text" />
            </CanvasLabel>
                <!-- </GridLayout> -->
                <!-- WRONG -->
                
                <!-- <Button verticalTextAlignment="center" horizontalTextAlignment="center" textAlignment="center">
                <FormattedString>
                    <Span fontWeight="bold" text="A" verticalAlignment="center" fontSize="35" />
                    <Span text="test" fontSize="24" verticalAlignment="center" />
                </FormattedString>
            </Button> -->
            </StackLayout>
            <Slider row="1" max="100" :value="fontSize" @valueChange="onValueChange" />
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { Frame, StackLayout, View } from '@nativescript/core';
import { createNativeAttributedString } from '@nativescript-community/text';
import { Canvas, CanvasView, LayoutAlignment, Paint, StaticLayout } from '@nativescript-community/ui-canvas';

const text = new Date().toLocaleString();
const fontSize = 20;
const canvasHeight = fontSize * 1.5;
let nativeText = createNativeAttributedString({
    spans: [
        {
            fontSize,
            text
        }
    ]
});
const textPaint = new Paint();
textPaint.setTextSize(fontSize);
@Component
export default class Simple extends Vue {
    text = text;
    fontSize = fontSize;
    canvasHeight = canvasHeight;
    nativeText = nativeText;
    onBack() {
        Frame.topmost().goBack();
    }
    onValueChange(event) {
        this.fontSize = event.value;
        textPaint.textSize = this.fontSize;
        this.nativeText = createNativeAttributedString({
            spans: [
                {
                    fontSize: this.fontSize,
                    text
                }
            ]
        });
        (this.$refs.holder as Vue<StackLayout>)?.nativeView.eachChild((child) => {
            if (child instanceof CanvasView) {
                child.invalidate();
            }
            return true;
        });
    }
    onDraw({ canvas, object }: { canvas: Canvas; object: CanvasView }) {
        canvas.drawText(text, 0, fontSize, textPaint);
    }
    onDraw1({ canvas, object }: { canvas: Canvas; object: CanvasView }) {
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        const staticLayout = new StaticLayout(this.nativeText, textPaint, w, LayoutAlignment.ALIGN_NORMAL, 1, 0, true, 'end');
        canvas.translate(0, (h -staticLayout.getHeight())/2);
        staticLayout.draw(canvas);
    }
}
</script>
