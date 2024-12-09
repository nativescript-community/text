import { Color, CoreTypes, FormattedString, Screen, Span, Utils, ViewBase, knownFolders, path, profile } from '@nativescript/core';
import { Font, FontVariationSettings, FontWeightType } from '@nativescript/core/ui/styling/font';
import { getTransformedText, textDecorationProperty } from '@nativescript/core/ui/text-base';
import { ObjectSpans } from '.';
import { LightFormattedString } from './index-common';
export * from './index-common';

type ClickableSpan = new (owner: Span) => android.text.style.ClickableSpan;

export function adjustMinMaxFontScale(value, view) {
    // Only for iOS
}
function formattedStringToNativeString(formattedString, parent?, parentView = formattedString.parent, density?) {
    let maxFontSize = formattedString?.fontSize || parentView?.fontSize || 0;
    formattedString.spans.forEach((s) => {
        if (s.fontSize) {
            maxFontSize = Math.max(maxFontSize, s.fontSize);
        }
    });
    const options = [];
    if (!parent) {
        parent = formattedString;
    }
    formattedString.spans.forEach((s, index) => {
        const spanDetails = typeof s === 'string' ? s : spanToNativeString(s, parent, parentView, maxFontSize, index, density);
        if (spanDetails) {
            options.push(spanDetails);
        }
    });
    return `[${options.join(',')}]`;
}

let FONT_SIZE_FACTOR;
function spanToNativeString(span, parent: any, parentView: any, maxFontSize?, index = -1, density?) {
    let text = span.text;
    if (!text || (span.visibility && span.visibility !== 'visible')) {
        return null;
    }
    const textTransform = span.textTransform || parentView?.textTransform;
    let fontWeight = span.fontWeight;
    let fontStyle = span.fontStyle;
    let fontFamily = span.fontFamily;
    if (fontFamily || (fontWeight && fontWeight !== 'normal') || fontStyle) {
        fontFamily = fontFamily || parent?.fontFamily || parentView?.fontFamily;
        fontWeight = fontWeight || parent?.fontWeight || parentView?.fontWeight;
        fontStyle = fontStyle || parent?.fontStyle || parentView?.fontStyle;
    }
    const textDecoration = span?.textDecoration || parent?.textDecoration || parentView?.textDecoration;
    const textAlignment = span.textAlignment || parent?.textAlignment || parentView?.textAlignment;
    let verticalTextAlignment = span.verticalTextAlignment;

    // We CANT use parent verticalTextAlignment. Else it would break line height
    // for multiple line text you want centered in the View
    // if (!verticalTextAlignment || verticalTextAlignment === 'stretch') {
    //     verticalTextAlignment = parentView?.verticalTextAlignment;
    // }
    if (text && textTransform != null && textTransform !== 'none') {
        text = getTransformedText(text, textTransform);
    }
    if (!density) {
        // if (!FONT_SIZE_FACTOR) {
        //     FONT_SIZE_FACTOR = com.nativescript.text.Font.getFontSizeFactor(Utils.android.getApplicationContext()) / Screen.mainScreen.scale;
        // }
        // that means not for canvaslabel
        // density = FONT_SIZE_FACTOR;
        density = 1;
        // console.log('text FONT_SIZE_FACTOR', FONT_SIZE_FACTOR, Screen.mainScreen.scale)
        verticalTextAlignment = span.verticalAlignment || parent?.verticalAlignment;
    }
    let backgroundColor = span.backgroundColor || parent?.backgroundColor;
    if (backgroundColor && !(backgroundColor instanceof Color)) {
        backgroundColor = new Color(backgroundColor);
    }
    let color = span.color || parent?.color;
    if (color && !(color instanceof Color)) {
        color = new Color(color);
    }
    const lineHeight = span.lineHeight || parent?.lineHeight;
    const fontSize = span.fontSize || parent?.fontSize;
    const letterSpacing = span.letterSpacing || parent?.letterSpacing;
    return JSON.stringify({
        text,
        fontFamily,
        fontSize: fontSize ? fontSize * density : undefined,
        fontWeight: fontWeight ? fontWeight + '' : undefined,
        fontStyle: fontStyle !== 'normal' ? fontStyle : undefined,
        textDecoration,
        textAlignment,
        tapIndex: span._tappable && index !== -1 ? index : undefined,
        maxFontSize: maxFontSize ? maxFontSize * density : undefined,
        relativeSize: span.relativeSize,
        verticalTextAlignment,
        lineHeight: lineHeight !== undefined ? lineHeight * density : undefined,
        letterSpacing: letterSpacing !== undefined ? letterSpacing * density : undefined,
        color: color ? color.android : undefined,
        backgroundColor: backgroundColor ? backgroundColor.android : undefined
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
            const owner = this.owner?.get();
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
    context = Utils.android.getApplicationContext();

    Font.prototype.getAndroidTypeface = profile('getAndroidTypeface', function () {
        const theFont = this as Font;
        if (!theFont['_typeface']) {
            // css loader to json transform font-family: res/toto to font-family: res,toto
            const fontFamily = theFont.fontFamily?.replace(/res,/g, 'res/');
            const fontVariationSettings = FontVariationSettings.toString(theFont.fontVariationSettings);
            const fontCacheKey = fontFamily + (theFont.fontWeight || '') + (theFont.fontStyle || '') + (fontVariationSettings ?? '');

            const typeface = typefaceCache[fontCacheKey];
            if (!typeface) {
                if (!context) {
                    context = Utils.android.getApplicationContext();
                }
                theFont['_typeface'] = typefaceCache[fontCacheKey] = com.nativescript.text.Font.createTypeface(
                    context,
                    fontPath,
                    fontFamily,
                    theFont.fontWeight + '',
                    theFont.isBold,
                    theFont.isItalic,
                    fontVariationSettings
                );
            } else {
                theFont['_typeface'] = typeface;
            }
        }
        return theFont['_typeface'];
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
        }
    });
    Span.prototype.toNativeString = function (maxFontSize?: number) {
        const parent = this.parent;
        const grandParent = parent?.parent;
        return spanToNativeString(this, parent, grandParent, maxFontSize);
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

interface AttributedStringData {
    text: string;
    color?: Color | string | number;
    familyName?: string;
    fontSize?: number;
    fontWeight?: string;
    letterSpacing?: number;
    lineHeight?: number;
    lineBreak?: number;
    relativeSize?: number;
    linkColor?: string | Color;
    linkDecoration?: string;
    textAlignment?: number | CoreTypes.TextAlignmentType;
}

export function createNativeAttributedString(
    data: AttributedStringData | FormattedString | ObjectSpans,
    parent?: any,
    parentView?: ViewBase,
    autoFontSizeEnabled = false,
    fontSizeRatio = 1, // used only on iOS,
    density? // used only on Android
) {
    if (!context) {
        init();
    }
    if (data instanceof FormattedString || data instanceof LightFormattedString || (data as ObjectSpans).spans) {
        const strData = formattedStringToNativeString(data, undefined, this, density);
        return com.nativescript.text.Font.stringBuilderFromFormattedString(context, fontPath, parentView?.['fontFamily'] || null, strData, null);
    }
    const theData = data as AttributedStringData;
    const linkColor = theData.linkColor || parentView?.['linkColor'];
    const aLinkColor = linkColor ? (linkColor instanceof Color ? linkColor : new Color(linkColor)).android : null;
    const result = com.nativescript.text.Font.stringBuilderFromHtmlString(
        context,
        fontPath,
        theData.familyName || parentView?.['fontFamily'] || null,
        theData.text,
        (theData.linkDecoration && theData.linkDecoration) !== 'underline' || parentView?.['linkUnderline'] === false,
        aLinkColor
    );
    return result;
}

export function createSpannable(span: any, parentView: any, parent?: any, maxFontSize?: number) {
    const details = spanToNativeString(span, parent, parentView, maxFontSize, -1, 1);
    let ssb: android.text.SpannableStringBuilder;
    if (details) {
        ssb = com.nativescript.text.Font.stringBuilderFromFormattedString(context, fontPath, parentView?.['fontFamily'] || null, `[${details}]`, span._ssb);
        if (span.tappable) {
            initializeClickableSpan();
            ssb.setSpan(new ClickableSpan(span), 0, length, 33 /* android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE */);
        }
    }
    return ssb;
}
