import { Color, FormattedString } from '@nativescript/core';
import { TextAlignment } from '@nativescript/core/ui/text-base';
import { textAlignmentConverter } from './index-common';
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
            color || familyName || fontSize
                ? `<span style=" ${color ? `color: ${color};` : ''}  ${familyName ? `font-family:'${familyName.replace(/'/g, '')}';` : ''}${fontSize ? `font-size: ${fontSize}px;` : ''}${
                      fontWeight ? `font-weight: ${fontWeight};` : ''
                  }">${text}</span>`
                : text;
        // `<span style="font-family: ${fontFamily}; font-size:${fontSize};">${htmlString}</span>`;
    } else {
        htmlString =
            color || familyName || fontSize
                ? `<style>body{ ${color ? `color: ${color};` : ''}  ${familyName ? `font-family:"${familyName.replace(/'/g, '')}";` : ''}${fontSize ? `font-size: ${fontSize}px;` : ''}${fontWeight ? `font-weight: ${fontWeight};` : ''}}</style>${text}`
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
    if (letterSpacing !== undefined) {
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
              textAlignment?: NSTextAlignment | TextAlignment;
          }
        | FormattedString
) {
    if (data instanceof FormattedString) {
        //todo not supported yet
        return null;
    }
    if (data.textAlignment && typeof data.textAlignment === 'string') {
        data.textAlignment = textAlignmentConverter(data.textAlignment);
    }
    if (data.color && !(data.color instanceof Color)) {
        data.color = new Color(data.color as any);
    }
    return _createNativeAttributedString(data as any);
}
