import { Color, CoreTypes, Font, FormattedString, ViewBase, fontInternalProperty } from '@nativescript/core';
import { getTransformedText } from '@nativescript/core/ui/text-base';
import { ObjectSpans, getMaxFontSize, textAlignmentConverter } from './index-common';
import { LightFormattedString } from './index.android';
export * from './index-common';

export function init() {}

function _createNativeAttributedString({
    text,
    familyName = '-apple-system',
    fontSize,
    fontWeight,
    letterSpacing,
    lineHeight,
    lineBreak,
    linkColor,
    linkDecoration,
    color,
    textAlignment,
    autoFontSizeEnabled = false,
    fontSizeRatio = 1,
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
    const trueFontFamily = familyName
        ? familyName
              .replace(/'/g, '')
              .split(',')
              .map((s) => `'${s}'`)
              .join(',')
        : null;

    // if (iOSUseDTCoreText) {
    let style = '';
    if (linkColor || linkDecoration) {
        style = '<style>' + `a, a:link, a:visited { ${linkColor ? `color:${linkColor.hex} !important;` : ''} text-decoration: ${linkDecoration || 'none'}; }` + '</style>';
    }
    const htmlString =
        style +
        (color || familyName || fontSize || fontWeight
            ? `<span style=" ${color ? `color: ${color};` : ''}  ${trueFontFamily ? `font-family:${trueFontFamily};` : ''}${fontSize ? `font-size: ${fontSize * fontSizeRatio}px;` : ''}${
                  fontWeight ? `font-weight: ${fontWeight};` : ''
              }">${text}</span>`
            : text);
    return NSTextUtils.createNativeHTMLAttributedString({
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
    });
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
            const spanDetails = createSpannableDetails(s, index, parentView, parent, maxFontSize, autoFontSizeEnabled, fontSizeRatio);
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
export function createSpannableDetails(span: any, index, parentView: any, parent?: any, maxFontSize?, autoFontSizeEnabled = false, fontSizeRatio = 1) {
    let text = span.text;
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
        const textTransform = span.textTransform || (parent && parent.textTransform);
        if (textTransform) {
            text = getTransformedText(text, textTransform);
        }
    }
    const fontFamily = span.fontFamily;
    const fontSize = span.fontSize;
    let realFontSize = fontSize || (parent && parent.fontSize) || (parentView && parentView.fontSize);
    if (span.relativeSize) {
        realFontSize = ((parent && parent.fontSize) || (parentView && parentView.fontSize)) * span.relativeSize;
    }
    const realMaxFontSize = Math.max(maxFontSize, realFontSize || 0);
    const fontWeight = span.fontWeight;
    const fontstyle = span.fontStyle;
    const textColor = span.color || (parent && parent.color) || (parentView && !(parentView.nativeView instanceof UIButton) && parentView.color);
    const backgroundcolor = span.backgroundColor || (parent && parent.backgroundColor);
    const textDecoration = span.textDecoration || (parent && parent.textDecoration);
    const letterSpacing = span.letterSpacing || (parent && parent.letterSpacing);
    const lineHeight = span.lineHeight || (parent && parent.lineHeight);
    const textAlignment = span.textAlignment || (parent && parent.textAlignment) || (parentView && parentView.textAlignment);
    const verticalTextAlignment = span.verticalAlignment || parent?.verticalAlignment;
    let iosFont;
    if ((fontWeight && fontWeight !== 'normal') || fontstyle || fontFamily || realFontSize || fontSizeRatio !== 1) {
        const font = new Font(
            fontFamily || (parent && parent.fontFamily) || (parentView && parentView.fontFamily),
            realFontSize * fontSizeRatio,
            fontstyle || (parent && parent.fontStyle) || (parentView && parentView.fontStyle),
            fontWeight || (parent && parent.fontWeight) || (parentView && parentView.fontWeight)
        );
        iosFont = font.getUIFont(UIFont.systemFontOfSize(realFontSize));
    } else {
        iosFont = parentView[fontInternalProperty.getDefault]();
    }
    return {
        text,
        tapIndex: span._tappable ? index : undefined,
        autoFontSizeEnabled,
        iosFont,
        realFontSize,
        fontSize: fontSize || iosFont.pointSize,
        realMaxFontSize,
        backgroundColor: backgroundcolor ? (backgroundcolor instanceof Color ? backgroundcolor.ios : new Color(backgroundcolor).ios) : null,
        color: textColor ? (textColor instanceof Color ? textColor.ios : new Color(textColor).ios) : null,
        textDecoration,
        letterSpacing,
        lineHeight,
        verticalTextAlignment,
        textAlignment
    };
}
