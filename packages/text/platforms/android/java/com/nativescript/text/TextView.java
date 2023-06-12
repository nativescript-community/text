package com.nativescript.text;

import androidx.appcompat.widget.AppCompatTextView;
import android.text.style.URLSpan;
import android.content.Context;

public class TextView extends AppCompatTextView {
    public URLSpanClickListener urlSpanClickListener;

    public TextView(Context context) {
        this(context, null);
    }
    public TextView(Context context, android.util.AttributeSet attrs) {
        super(context, attrs);
    }
    
    public void onURLSpanClick(URLSpan span) {
        if (this.urlSpanClickListener != null) {
            this.urlSpanClickListener.onClick(span);
        }
    }

    public static boolean attributedStringHasSpan(android.text.Spannable attributeString, java.lang.Class spanClass) {
        return attributeString.getSpans(0, attributeString.length(), spanClass).length > 0;
        // const urlSpan = result.getSpans(0, result.length(), android.text.style.URLSpan.class);

    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        if (getText() == null || getText().length() == 0) {
            setMeasuredDimension(0, 0);
        } else {
             super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        }
    }
}