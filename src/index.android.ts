import { Application, Color, CoreTypes, FormattedString, Span, ViewBase, backgroundColorProperty, knownFolders, path, profile } from '@nativescript/core';
import { Font, FontWeight } from '@nativescript/core/ui/styling/font';
import { getTransformedText, textDecorationProperty } from '@nativescript/core/ui/text-base';
import { LightFormattedString } from './index-common';
import { layout } from '@nativescript/core/utils/utils';
import { ObjectSpans, getMaxFontSize } from '.';
export * from './index-common';

type ClickableSpan = new (owner: Span) => android.text.style.ClickableSpan;

function formattedStringToNativeString(formattedString) {
    let maxFontSize = formattedString?.fontSize || formattedString.parent?.fontSize || 0;
    formattedString.spans.forEach((s) => {
        if (s.fontSize) {
            maxFontSize = Math.max(maxFontSize, s.fontSize);
        }
    });
    const options = [];
    formattedString.spans.forEach((s) => options.push(spanToNativeString(s, maxFontSize)));
    return `[${options.join(',')}]`;
}
function spanToNativeString(span, maxFontSize?) {
    const parent = span.parent;
    const grandParent = parent?.parent;
    const spanStyle = span.style;
    const textTransform = span.textTransform || grandParent?.textTransform;
    let fontWeight = span.fontWeight;
    let fontStyle = span.fontStyle;
    let fontFamily = span.fontFamily;
    if (fontFamily || (fontWeight && fontWeight !== 'normal') || fontStyle) {
        fontFamily = fontFamily || (parent && parent.fontFamily) || (grandParent && grandParent.fontFamily);
        fontWeight = fontWeight || (parent && parent.fontWeight) || (grandParent && grandParent.fontWeight);
        fontStyle = fontStyle || (parent && parent.fontStyle) || (grandParent && grandParent.fontStyle);
    }
    let textDecoration;
    if (spanStyle && textDecorationProperty.isSet(spanStyle)) {
        textDecoration = spanStyle.textDecoration;
    } else if (span.textDecoration) {
        textDecoration = spanStyle.textDecoration;
    } else if (parent?.textDecoration) {
        // span.parent is FormattedString
        textDecoration = parent?.textDecoration;
    } else if (!!grandParent && textDecorationProperty.isSet(grandParent?.style)) {
        // span.parent.parent is TextBase
        textDecoration = grandParent?.style.textDecoration;
    }
    const verticalTextAlignment = span.verticalAlignment || parent?.verticalAlignment;
    // if (!verticalTextAlignment || verticalTextAlignment === 'stretch') {
    //     verticalTextAlignment = grandParent?.verticalTextAlignment;
    // }
    let text = span.text;
    if (text && textTransform != null && textTransform !== 'none') {
        text = getTransformedText(text, textTransform);
    }
    const density = spanStyle ? layout.getDisplayDensity() : 1;
    let backgroundColor = span.backgroundColor;
    if (backgroundColor && !(backgroundColor instanceof Color)) {
        backgroundColor = new Color(backgroundColor);
    }
    let color = span.color;
    if (color && !(color instanceof Color)) {
        color = new Color(color);
    }
    return JSON.stringify({
        text,
        fontFamily,
        fontSize: span.fontSize ? span.fontSize * density : undefined,
        fontWeight: fontWeight ? fontWeight + '' : undefined,
        fontStyle: fontStyle !== 'normal' ? fontStyle : undefined,
        textDecoration,
        maxFontSize: maxFontSize ? maxFontSize * density : undefined,
        relativeSize: span.relativeSize,
        verticalTextAlignment,
        lineHeight: span.lineHeight !== undefined ? span.lineHeight * density : undefined,
        letterSpacing: span.letterSpacing,
        color: color ? color.android : undefined,
        backgroundColor: backgroundColor ? backgroundColor.android : undefined,
    });
}

// eslint-disable-next-line no-redeclare
let ClickableSpan: ClickableSpan;

function initializeClickableSpan(): void {
    if (ClickableSpan) {
        return;
    }

    @NativeClass
    class ClickableSpanImpl extends android.text.style.ClickableSpan {
        owner: WeakRef<Span>;

        constructor(owner: Span) {
            super();
            this.owner = new WeakRef(owner);
            return global.__native(this);
        }
        onClick(view: android.view.View): void {
            const owner = this.owner.get();
            if (owner) {
                owner._emit(Span.linkTapEvent);
            }
            view.clearFocus();
            view.invalidate();
        }
        updateDrawState(tp: android.text.TextPaint): void {
            // don't style as link
        }
    }

    ClickableSpan = ClickableSpanImpl;
}

export const typefaceCache: { [k: string]: android.graphics.Typeface } = {};
let context: android.content.Context;
const fontPath = path.join(knownFolders.currentApp().path, 'fonts');

let initialized = false;
export function init() {
    if (initialized) {
        return;
    }
    initialized = true;
    context = Application.android.context;

    Font.prototype.getAndroidTypeface = profile('getAndroidTypeface', function () {
        if (!this._typeface) {
            // css loader to json transform font-family: res/toto to font-family: res,toto
            const fontFamily = this.fontFamily?.replace(/res,/g, 'res/');
            const fontCacheKey: string = fontFamily + (this.fontWeight || '') + (this.fontStyle || '');

            const typeface = typefaceCache[fontCacheKey];
            if (!typeface) {
                if (!context) {
                    context = Application.android.context;
                }
                this._typeface = typefaceCache[fontCacheKey] = com.nativescript.text.Font.createTypeface(context, fontPath, fontFamily, this.fontWeight, this.isBold, this.isItalic);
            } else {
                this._typeface = typeface;
            }
        }
        return this._typeface;
    });

    FormattedString.prototype.toNativeString = LightFormattedString.prototype.toNativeString = function () {
        return formattedStringToNativeString(this);
    };

    // const delimiter = String.fromCharCode(0x1e);
    Object.defineProperty(Span.prototype, 'relativeSize', {
        set(value) {
            this._relativeSize = value;
            this.notifyPropertyChange('relativeSize', value);
        },
        get() {
            return this._relativeSize;
        },
    });
    Span.prototype.toNativeString = function (maxFontSize?: number) {
        return spanToNativeString(this, maxFontSize);
    };
}

declare module '@nativescript/core/ui/text-base/formatted-string' {
    interface FormattedString {
        toNativeString(maxFontSize?: number): string;
    }
}
declare module '@nativescript/core/ui/text-base/span' {
    interface Span {
        toNativeString(maxFontSize?: number): string;
    }
}

function isBold(fontWeight: FontWeight): boolean {
    return fontWeight === 'bold' || fontWeight === '700' || fontWeight === '800' || fontWeight === '900';
}

// type BaselineAdjustedSpan = new (fontSize, align: string, maxFontSize) => android.text.style.MetricAffectingSpan;

// // eslint-disable-next-line no-redeclare
// let BaselineAdjustedSpan: BaselineAdjustedSpan;
// function initializeBaselineAdjustedSpan(): void {
//     if (BaselineAdjustedSpan) {
//         return;
//     }
//     @NativeClass
//     class BaselineAdjustedSpanImpl extends android.text.style.CharacterStyle {
//         align: string = 'baseline';
//         maxFontSize: number;

//         constructor(private fontSize, align: string, maxFontSize) {
//             super();

//             this.align = align;
//             this.maxFontSize = maxFontSize;
//         }

//         updateDrawState(paint: android.text.TextPaint) {
//             this.updateState(paint);
//         }

//         updateState(paint: android.text.TextPaint) {
//             const fontSize = this.fontSize;
//             paint.setTextSize(fontSize);
//             const metrics = paint.getFontMetrics();
//             let result = computeBaseLineOffset(this.align, metrics.ascent, metrics.descent, metrics.bottom, metrics.top, fontSize, this.maxFontSize);
//             result += metrics.bottom;
//             paint.baselineShift = result;
//         }
//     }

//     BaselineAdjustedSpan = BaselineAdjustedSpanImpl as any;
// }
export function createNativeAttributedString(
    data:
        | {
              text: string;
              color?: Color | string | number;
              familyName?: string;
              fontSize?: number;
              fontWeight?: string;
              letterSpacing?: number;
              lineHeight?: number;
              relativeSize?: number;
              textAlignment?: number | CoreTypes.TextAlignmentType;
          }
        | FormattedString
        | ObjectSpans,
    parent: ViewBase,
    autoFontSizeEnabled = false,
    fontSizeRatio = 1 // used only on iOS
) {
    if (!context) {
        init();
    }
    if (data instanceof FormattedString || data instanceof LightFormattedString || data.hasOwnProperty('spans')) {
        return com.nativescript.text.Font.stringBuilderFromFormattedString(context, fontPath, parent?.['fontFamily'] || null, formattedStringToNativeString(data));
    }
    const result = com.nativescript.text.Font.stringBuilderFromHtmlString(context, fontPath, parent?.['fontFamily'] || null, (data as any).text);
    return result;
}

let lineSeparator;
let Style: typeof android.text.style;
let Spanned: typeof android.text.Spanned;
export function createSpannable(span: any, parentView: any, parent?: any, maxFontSize?: number) {
    let text = span.text;
    if (!text || (span.visibility && span.visibility !== 'visible')) {
        return null;
    }
    const fontSize = span.fontSize;
    let fontWeight = span.fontWeight;
    let fontStyle = span.fontStyle;
    let fontFamily = span.fontFamily;

    const color = span.color;
    const textDecorations = span.textDecoration || (parent && parent.textDecoration);
    const backgroundcolor = span.backgroundColor || (parent && parent.backgroundColor);
    const verticalTextAlignment = span.verticalTextAlignment;
    const letterSpacing = span.letterSpacing || (parent && parent.letterSpacing);
    const lineHeight = span.lineHeight || (parent && parent.lineHeight);
    const realMaxFontSize = Math.max(maxFontSize, parentView.fontSize || 0);

    if (typeof text === 'boolean' || typeof text === 'number') {
        text = text.toString();
    }
    const textTransform = span.textTransform || (parent && parent.textTransform);
    if (textTransform) {
        text = getTransformedText(text, textTransform);
    }
    if (typeof text === 'string') {
        if (text.indexOf('\n') !== -1) {
            if (!lineSeparator) {
                lineSeparator = java.lang.System.getProperty('line.separator');
            }
            text = text.replace(/\\n/g, lineSeparator);
        }
    }
    const length = typeof text.length === 'function' ? text.length() : text.length;

    let ssb = span._ssb;
    if (!ssb) {
        span._ssb = ssb = new android.text.SpannableStringBuilder(text);
    } else {
        ssb.clear();
        ssb.clearSpans();
        ssb.append(text);
    }

    if (!Style) {
        Style = android.text.style;
    }
    if (!Spanned) {
        Spanned = android.text.Spanned;
    }
    const bold = isBold(fontWeight);
    const italic = fontStyle === 'italic';
    // if (getSDK() < 28) {
    if (bold && italic) {
        ssb.setSpan(new Style.StyleSpan(android.graphics.Typeface.BOLD_ITALIC), 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    } else if (bold) {
        ssb.setSpan(new Style.StyleSpan(android.graphics.Typeface.BOLD), 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    } else if (italic) {
        ssb.setSpan(new Style.StyleSpan(android.graphics.Typeface.ITALIC), 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    // }
    if (fontFamily || fontWeight || fontStyle) {
        fontFamily = fontFamily || (parent && parent.fontFamily) || (parentView && parentView.fontFamily);
        fontWeight = fontWeight || (parent && parent.fontWeight) || (parentView && parentView.fontWeight);
        fontStyle = fontWeight || (parent && parent.fontStyle) || (parentView && parentView.fontStyle);
        const fontCacheKey = fontFamily + fontWeight + fontStyle;

        let typeface = typefaceCache[fontCacheKey];
        if (!typeface) {
            // for now we dont handle CSpan (from @nativescript-community/ui-canvaslabel)
            const font = new Font(fontFamily, 10, fontStyle, fontWeight);
            typeface = typefaceCache[fontCacheKey] = font.getAndroidTypeface();
        }
        const typefaceSpan = new com.nativescript.text.CustomTypefaceSpan(fontFamily, typeface);
        ssb.setSpan(typefaceSpan, 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    if (verticalTextAlignment && verticalTextAlignment !== 'initial') {
        ssb.setSpan(new com.nativescript.text.BaselineAdjustedSpan(fontSize, verticalTextAlignment, realMaxFontSize as any), 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    if (fontSize) {
        ssb.setSpan(new Style.AbsoluteSizeSpan(fontSize), 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    if (span.relativeSize) {
        ssb.setSpan(new Style.RelativeSizeSpan(span.relativeSize), 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }

    if (letterSpacing) {
        ssb.setSpan(new Style.ScaleXSpan((letterSpacing + 1) / 10), 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }

    if (lineHeight !== undefined) {
        ssb.setSpan(new com.nativescript.text.HeightSpan(lineHeight), 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }

    if (color) {
        const ncolor = color instanceof Color ? color : new Color(color);
        ssb.setSpan(new Style.ForegroundColorSpan(ncolor.android), 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    if (backgroundcolor) {
        const color = backgroundcolor instanceof Color ? backgroundcolor : new Color(backgroundcolor);
        ssb.setSpan(new Style.BackgroundColorSpan(color.android), 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }

    if (textDecorations) {
        const underline = textDecorations.indexOf('underline') !== -1;
        if (underline) {
            ssb.setSpan(new Style.UnderlineSpan(), 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }

        const strikethrough = textDecorations.indexOf('line-through') !== -1;
        if (strikethrough) {
            ssb.setSpan(new Style.StrikethroughSpan(), 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }
    }
    if (span.tappable) {
        initializeClickableSpan();
        ssb.setSpan(new ClickableSpan(span), 0, length, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    return ssb;
}
