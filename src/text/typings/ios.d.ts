declare class NSTextUtils extends NSObject {

	static alloc(): NSTextUtils; // inherited from NSObject

	static computeBaseLineOffsetWithAlignFontAscentFontDescentFontBottomFontTopFontSizeMaxFontSize(align: string, fontAscent: number, fontDescent: number, fontBottom: number, fontTop: number, fontSize: number, maxFontSize: number): number;

	static createNativeAttributedStringWithData(data: NSDictionary<any, any>): NSMutableAttributedString;

	static createNativeHTMLAttributedStringWithData(data: NSDictionary<any, any>): NSMutableAttributedString;

	static new(): NSTextUtils; // inherited from NSObject

	static setTextDecorationAndTransformOnViewTextTextDecorationLetterSpacingLineHeightColor(view: UIView, text: string, textDecoration: string, letterSpacing: number, lineHeight: number, color: UIColor): void;
}