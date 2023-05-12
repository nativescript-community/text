package com.nativescript.text;

import android.text.TextPaint;
import android.text.style.URLSpan;
import android.graphics.Color;

public class URLSpanNoUnderline extends URLSpan {
    private boolean disableStyle;
    private boolean showUnderline;
    private Color color;
    public URLSpanNoUnderline(String url, boolean showUnderline, Color color, boolean disableStyle) {
        super(url);
        this.showUnderline = showUnderline;
        this.color = color;
        this.disableStyle = disableStyle;
    }
    public URLSpanNoUnderline(String url, boolean showUnderline, Color color) {
        this(url, showUnderline, color, false);
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
        if (this.color != null){
            ds.setColor(color.toArgb());
        }
    }
    @Override
    public void onClick(android.view.View widget) {
        if (widget instanceof TextView) {
            ((TextView)widget).onURLSpanClick(this);
        }
    }
}