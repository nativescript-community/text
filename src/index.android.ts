import { Application, Color, FormattedString, Span, backgroundColorProperty, knownFolders, path, profile } from '@nativescript/core';
import { Font, FontWeight } from '@nativescript/core/ui/styling/font';
import { TextAlignment, getTransformedText, textDecorationProperty } from '@nativescript/core/ui/text-base';
import { LightFormattedString } from './index-common';
import { layout } from '@nativescript/core/utils/utils';
export * from './index-common';

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
            const fontCacheKey: string = this.fontFamily + this.fontWeight + this.fontStyle;

            const typeface = typefaceCache[fontCacheKey];
            if (!typeface) {
                if (!context) {
                    context = Application.android.context;
                }
                this._typeface = typefaceCache[fontCacheKey] = com.nativescript.text.Font.createTypeface(context, fontPath, this.fontFamily, this.fontWeight, this.isBold, this.isItalic);
            } else {
                this._typeface = typeface;
            }
        }
        return this._typeface;
    });

    FormattedString.prototype.toNativeString = LightFormattedString.prototype.toNativeString = function () {
        let result = '';
        const length = this.spans.length;
        let span: Span;
        let maxFontSize = this.style?.fontSize || this.parent?.style.fontSize || 0;
        for (let i = 0; i < length; i++) {
            const s = this.spans.getItem(i);
            if (s.style.fontSize) {
                maxFontSize = Math.max(maxFontSize, s.style.fontSize);
            }
        }
        for (let i = 0; i < length; i++) {
            span = this.spans.getItem(i);
            result += span.toNativeString(maxFontSize) + (i < length - 1 ? String.fromCharCode(0x1f) : '');
        }

        return result;
    };

    const delimiter = String.fromCharCode(0x1e);
    Span.prototype.toNativeString = function (maxFontSize?: number) {
        const textTransform = this.parent.parent.textTransform;
        const spanStyle = this.style;
        let backgroundColor: Color;
        if (backgroundColorProperty.isSet(spanStyle)) {
            backgroundColor = spanStyle.backgroundColor;
        }

        let textDecoration;
        if (textDecorationProperty.isSet(spanStyle)) {
            textDecoration = spanStyle.textDecoration;
        } else if (this.parent.textDecoration) {
            // span.parent is FormattedString
            textDecoration = this.parent.style.textDecoration;
        } else if (textDecorationProperty.isSet(this.parent.parent.style)) {
            // span.parent.parent is TextBase
            textDecoration = this.parent.parent.style.textDecorations;
        }
        let verticalTextAlignment = this.verticalAlignment || this.parent.verticalAlignment;
        if (!verticalTextAlignment || verticalTextAlignment === 'stretch') {
            verticalTextAlignment = this.parent.parent.verticalTextAlignment;
        }
        let text = this.text;
        if (text && textTransform != null && textTransform !== 'none') {
            text = getTransformedText(text, textTransform);
        }
        const density = layout.getDisplayDensity();
        const result = `${this.fontFamily || 0}${delimiter}\
${this.fontSize !== undefined ? this.fontSize * density : -1}${delimiter}\
${this.fontWeight || ''}${delimiter}\
${this.fontStyle === 'italic' ? 1 : 0}${delimiter}\
${textDecoration || 0}${delimiter}\
${maxFontSize * density}${delimiter}\
${verticalTextAlignment && verticalTextAlignment !== 'stretch' ? verticalTextAlignment : ''}${delimiter}\
${this.lineHeight !== undefined ? this.lineHeight * density : -1}${delimiter}\
${this.letterSpacing !== undefined ? this.lineHeight * density : 9}${delimiter}\
${this.color ? this.color.android : -1}${delimiter}\
${backgroundColor ? backgroundColor.android : -1}${delimiter}\
${this.text}`;
        return result;
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
export const createNativeAttributedString = profile('getAndroidTypeface', function createNativeAttributedString(
    data:
        | {
              text: string;
              color?: Color | string | number;
              familyName?: string;
              fontSize?: number;
              letterSpacing?: number;
              lineHeight?: number;
              textAlignment?: number | TextAlignment;
          }
        | FormattedString
) {
    if (!context) {
        init();
    }
    if (typeof data['toNativeString'] === 'function') {
        const nativeString = (data as any).toNativeString();
        return (com as any).nativescript.text.Font.stringBuilderFromFormattedString(context, fontPath, nativeString);
    }
    // if (data.textAlignment && typeof data.textAlignment === 'string') {
    //     data.textAlignment = textAlignmentConverter(data.textAlignment);
    // }
    // if (data.color && !(data.color instanceof Color)) {
    //     data.color = new Color(data.color as any);
    // }
    const result = (com as any).nativescript.text.Font.stringBuilderFromHtmlString(context, fontPath, (data as any).text) as android.text.SpannableStringBuilder;
    return result;
});
