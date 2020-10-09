declare let DTDefaultTextAlignment: string;
declare let DTDefaultFontStyle: string;
declare let DTIgnoreLinkStyleOption: string;
declare let DTDefaultFontFamily: string;
declare let DTUseiOS6Attributes: string;
declare let DTDocumentPreserveTrailingSpaces: string;
declare let DTDefaultLineBreakMode: string;
declare let NSTextSizeMultiplierDocumentOption: string;
declare let kCTLineBreakByWordWrapping: string;
declare let kCTLeftTextAlignment: string;
declare let NSAttributedStringEnumerationReverse: number;

declare namespace DTCoreTextFontDescriptor {
    function asyncPreloadFontLookupTable();
}

declare interface NSAttributedString {
    initWithHTMLDataOptionsDocumentAttributes(data, options, attr);
}
declare interface NSMutableAttributedString {
    initWithHTMLDataOptionsDocumentAttributes(data, options, attr);
}
