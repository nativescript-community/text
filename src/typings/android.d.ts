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
                constructor(url: string, showUnderline: boolean);
            }
        }
    }
}
