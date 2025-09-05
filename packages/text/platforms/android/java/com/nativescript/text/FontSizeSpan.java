package com.nativescript.text;

import android.content.Context;
import android.text.ParcelableSpan;
import android.text.TextPaint;
import android.text.TextUtils;
import android.text.style.MetricAffectingSpan;
import android.util.Log;

public class FontSizeSpan extends MetricAffectingSpan {

    private final float mSize;
    private boolean mDip;

    private Context mContext;

    /**
     * Set the text size to <code>size</code> physical pixels.
     */
    public FontSizeSpan(Context context, float size) {
        mContext = context;
        mSize = size;
        mDip = false;
    }

    /**
     * Set the text size to <code>size</code> physical pixels,
     * or to <code>size</code> device-independent pixels if
     * <code>dip</code> is true.
     */
    public FontSizeSpan(Context context, float size, boolean dip) {
        mContext = context;
        mDip = dip;
        mSize = size;
    }

    public float getSize() {
        return mSize;
    }

    public boolean getDip() {
        return mDip;
    }
    static float FONT_SIZE_FACTOR = -1.0f;
    static float SCREEN_DENSITY = -1.0f;
    private void setTextPaintSize(TextPaint ds) {
        if (mDip) {
            int flags = ds.getFlags();
            // dont think we can cache this as it would change when display change on the phone
            if (FONT_SIZE_FACTOR == -1) {
                android.util.DisplayMetrics metrics = mContext.getResources().getDisplayMetrics();
                SCREEN_DENSITY = metrics.density;
                FONT_SIZE_FACTOR = android.util.TypedValue.applyDimension(android.util.TypedValue.COMPLEX_UNIT_SP, 1, metrics);
            }
            if (mDip && (flags & 2048) != 2048) {
                // this case is for use with TextView
                ds.setTextSize(mSize * FONT_SIZE_FACTOR);
            } else {
                // this case is for StaticLayout drawing in canvas
                ds.setTextSize(mSize * FONT_SIZE_FACTOR / SCREEN_DENSITY);
            }
        } else {
            ds.setTextSize(mSize);
        }
    }

    @Override
    public void updateDrawState(TextPaint ds) {
        setTextPaintSize(ds);
    }

    @Override
    public void updateMeasureState(TextPaint ds) {
        setTextPaintSize(ds);
    }
}
