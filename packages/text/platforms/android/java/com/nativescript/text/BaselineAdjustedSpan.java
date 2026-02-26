package com.nativescript.text;

import android.graphics.Paint;
import android.text.TextPaint;
import android.text.style.CharacterStyle;

import android.util.Log;

public class BaselineAdjustedSpan extends CharacterStyle {
    private float fontSize;
    private String align;
    private float maxFontSize;

    public BaselineAdjustedSpan(float fontSize, String align, float maxFontSize) {
        super();
        this.fontSize = fontSize;
        this.align = align;
        this.maxFontSize = maxFontSize;
    }

    @Override
    public void updateDrawState(TextPaint ds) {
        this.updateState(ds);
    }

    private int computeBaseLineOffset(String align, float fontAscent, float fontDescent, 
            float fontBottom, float fontTop, float fontSize, float maxFontSize) {
        
        // Calculate metrics for max font size
        Paint.FontMetrics maxMetrics = new Paint.FontMetrics();
        float currentSize = fontSize;
        Paint tempPaint = new Paint();
        tempPaint.setTextSize(maxFontSize);
        tempPaint.getFontMetrics(maxMetrics);
        
        // Current font height (from ascent to descent)
        float currentHeight = fontDescent - fontAscent;
        
        // Max font height (from ascent to descent)
        float maxHeight = maxMetrics.descent - maxMetrics.ascent;
        
        int result = 0;
        
        switch (align) {
            case "top":
                // Align the top of current text with top of max text
                // Need to shift down if current is smaller
                result = (int) (maxMetrics.ascent - fontAscent);
                break;

            case "bottom":
                // Align the bottom of current text with bottom of max text
                // Need to shift up if current is smaller
                result = (int) (maxMetrics.descent - fontDescent);
                break;

            case "text-top":
                // Align current ascent with max ascent (similar to top but uses ascent instead of top)
                result = (int) (maxMetrics.ascent - fontAscent);
                break;

            case "text-bottom":
                // Align current descent with max descent
                result = (int) (maxMetrics.descent - fontDescent);
                break;

            case "middle":
            case "center":
                // Center the text vertically within the max height
                // Formula: shift = (maxHeight - currentHeight) / 2 + (maxAscent - currentAscent)
                result = (int) ((maxHeight - currentHeight) / 2 + (maxMetrics.ascent - fontAscent));
                break;

            case "super":
                // Superscript: shift up by a percentage of max height
                result = (int) (-maxHeight * 0.4f);
                break;

            case "sub":
                // Subscript: shift down by a percentage of max height
                result = (int) (maxHeight * 0.25f);
                break;

            default:
                result = 0;
                break;
        }
        
        return result;
    }

    public void updateState(TextPaint paint) {
        float stateFontSize = fontSize;
        float stateMaxFontSize = maxFontSize;
        
        if (fontSize != -1) {
            paint.setTextSize(fontSize);
        } else {
            stateFontSize = paint.getTextSize();
            stateMaxFontSize = Math.max(stateMaxFontSize, stateFontSize);
        }
        
        Paint.FontMetrics metrics = paint.getFontMetrics();
        
        int baselineShift = computeBaseLineOffset(align, metrics.ascent, metrics.descent, 
                metrics.bottom, metrics.top, stateFontSize, stateMaxFontSize);
        paint.baselineShift = baselineShift;
    }
}