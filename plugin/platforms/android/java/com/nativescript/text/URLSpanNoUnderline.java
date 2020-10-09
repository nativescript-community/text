package com.nativescript.text;

import android.text.TextPaint;
import android.text.style.URLSpan;

public class URLSpanNoUnderline extends URLSpan {
    private boolean showUnderline;
    public URLSpanNoUnderline(String url, boolean showUnderline) {
        super(url);
        this.showUnderline = showUnderline;
    }
    @Override
    public void updateDrawState(TextPaint ds) {
        if (this.showUnderline) {
            super.updateDrawState(ds);
        }
//            super.updateDrawState(ds);
//            ds.setUnderlineText(false);
    }
}