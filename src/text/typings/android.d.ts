declare namespace com {
    export namespace nativescript {
        export namespace text {
            export class CustomTypefaceSpan extends globalAndroid.text.style.TypefaceSpan {
                constructor(family: string, typeface: globalAndroid.graphics.Typeface);
            }
            export class CustomBackgroundSpan extends globalAndroid.text.style.ReplacementSpan {
                constructor(radius: number, fillColor: number, strokeColor: number, strokeWidth: number);
            }
            export class BaselineAdjustedSpan extends globalAndroid.text.style.CharacterStyle {
                constructor(fontSize: number, align: string, maxFontSize: number);
            }
            export class HeightSpan extends globalAndroid.text.style.CharacterStyle {
                constructor(size: number);
            }
            export class URLSpanNoUnderline extends globalAndroid.text.style.URLSpan {
                constructor(url: string, showUnderline: boolean, color?: number, disableStyle?: boolean);
            }

            export class Font {
                static stringBuilderFromHtmlString(
                    context: globalAndroid.content.Context,
                    fontPath: string,
                    parentFontFamily: string,
                    text: string,
                    disableLinkUnderline: boolean,
                    linkColor: number
                ): globalAndroid.text.SpannableStringBuilder;
                static stringBuilderFromFormattedString(
                    context: globalAndroid.content.Context,
                    fontPath: string,
                    parentFontFamily: string,
                    nativeString: string,
                    ssp: globalAndroid.text.SpannableStringBuilder
                ): any;
                static createTypeface(
                    context: globalAndroid.content.Context,
                    fontFolder: string,
                    fontFamily: string,
                    fontWeight: string,
                    isBold: boolean,
                    isItalic: boolean,
                    fontVariationSettings: string,
                ): globalAndroid.graphics.Typeface;
                static getFontSizeFactor(context: globalAndroid.content.Context): number;
            }
            export class URLSpanClickListener {
                constructor(impl?: { onClick(span: android.text.style.URLSpan) });
                onClick(span: android.text.style.URLSpan);
            }

            export class TextView extends androidx.appcompat.widget.AppCompatTextView {
                urlSpanClickListener: URLSpanClickListener;
                static attributedStringHasSpan(attributeString: android.text.Spannable, spanClass: java.lang.Class<any>): boolean;
            }
        }
    }
}
