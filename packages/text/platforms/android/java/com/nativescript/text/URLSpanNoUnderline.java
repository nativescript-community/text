package com.nativescript.text;

import android.text.TextPaint;
import android.text.style.URLSpan;
import android.graphics.Color;

public class URLSpanNoUnderline extends URLSpan {
    private boolean disableStyle = false;
    private boolean showUnderline = false;
    private int color = 0;
    public URLSpanNoUnderline(String url, boolean showUnderline, int color, boolean disableStyle) {
        super(url);
        this.showUnderline = showUnderline;
        this.color = color;
        this.disableStyle = disableStyle;
    }
    public URLSpanNoUnderline(String url, boolean showUnderline, int color) {
        this(url, showUnderline, color, false);
    }
    public URLSpanNoUnderline(String url, boolean showUnderline) {
        this(url, showUnderline, 0);
    }
    @Override
    public void updateDrawState(TextPaint ds) {
        if (this.disableStyle) {
            return;
        }
        super.updateDrawState(ds);
        if (!this.showUnderline) {
            ds.setUnderlineText(false);
        }
        if (this.color != 0){
            ds.setColor(color);
        }
    }
    @Override
    public void onClick(android.view.View widget) {
        if (widget instanceof TextView) {
            ((TextView)widget).onURLSpanClick(this);
        }
    }
}