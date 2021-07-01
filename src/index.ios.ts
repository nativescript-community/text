import { Color, CoreTypes, Font, FormattedString, ViewBase } from '@nativescript/core';
import { getTransformedText } from '@nativescript/core/ui/text-base';
import { computeBaseLineOffset, getMaxFontSize, textAlignmentConverter } from './index-common';
import { LightFormattedString } from './index.android';
export * from './index-common';

let iOSUseDTCoreText = false;
export function enableIOSDTCoreText() {
    iOSUseDTCoreText = true;
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
}: {
    text: string;
    color: Color;
    familyName: string;
    fontWeight: string;
    fontSize: number;
    letterSpacing?: number;
    lineHeight?: number;
    textAlignment: NSTextAlignment;
}) {
    let htmlString;
    if (iOSUseDTCoreText) {
        htmlString =
            color || familyName || fontSize || fontWeight
                ? `<span style=" ${color ? `color: ${color};` : ''}  ${familyName ? `font-family:'${familyName.replace(/'/g, '')}';` : ''}${fontSize ? `font-size: ${fontSize}px;` : ''}${
                      fontWeight ? `font-weight: ${fontWeight};` : ''
                  }">${text}</span>`
                : text;
        // `<span style="font-family: ${fontFamily}; font-size:${fontSize};">${htmlString}</span>`;
    } else {
        htmlString =
            color || familyName || fontSize || fontWeight
                ? `<style>body{ ${color ? `color: ${color};` : ''}  ${familyName ? `font-family:"${familyName.replace(/'/g, '')}";` : ''}${fontSize ? `font-size: ${fontSize}px;` : ''}${
                      fontWeight ? `font-weight: ${fontWeight};` : ''
                  }}</style>${text}`
                : text;
    }
    const nsString = NSString.stringWithString(htmlString);
    const nsData = nsString.dataUsingEncoding(NSUTF16StringEncoding);
    let attrText;
    if (iOSUseDTCoreText) {
        // on iOS 13.3 there is bug with the system font
        // https://github.com/Cocoanetics/DTCoreText/issues/1168
        const options = {
            [DTDefaultTextAlignment]: kCTLeftTextAlignment,
            // [NSTextSizeMultiplierDocumentOption]: 1,
            // [DTIgnoreLinkStyleOption]: false,
            // [DTDefaultFontFamily]: familyName,
            // [NSFontAttributeName]: familyName,
            // [NSTextSizeMultiplierDocumentOption]: 17 / 12.0,
            [DTUseiOS6Attributes]: true,
            [DTDocumentPreserveTrailingSpaces]: true,
            // [DTDefaultLineBreakMode]: kCTLineBreakByWordWrapping
        } as any;
        attrText = NSMutableAttributedString.alloc().initWithHTMLDataOptionsDocumentAttributes(nsData, options, null);
        attrText.enumerateAttributesInRangeOptionsUsingBlock({ location: 0, length: attrText.length }, NSAttributedStringEnumerationReverse, (attributes: NSDictionary<any, any>, range, stop) => {
            if (!!attributes.valueForKey('DTGUID')) {
                // We need to remove this attribute or links are not colored right
                //
                // @see https://github.com/Cocoanetics/DTCoreText/issues/792
                attrText.removeAttributeRange('CTForegroundColorFromContext', range);
            }
        });
    } else {
        attrText = NSMutableAttributedString.alloc().initWithDataOptionsDocumentAttributesError(
            nsData,
            {
                [NSDocumentTypeDocumentAttribute]: NSHTMLTextDocumentType,
            } as any,
            null
        );
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
    parent: ViewBase
) {
    if (data instanceof FormattedString || data instanceof LightFormattedString) {
        const ssb = NSMutableAttributedString.new();
        const maxFontSize = getMaxFontSize(data);
        data.spans.forEach((s) => {
            const res = createSpannable(s, parent, undefined, maxFontSize);
            if (res) {
                ssb.appendAttributedString(res);
            }
        });
        return ssb;
    }
    if (data.textAlignment && typeof data.textAlignment === 'string') {
        data.textAlignment = textAlignmentConverter(data.textAlignment);
    }
    if (data.color && !(data.color instanceof Color)) {
        data.color = new Color(data.color as any);
    }
    return _createNativeAttributedString(data as any);
}

export function createSpannable(span: any, parentView: any, parent?: any, maxFontSize?): NSMutableAttributedString {
    let text = span.text;
    if (!text || (span.visibility && span.visibility !== 'visible')) {
        return null;
    }
    const attrDict = {} as { key: string; value: any };
    const fontFamily = span.fontFamily;
    const fontSize = span.fontSize || (parent && parent.fontSize) || 16;
    const realMaxFontSize = Math.max(maxFontSize, parentView.fontSize || 0);
    const fontweight = span.fontWeight || 'normal';
    const fontstyle = span.fontStyle || (parent && parent.fontStyle) || 'normal';
    const textcolor = span.color;
    const backgroundcolor = span.backgroundColor || (parent && parent.backgroundColor);
    const textDecorations = span.textDecoration || (parent && parent.textDecoration);
    const letterSpacing = span.letterSpacing || (parent && parent.letterSpacing);
    const lineHeight = span.lineHeight || (parent && parent.lineHeight);
    const textAlignment = span.textAlignment || (parent && parent.textAlignment);
    const verticaltextalignment = span.verticalTextAlignment;
    let iosFont: UIFont;
    if (fontweight || fontstyle || fontFamily || fontSize) {
        const font = new Font(fontFamily, fontSize, fontstyle, typeof span.fontWeight === 'string' ? fontweight : ((fontweight + '') as any));
        iosFont = font.getUIFont(UIFont.systemFontOfSize(fontSize));
        attrDict[NSFontAttributeName] = iosFont;
    }
    if (verticaltextalignment && verticaltextalignment !== 'initial' && iosFont) {
        const ascent = CTFontGetAscent(iosFont);
        const descent = CTFontGetDescent(iosFont);
        attrDict[NSBaselineOffsetAttributeName] = -computeBaseLineOffset(verticaltextalignment, -ascent, descent, -iosFont.descender, -iosFont.ascender, fontSize, realMaxFontSize);
    }
    // if (span._tappable) {
    //     attrDict[NSLinkAttributeName] = text;
    // }
    if (textcolor) {
        const color = textcolor instanceof Color ? textcolor : new Color(textcolor);
        attrDict[NSForegroundColorAttributeName] = color.ios;
    }

    if (backgroundcolor) {
        const color = backgroundcolor instanceof Color ? backgroundcolor : new Color(backgroundcolor);
        attrDict[NSBackgroundColorAttributeName] = color.ios;
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
