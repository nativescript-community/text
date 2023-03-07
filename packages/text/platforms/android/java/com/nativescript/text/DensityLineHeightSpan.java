package com.nativescript.text;

import android.annotation.SuppressLint;
import android.graphics.Paint;
import android.graphics.Rect;
import android.text.TextPaint;
import android.text.style.LineHeightSpan;
import java.lang.CharSequence;

@SuppressLint("ParcelCreator")
public class DensityLineHeightSpan implements LineHeightSpan.WithDensity {
    private int mSize;
    private static float sProportion = 0;

    public DensityLineHeightSpan(int size) {
        mSize = size;
    }

    public void chooseHeight(CharSequence text, int start, int end,
                             int spanstartv, int v,
                             Paint.FontMetricsInt fm) {
        // Should not get called, at least not by StaticLayout.
        chooseHeight(text, start, end, spanstartv, v, fm, null);
    }

    public void chooseHeight(CharSequence text, int start, int end,
                             int spanstartv, int v,
                             Paint.FontMetricsInt fm, TextPaint paint) {
        int size = mSize;
        if (paint != null) {
            size *= paint.density;
        }

        final int originHeight = fm.descent - fm.ascent;
        // If original height is not positive, do nothing.
        if (originHeight <= 0) {
            return;
        }
        final float ratio = size * 1.0f / originHeight;
        fm.descent = Math.round(fm.descent * ratio);
        fm.ascent = fm.descent - size;
    }
}