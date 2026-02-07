import { Color, CoreTypes, Font, FormattedString, ViewBase, fontInternalProperty, fontSizeProperty } from '@nativescript/core';
import { getTransformedText } from '@nativescript/core/ui/text-base';
import { ObjectSpans, getMaxFontSize, textAlignmentConverter } from './index-common';
import { LightFormattedString } from './index.android';
export * from './index-common';

let iOSUseDTCoreText = true;
export function disableIOSDTCoreText() {
    iOSUseDTCoreText = false;
}
export function usingIOSDTCoreText() {
    return iOSUseDTCoreText;
}
DTCoreTextFontDescriptor.asyncPreloadFontLookupTable();
export function init() {}

function _createNativeAttributedString({
    autoFontSizeEnabled = false,
    color,
    familyName,
    fontSize,
    fontSizeRatio = 1,
    fontWeight,
    letterSpacing,
    lineBreak,
    lineHeight,
    linkColor,
    linkDecoration,
    text,
    textAlignment,
    useCustomLinkTag
}: {
    text: string;
    color: Color;
    familyName: string;
    fontWeight: string;
    fontSize: number;
    letterSpacing?: number;
    lineHeight?: number;
    lineBreak?: number;
    linkColor?: Color;
    linkDecoration?: string;
    useCustomLinkTag?: boolean;
    textAlignment: NSTextAlignment;
    autoFontSizeEnabled: boolean;
    fontSizeRatio: number;
}) {
    let trueFontFamily = familyName
        ? familyName
              .replace(/'/g, '')
              .split(',')
              .map((s) => `'${s}'`)
              .join(',')
        : null;
    if (!trueFontFamily) {
        if (iOSUseDTCoreText) {
        } else {
            trueFontFamily = '-apple-system';
        }
    }
    // if (iOSUseDTCoreText) {
    let style = '';
    if (linkColor || linkDecoration) {
        style =
            '<style>' +
            `a, a:link, a:visited { ${linkColor ? `color:${linkColor.hex} !important; text-decoration-color:${linkColor.hex} !important;` : ''} text-decoration: ${linkDecoration || 'none'}; }` +
            '</style>';
    }
    const htmlString =
        style +
        (color || familyName || fontSize || fontWeight
            ? `<span style=" ${color ? `color: ${color};` : ''}  ${trueFontFamily ? `font-family:${trueFontFamily};` : ''}${fontSize ? `font-size: ${fontSize * fontSizeRatio}px;` : ''}${
                  fontWeight ? `font-weight: ${fontWeight};` : ''
              }">${text}</span>`
            : text);

    return NSTextUtils.createNativeHTMLAttributedString(
        {
            htmlString,
            fontSize,
            fontWeight,
            letterSpacing,
            lineHeight,
            lineBreak,
            linkColor,
            linkDecoration,
            color,
            textAlignment,
            autoFontSizeEnabled,
            fontSizeRatio,
            useCustomLinkTag
        },
        iOSUseDTCoreText
    );
}

// TODO: fix typings
declare const NSTextUtils;
export function createNativeAttributedString(
    data:
        | {
              text: string;
              color?: Color | string | number;
              familyName?: string;
              fontSize?: number;
              letterSpacing?: number;
              lineHeight?: number;
              textAlignment?: NSTextAlignment | CoreTypes.TextAlignmentType;
          }
        | FormattedString
        | ObjectSpans,
    parent?: any,
    parentView?: ViewBase,
    autoFontSizeEnabled = false,
    fontSizeRatio = 1
) {
    if (data instanceof FormattedString || data instanceof LightFormattedString || data['spans']) {
        // const ssb = NSMutableAttributedString.new();
        const maxFontSize = getMaxFontSize(data as any);
        // const _spanRanges = [];
        // let spanStart = 0;
        let hasLink = false;
        const details = [];
        if (!parent) {
            parent = data;
        }
        data['spans'].forEach((s, index) => {
            const spanDetails = typeof s === 'string' ? s : createSpannableDetails(s, index, parentView, parent, maxFontSize, autoFontSizeEnabled, fontSizeRatio);
            if (spanDetails) {
                details.push(spanDetails);
                if (s._tappable) {
                    hasLink = true;
                }
            }
        });
        if (parentView) {
            if (parentView['nativeTextViewProtected']) {
                parentView['nativeTextViewProtected'].selectable = parentView['selectable'] === true || hasLink;
            }
            if ((parentView as any)._setTappableState) {
                (parentView as any)._setTappableState(hasLink);
            }
            // parent['_spanRanges'] = _spanRanges;
        }
        return NSTextUtils.createNativeAttributedString({ details });
        // return ssb;
    }
    if (data.textAlignment && typeof data.textAlignment === 'string') {
        data.textAlignment = textAlignmentConverter(data.textAlignment);
    }
    // if (data.color && !(data.color instanceof Color)) {
    //     data.color = new Color(data.color as any);
    // }
    data['autoFontSizeEnabled'] = autoFontSizeEnabled;
    data['fontSizeRatio'] = fontSizeRatio;
    return _createNativeAttributedString(data as any);
}
export function createSpannable(span: any, index, parentView: any, parent?: any, maxFontSize?, autoFontSizeEnabled = false, fontSizeRatio = 1) {
    const details = createSpannableDetails(span, index, parentView, parent, maxFontSize, autoFontSizeEnabled, fontSizeRatio);
    return details ? NSTextUtils.createNativeAttributedString({ details: [details] }) : null;
}

// TODO: refactor this is duplicated in N, ui-canvas, ui-text
export function adjustMinMaxFontScale(value, view) {
    let finalValue;
    if (view.iosAccessibilityAdjustsFontSize) {
        finalValue = value;

        if (view.iosAccessibilityMinFontScale && view.iosAccessibilityMinFontScale > value) {
            finalValue = view.iosAccessibilityMinFontScale;
        }
        if (view.iosAccessibilityMaxFontScale && view.iosAccessibilityMaxFontScale < value) {
            finalValue = view.iosAccessibilityMaxFontScale;
        }
    } else {
        finalValue = 1.0;
    }
    return finalValue;
}
export function createSpannableDetails(span: any, index, parentView: any, parent?: any, maxFontSize?, autoFontSizeEnabled = false, fontSizeRatio = 1) {
    let text = span.text;
    const html = span.html;
    if (html) {
        text = _createNativeAttributedString({ ...span, text: html, autoFontSizeEnabled, fontSizeRatio });
    }
    if (!text || (span.visibility && span.visibility !== 'visible')) {
        return null;
    }
    if (!(text instanceof NSAttributedString)) {
        if (!(typeof text === 'string')) {
            text = text.toString();
        }
        if (text.indexOf('\n') !== -1) {
            text = text.replace(/\\n/g, '\u{2029}');
        }
        const textTransform = span.textTransform || parent?.textTransform;
        if (textTransform) {
            text = getTransformedText(text, textTransform);
        }
    }
    const fontFamily = span.fontFamily;
    const fontSize = span.fontSize;
    let fontScale = 1;
    if (fontSize === undefined) {
        if (span.style?.fontScaleInternal) {
            fontScale = adjustMinMaxFontScale(span.style.fontScaleInternal, span);
        } else if (parent?.style?.fontScaleInternal) {
            fontScale = adjustMinMaxFontScale(parent.style.fontScaleInternal, parent);
        } else if (parentView?.style?.fontScaleInternal) {
            fontScale = adjustMinMaxFontScale(parentView.style.fontScaleInternal, parentView);
        }
    }

    let realFontSize = fontSize || parent?.fontSize || parentView?.fontSize;
    if (span.relativeSize) {
        realFontSize = (parent?.fontSize || parentView?.fontSize) * span.relativeSize;
    }
    const realMaxFontSize = Math.max(maxFontSize, realFontSize || 0);
    const fontWeight = span.fontWeight;
    const fontstyle = span.fontStyle;
    const fontVariationSettings = span.fontVariationSettings || parent?.fontVariationSettings || parentView?.fontVariationSettings;
    // const textColor = span.color || (parent?.color) || (parentView && !(parentView.nativeView instanceof UIButton) && parentView.color);
    // TODO: ensure we dont need parent view color. First test says no
    const textColor = span.color || parent?.color;
    const backgroundcolor = span.backgroundColor || parent?.backgroundColor;
    const textDecoration = span.textDecoration || parent?.textDecoration;
    const letterSpacing = span.letterSpacing || parent?.letterSpacing;
    const lineHeight = span.lineHeight || parent?.lineHeight;
    const textAlignment = span.textAlignment || parent?.textAlignment || parentView?.textAlignment;
    const verticalTextAlignment = span.verticalAlignment || parent?.verticalAlignment;
    let iosFont;
    if ((fontWeight && fontWeight !== 'normal') || fontstyle || fontFamily || realFontSize || fontSizeRatio !== 1 || fontScale !== 1 || fontVariationSettings) {
        const font = new Font(
            fontFamily || parent?.fontFamily || parentView?.fontFamily,
            realFontSize ? realFontSize * fontSizeRatio : undefined,
            fontstyle || parent?.fontStyle || parentView?.fontStyle,
            fontWeight || parent?.fontWeight || parentView?.fontWeight,
            fontScale,
            fontVariationSettings || parent?.fontVariationSettings || parentView?.fontVariationSettings
        );
        iosFont = font.getUIFont(UIFont.systemFontOfSize(parentView?.[fontSizeProperty.getDefault] ? parentView[fontSizeProperty.getDefault]() : 16));
    } else if (parentView) {
        iosFont = parentView[fontInternalProperty.getDefault]();
    } else {
        // in this case we dont want to set a font to use the drawing parent font
        // iosFont = Font.default.getUIFont(UIFont.systemFontOfSize(16));
    }

    return {
        text,
        tapIndex: span._tappable ? index : undefined,
        autoFontSizeEnabled,
        iosFont,
        realFontSize,
        fontSize /* || iosFont?.pointSize */, // testing for fontSize undefined to be defined by canvas
        realMaxFontSize,
        backgroundColor: backgroundcolor ? (backgroundcolor instanceof Color ? backgroundcolor.ios : new Color(backgroundcolor).ios) : null,
        color: textColor ? (textColor instanceof Color ? textColor.ios : new Color(textColor).ios) : null,
        textDecoration,
        letterSpacing,
        lineHeight,
        verticalTextAlignment,
        textAlignment: textAlignment !== 'initial' ? textAlignment : null
    };
}
