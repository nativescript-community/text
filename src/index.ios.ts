import { Color, CoreTypes, Font, FormattedString, ViewBase, fontInternalProperty } from '@nativescript/core';
import { getTransformedText } from '@nativescript/core/ui/text-base';
import { computeBaseLineOffset, getMaxFontSize, textAlignmentConverter } from './index-common';
import { LightFormattedString } from './index.android';
export * from './index-common';

let iOSUseDTCoreText = false;
export function enableIOSDTCoreText() {
    iOSUseDTCoreText = true;
}
export function usingIOSDTCoreText() {
    return iOSUseDTCoreText;
}
export function init() {}

function _createNativeAttributedString({
    text,
    familyName = '-apple-system',
    fontSize,
    fontWeight,
    letterSpacing,
    lineHeight,
    color,
    textAlignment,
    autoFontSizeEnabled = false,
    fontSizeRatio = 1,
}: {
    text: string;
    color: Color;
    familyName: string;
    fontWeight: string;
    fontSize: number;
    letterSpacing?: number;
    lineHeight?: number;
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
    const htmlString =
        color || familyName || fontSize || fontWeight
            ? `<span style=" ${color ? `color: ${color};` : ''}  ${trueFontFamily ? `font-family:${trueFontFamily};` : ''}${fontSize ? `font-size: ${fontSize * fontSizeRatio}px;` : ''}${
                  fontWeight ? `font-weight: ${fontWeight};` : ''
              }">${text}</span>`
            : text;
    // } else {
    //     htmlString =
    //         color || familyName || fontSize || fontWeight
    //             ? `<style>body{ ${color ? `color: ${color};` : ''}  ${trueFontFamily ? `font-family:${trueFontFamily};` : ''}${fontSize ? `font-size: ${fontSize * fontSizeRatio}px;` : ''}${
    //                   fontWeight ? `font-weight: ${fontWeight};` : ''
    //               }}</style>${text}`
    //             : text;
    // }
    const nsString = NSString.stringWithString(htmlString);
    const nsData = nsString.dataUsingEncodingAllowLossyConversion(NSUnicodeStringEncoding, true);
    let attrText: NSMutableAttributedString;
    if (iOSUseDTCoreText) {
        // on iOS 13.3 there is bug with the system font
        // https://github.com/Cocoanetics/DTCoreText/issues/1168
        const options = {
            [DTDefaultTextAlignment]: kCTLeftTextAlignment,
            [DTUseiOS6Attributes]: true,
            [DTDocumentPreserveTrailingSpaces]: true,
        } as any;
        attrText = NSMutableAttributedString.alloc().initWithHTMLDataOptionsDocumentAttributes(nsData, options, null);
    } else {
        attrText = NSMutableAttributedString.alloc().initWithDataOptionsDocumentAttributesError(
            nsData,
            {
                [NSDocumentTypeDocumentAttribute]: NSHTMLTextDocumentType,
                [NSCharacterEncodingDocumentAttribute]: NSUTF8StringEncoding,
            } as any,
            null
        );
    }
    if (autoFontSizeEnabled || iOSUseDTCoreText) {
        attrText.enumerateAttributesInRangeOptionsUsingBlock({ location: 0, length: attrText.length }, 0, (attributes: NSDictionary<any, any>, range, stop) => {
            if (!!attributes.valueForKey('DTGUID')) {
                // We need to remove this attribute or links are not colored right
                //
                // @see https://github.com/Cocoanetics/DTCoreText/issues/792
                attrText.removeAttributeRange('CTForegroundColorFromContext', range);
            }
            const font: UIFont = attributes.valueForKey(NSFontAttributeName);
            if (!!font) {
                attrText.addAttributeValueRange('OriginalFontSize', font.pointSize, range);
            }
        });
    }

    // TODO: letterSpacing should be applied per Span.
    if (letterSpacing !== undefined && letterSpacing !== 0) {
        attrText.addAttributeValueRange(NSKernAttributeName, letterSpacing * fontSize, { location: 0, length: attrText.length });
    }

    if (lineHeight !== undefined) {
        const paragraphStyle = NSMutableParagraphStyle.alloc().init();
        paragraphStyle.lineSpacing = lineHeight;
        // make sure a possible previously set text alignment setting is not lost when line height is specified
        paragraphStyle.alignment = textAlignment;
        // if (this.nativeTextViewProtected instanceof UILabel) {
        //     // make sure a possible previously set line break mode is not lost when line height is specified
        //     paragraphStyle.lineBreakMode = this.nativeTextViewProtected.lineBreakMode;
        // }
        attrText.addAttributeValueRange(NSParagraphStyleAttributeName, paragraphStyle, { location: 0, length: attrText.length });
    } else if (textAlignment !== undefined) {
        const paragraphStyle = NSMutableParagraphStyle.alloc().init();
        paragraphStyle.alignment = textAlignment;
        attrText.addAttributeValueRange(NSParagraphStyleAttributeName, paragraphStyle, { location: 0, length: attrText.length });
    }
    return attrText;
}
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
        | FormattedString,
    parent: ViewBase,
    autoFontSizeEnabled = false,
    fontSizeRatio = 1
) {
    if (data instanceof FormattedString || data instanceof LightFormattedString) {
        const ssb = NSMutableAttributedString.new();
        const maxFontSize = getMaxFontSize(data);
        const _spanRanges = [];
        let spanStart = 0;
        let hasLink = false;
        data.spans.forEach((s) => {
            const res = createSpannable(s, parent, undefined, maxFontSize, autoFontSizeEnabled, fontSizeRatio);
            if (res) {
                if ((s as any)._tappable) {
                    hasLink = true;
                }
                _spanRanges.push({
                    location: spanStart,
                    length: res.length,
                });
                spanStart += res.length;
                ssb.appendAttributedString(res);
            }
        });
        parent['nativeTextViewProtected'].selectable = parent['selectable'] === true || hasLink;
        if ((parent as any)._setTappableState) {
            (parent as any)._setTappableState(hasLink);
        }
        parent['_spanRanges'] = _spanRanges;
        return ssb;
    }
    if (data.textAlignment && typeof data.textAlignment === 'string') {
        data.textAlignment = textAlignmentConverter(data.textAlignment);
    }
    if (data.color && !(data.color instanceof Color)) {
        data.color = new Color(data.color as any);
    }
    data['autoFontSizeEnabled'] = autoFontSizeEnabled;
    data['fontSizeRatio'] = fontSizeRatio;
    return _createNativeAttributedString(data as any);
}

export function createSpannable(span: any, parentView: any, parent?: any, maxFontSize?, autoFontSizeEnabled = false, fontSizeRatio = 1): NSMutableAttributedString {
    let text = span.text;
    if (!text || (span.visibility && span.visibility !== 'visible')) {
        return null;
    }
    const attrDict = {} as { key: string; value: any };
    const fontFamily = span.fontFamily;
    let fontSize = span.fontSize;
    let realFontSize = fontSize || (parent && parent.fontSize) || (parentView && parentView.fontSize);
    if (span.relativeSize) {
        realFontSize = ((parent && parent.fontSize) || (parentView && parentView.fontSize)) * span.relativeSize;
    }
    const realMaxFontSize = Math.max(maxFontSize, realFontSize || 0);
    const fontWeight = span.fontWeight;
    const fontstyle = span.fontStyle;
    const textcolor = span.color || (parent && parent.color) || (parentView && parentView.color);
    const backgroundcolor = span.backgroundColor || (parent && parent.backgroundColor);
    const textDecorations = span.textDecoration || (parent && parent.textDecoration);
    const letterSpacing = span.letterSpacing || (parent && parent.letterSpacing);
    const lineHeight = span.lineHeight || (parent && parent.lineHeight);
    const textAlignment = span.textAlignment || (parent && parent.textAlignment);
    const verticaltextalignment = span.verticalTextAlignment || (parent && parent.verticalTextAlignment);
    let iosFont: UIFont;
    if ((fontWeight && fontWeight !== 'normal') || fontstyle || fontFamily || realFontSize || fontSizeRatio !== 1) {
        const font = new Font(
            fontFamily || (parent && parent.fontFamily) || (parentView && parentView.fontFamily),
            realFontSize * fontSizeRatio,
            fontstyle || (parent && parent.fontStyle) || (parentView && parentView.fontStyle),
            fontWeight || (parent && parent.fontWeight) || (parentView && parentView.fontWeight)
        );
        iosFont = font.getUIFont(UIFont.systemFontOfSize(realFontSize));
        attrDict[NSFontAttributeName] = iosFont;
        if (autoFontSizeEnabled) {
            attrDict['OriginalFontSize'] = realFontSize;
        }
    }
    if (verticaltextalignment && verticaltextalignment !== 'initial' && iosFont) {
        if (!iosFont) {
            iosFont = parentView[fontInternalProperty.getDefault]();
            fontSize = iosFont.pointSize;
        }
        const ascent = CTFontGetAscent(iosFont);
        const descent = CTFontGetDescent(iosFont);
        attrDict[NSBaselineOffsetAttributeName] = -computeBaseLineOffset(verticaltextalignment, -ascent, descent, -iosFont.descender, -iosFont.ascender, fontSize, realMaxFontSize);
    }
    // if (span._tappable) {
    //     attrDict[NSLinkAttributeName] = text;
    // }
    if (textcolor) {
        const color = !textcolor || textcolor instanceof Color ? textcolor : new Color(textcolor);
        if (color) {
            attrDict[NSForegroundColorAttributeName] = color.ios;
        }
    }

    if (backgroundcolor) {
        const color = !backgroundcolor || backgroundcolor instanceof Color ? backgroundcolor : new Color(backgroundcolor);
        if (color) {
            attrDict[NSBackgroundColorAttributeName] = color.ios;
        }
    }
    if (letterSpacing) {
        attrDict[NSKernAttributeName] = letterSpacing * iosFont.pointSize;
    }

    let paragraphStyle;
    if (lineHeight !== undefined) {
        paragraphStyle = NSMutableParagraphStyle.alloc().init();
        switch (textAlignment) {
            case 'middle':
            case 'center':
                paragraphStyle.alignment = NSTextAlignment.Center;
                break;
            case 'right':
                paragraphStyle.alignment = NSTextAlignment.Right;
                break;
            default:
                paragraphStyle.alignment = NSTextAlignment.Left;
                break;
        }
        paragraphStyle.minimumLineHeight = lineHeight;
        paragraphStyle.maximumLineHeight = lineHeight;
    }
    if (paragraphStyle) {
        attrDict[NSParagraphStyleAttributeName] = paragraphStyle;
    }

    if (textDecorations) {
        const underline = textDecorations.indexOf('underline') !== -1;
        if (underline) {
            attrDict[NSUnderlineStyleAttributeName] = underline;
        }

        const strikethrough = textDecorations.indexOf('line-through') !== -1;
        if (strikethrough) {
            attrDict[NSStrikethroughStyleAttributeName] = strikethrough;
        }
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
        return NSMutableAttributedString.alloc().initWithStringAttributes(text, attrDict as any);
    } else {
        const result = NSMutableAttributedString.alloc().initWithAttributedString(text);
        result.setAttributesRange(attrDict as any, { location: 0, length: text.length });
        return result;
    }
}
