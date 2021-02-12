package com.nativescript.text;

import android.graphics.Paint;
import android.text.TextPaint;
import android.text.style.CharacterStyle;

import android.util.Log;

public class BaselineAdjustedSpan extends CharacterStyle {
    private Float fontSize;
    private String align;
    private Float maxFontSize;

    public BaselineAdjustedSpan(Float fontSize, String align, Float maxFontSize) {
        super();
        this.fontSize = fontSize;
        this.align = align;
        this.maxFontSize = maxFontSize;
    }

    @Override
    public void updateDrawState(TextPaint ds) {
        this.updateState(ds);
    }

    private int computeBaseLineOffset(String align, float fontAscent, float fontDescent, float fontBottom,
            float fontTop, float fontSize, float maxFontSize) {
        int result = 0;
        switch (align) {
            case "top":
                result = (int) (-maxFontSize - fontBottom - fontTop);
                break;

            case "bottom":
                result = (int) fontBottom;
                break;

            case "text-top":
                result = (int) (-maxFontSize - fontDescent - fontAscent);
                break;

            case "text-bottom":
                result = (int) (fontBottom - fontDescent);
                break;

            case "middle":
            case "center":
                result = (int) ((fontAscent - fontDescent) / 2 - fontAscent - maxFontSize / 2);
                break;

            case "super":
                result = -(int) (maxFontSize - fontSize);
                break;

            case "sub":
                result = 0;
                break;
        }
        return result;
    }

    public void updateState(TextPaint paint) {
        paint.setTextSize(fontSize);
        Paint.FontMetrics metrics = paint.getFontMetrics();
        // TODO: when or why should we add bottom?
        // result += metrics.bottom;
        int baselineShift =  computeBaseLineOffset(align, metrics.ascent, metrics.descent, metrics.bottom, metrics.top, fontSize, maxFontSize);
        paint.baselineShift = baselineShift;
    }
}