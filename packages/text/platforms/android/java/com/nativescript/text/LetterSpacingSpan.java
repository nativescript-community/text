package com.nativescript.text;

import android.annotation.TargetApi;
import android.content.Context;
import android.os.Parcel;
import android.text.TextPaint;
import android.text.style.MetricAffectingSpan;

/**
 * Created by alex on 19/02/2015.
 */
public class LetterSpacingSpan extends MetricAffectingSpan {
    private float letterSpacing;

    /**
     * @param letterSpacing
     */
    public LetterSpacingSpan(float letterSpacing) {
        this.letterSpacing = letterSpacing;
    }

    public float getLetterSpacing() {
        return letterSpacing;
    }

    @Override
    public void updateDrawState(TextPaint ds) {
        apply(ds);
    }

    @Override
    public void updateMeasureState(TextPaint paint) {
        apply(paint);
    }

    private void apply(TextPaint paint) {
        paint.setLetterSpacing(letterSpacing);
    }
}