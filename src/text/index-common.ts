import {
    ChangedData,
    Color,
    CoreTypes,
    FormattedString,
    InheritedCssProperty,
    Observable,
    ObservableArray,
    PropertyChangeData,
    Span,
    Style,
    View,
    ViewBase,
    colorProperty,
    makeParser,
    makeValidator
} from '@nativescript/core';
import { FontStyleType, FontWeightType } from '@nativescript/core/ui/styling/font';
import { TextBase } from '@nativescript/core/ui/text-base';
import { createNativeAttributedString } from './index';
import { iOSNativeHelper } from '@nativescript/core/utils';
import { isNullOrUndefined, isString } from '@nativescript/core/utils/types';

declare module '@nativescript/core/ui/text-base' {
    interface TextBase {
        createFormattedTextNative?(value: LightFormattedString | FormattedString): any;
    }
}

export interface ObjectSpans extends Partial<Pick<LightFormattedString, keyof LightFormattedString>> {
    spans: any;
}

const CHILD_FORMATTED_TEXT = 'formattedText';

// export function enableIOSDTCoreText() {}
// export function usingIOSDTCoreText() {
//     return false;
// }
export function computeBaseLineOffset(align, fontAscent, fontDescent, fontBottom, fontTop, fontSize, maxFontSize) {
    let result = 0;
    switch (align) {
        case 'top':
            result = -maxFontSize - fontBottom - fontTop;
            break;

        case 'bottom':
            result = fontBottom;
            break;

        case 'text-top':
            result = -maxFontSize - fontDescent - fontAscent;
            break;

        case 'text-bottom':
            result = fontBottom - fontDescent;
            break;

        case 'middle':
        case 'center':
            result = (fontAscent - fontDescent) / 2 - fontAscent - maxFontSize / 2;
            break;

        case 'super':
            result = -(maxFontSize - fontSize);
            break;

        case 'sub':
            result = 0;
            break;
    }
    return result;
}
function getCapitalizedString(str: string): string {
    const words = str.split(' ');
    const newWords = [];
    for (let i = 0, length = words.length; i < length; i++) {
        const word = words[i].toLowerCase();
        newWords.push(word.substring(0, 1).toUpperCase() + word.substring(1));
    }

    return newWords.join(' ');
}
export function getTransformedText(text: string, textTransform: CoreTypes.TextTransformType): string {
    if (!text || !isString(text)) {
        return '';
    }

    switch (textTransform) {
        case 'uppercase':
            return text.toUpperCase();
        case 'lowercase':
            return text.toLowerCase();
        case 'capitalize':
            return getCapitalizedString(text);
        case 'none':
        default:
            return text;
    }
}

export const cssProperty = (target: Object, key: string | symbol) => {
    // property getter
    const getter = function () {
        return this.style[key];
    };

    // property setter
    const setter = function (newVal) {
        this.style[key] = newVal;
    };

    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
    });
};

export type VerticalTextAlignment = 'initial' | 'top' | 'middle' | 'bottom' | 'center';

export const verticalTextAlignmentConverter = makeParser<VerticalTextAlignment>(makeValidator<VerticalTextAlignment>('initial', 'top', 'middle', 'bottom', 'center'));
export const verticalTextAlignmentProperty = new InheritedCssProperty<Style, VerticalTextAlignment>({
    name: 'verticalTextAlignment',
    cssName: 'vertical-text-align',
    valueConverter: verticalTextAlignmentConverter
});
verticalTextAlignmentProperty.register(Style);

export const textAlignmentConverter = makeParser<CoreTypes.TextAlignmentType>(makeValidator<CoreTypes.TextAlignmentType>('initial', 'left', 'right', 'center'));

export class LightFormattedString extends Observable {
    static get isFormattedString() {
        return true;
    }
    private _spans: ObservableArray<Span>;

    constructor() {
        super();
        this._spans = new ObservableArray<Span>();
        this._spans.addEventListener(ObservableArray.changeEvent, this.onSpansCollectionChanged, this);
    }
    fontFamily: string;
    fontSize: number;
    fontStyle: FontStyleType;
    fontWeight: FontWeightType;
    textAlignment: CoreTypes.TextAlignmentType;
    verticalTextAlignment: CoreTypes.VerticalAlignmentTextType;
    textDecoration: CoreTypes.TextDecorationType;
    color: Color;
    backgroundColor: Color;
    parent: View;

    get style() {
        return this;
    }

    get spans(): ObservableArray<Span> {
        if (!this._spans) {
            this._spans = new ObservableArray<Span>();
        }

        return this._spans;
    }
    set spans(value: ObservableArray<Span>) {
        if (value instanceof ObservableArray) {
            this._spans.removeEventListener(ObservableArray.changeEvent, this.onSpansCollectionChanged, this);
            this._spans = value;
            this._spans.addEventListener(ObservableArray.changeEvent, this.onSpansCollectionChanged, this);
        } else if (Array.isArray(value)) {
            this._spans.push(...(value as any));
        } else {
            this._spans.push(value as any);
        }
    }

    public toString(): string {
        let result = '';
        for (let i = 0, length = this._spans.length; i < length; i++) {
            result += this._spans.getItem(i).text;
        }

        return result;
    }

    public _addArrayFromBuilder(name: string, value: any[]) {
        if (name === 'spans') {
            this.spans.push(...value);
        }
    }

    public _addChildFromBuilder(name: string, value: any): void {
        if (value instanceof Span) {
            this.spans.push(value);
        }
    }

    private onSpansCollectionChanged(eventData: ChangedData<Span>) {
        if (eventData.addedCount > 0) {
            for (let i = 0; i < eventData.addedCount; i++) {
                const span = (eventData.object as ObservableArray<Span>).getItem(eventData.index + i);
                (span as any).parent = this;
                // Then attach handlers - we skip the first nofitication because
                // we raise change for the whole instance.
                this.addPropertyChangeHandler(span);
            }
        }

        if (eventData.removed && eventData.removed.length > 0) {
            for (let p = 0; p < eventData.removed.length; p++) {
                const span = eventData.removed[p];
                (span as any).parent = null;

                // First remove handlers so that we don't listen for changes
                // on inherited properties.
                this.removePropertyChangeHandler(span);
            }
        }

        this.notifyPropertyChange('.', this);
    }

    private addPropertyChangeHandler(span: Span) {
        const style = span.style;
        span.on(Observable.propertyChangeEvent, this.onPropertyChange, this);
        style.on('fontFamilyChange', this.onPropertyChange, this);
        style.on('fontSizeChange', this.onPropertyChange, this);
        style.on('fontStyleChange', this.onPropertyChange, this);
        style.on('fontWeightChange', this.onPropertyChange, this);
        style.on('textDecorationChange', this.onPropertyChange, this);
        style.on('colorChange', this.onPropertyChange, this);
        style.on('backgroundColorChange', this.onPropertyChange, this);
    }

    private removePropertyChangeHandler(span: Span) {
        span.off(Observable.propertyChangeEvent, this.onPropertyChange, this);
    }

    private onPropertyChange(data: PropertyChangeData) {
        this.notifyPropertyChange(data.propertyName, this);
    }
    toNativeString() {}
}

export function getMaxFontSize(value: FormattedString | LightFormattedString | ObjectSpans) {
    let max = value.fontSize || 0;
    value.spans &&
        value.spans.forEach((s) => {
            if (s.fontSize) {
                max = Math.max(max, s.fontSize);
            }
        });
    return max;
}

export let overrideSpanAndFormattedStringEnabled = false;
export let useLightFormattedString = false;
export function overrideSpanAndFormattedString(useLightFormatString = true) {
    if (overrideSpanAndFormattedStringEnabled) {
        return;
    }
    overrideSpanAndFormattedStringEnabled = true;
    useLightFormattedString = useLightFormatString;
    TextBase.prototype._addChildFromBuilder = function (name: string, value: any) {
        if (name === Span.name || value.constructor.isSpan) {
            if (!this.formattedText) {
                const formattedText = useLightFormattedString ? (new LightFormattedString() as any as FormattedString) : new FormattedString();
                formattedText.spans.push(value);
                this.formattedText = formattedText;
                (formattedText as any).parent = this;
            } else {
                this.formattedText.spans.push(value);
            }
        } else if (name === CHILD_FORMATTED_TEXT || name === FormattedString.name || name === LightFormattedString.name || value.constructor.isFormattedString) {
            this.formattedText = value;
            value.parent = this;
        }
    };
    const oldImplAddView = TextBase.prototype._addView;
    TextBase.prototype._addView = function (view) {
        if (view instanceof LightFormattedString) {
            return;
        }
        oldImplAddView.call(this, view);
    };
    const oldImplRemoveView = TextBase.prototype._addView;
    TextBase.prototype._removeView = function (view) {
        if (view instanceof LightFormattedString) {
            return;
        }
        oldImplRemoveView.call(this, view);
    };
    TextBase.prototype.eachChild = function (callback: (child: ViewBase) => boolean) {
        const text = this.formattedText;
        if (text instanceof FormattedString) {
            callback(text);
        }
    };
    TextBase.prototype.createFormattedTextNative = function (value: LightFormattedString | FormattedString) {
        return createNativeAttributedString(value as any, undefined, this, this['autoFontSize'], this['fontSizeRatio']);
    };
    TextBase.prototype[colorProperty.setNative] = function (value) {
        if (value instanceof Color) {
            if (__IOS__) {
                const color = value instanceof Color ? value.ios : value;
                this._setColor(color);
            } else if (__ANDROID__) {
                if (value instanceof Color) {
                    this.nativeTextViewProtected.setTextColor(value.android);
                } else {
                    this.nativeTextViewProtected.setTextColor(value);
                }
            }
        }
    };

    //@ts-ignore
    if (__IOS__ && typeof TextBase.prototype.setFormattedTextDecorationAndTransform !== 'function') {
        const majorVersion = iOSNativeHelper.MajorVersion;
        function NSStringFromNSAttributedString(source: NSAttributedString | string): NSString {
            return NSString.stringWithString((source instanceof NSAttributedString && source.string) || (source as string));
        }
        function getTransformedText(text: string, textTransform: CoreTypes.TextTransformType): string {
            if (!text || !isString(text)) {
                return '';
            }

            switch (textTransform) {
                case 'uppercase':
                    return NSStringFromNSAttributedString(text).uppercaseString;
                case 'lowercase':
                    return NSStringFromNSAttributedString(text).lowercaseString;
                case 'capitalize':
                    return NSStringFromNSAttributedString(text).capitalizedString;
                default:
                    return text;
            }
        }
        TextBase.prototype._setNativeText = function (reset = false): void {
            if (reset) {
                const nativeView = this.nativeTextViewProtected;
                if (nativeView instanceof UIButton) {
                    // Clear attributedText or title won't be affected.
                    nativeView.setAttributedTitleForState(null, UIControlState.Normal);
                    nativeView.setTitleForState(null, UIControlState.Normal);
                } else {
                    // Clear attributedText or text won't be affected.
                    nativeView.attributedText = null;
                    nativeView.text = null;
                }

                return;
            }

            if (this.formattedText) {
                this.setFormattedTextDecorationAndTransform();
            } else {
                this.setTextDecorationAndTransform();
            }
        };
        //@ts-ignore
        TextBase.prototype.setFormattedTextDecorationAndTransform = function () {
            const nativeView = this.nativeTextViewProtected;
            const attrText = this.createFormattedTextNative(this.formattedText);
            // we override parent class behavior because we apply letterSpacing and lineHeight on a per Span basis
            if (majorVersion >= 13 && UIColor.labelColor) {
                this.nativeTextViewProtected.textColor = UIColor.labelColor;
            }

            nativeView.attributedText = attrText;
        };
        //@ts-ignore
        TextBase.prototype.setTextDecorationAndTransform = function () {
            const style = this.style;
            const letterSpacing = style.letterSpacing ?? 0;
            const lineHeight = style.lineHeight ?? -1;
            let uiColor;
            if (style.color) {
                const color = !style.color || style.color instanceof Color ? style.color : new Color(style.color);
                if (color) {
                    uiColor = color.ios;
                }
            }
            const text = getTransformedText(isNullOrUndefined(this.text) ? '' : `${this.text}`, this.textTransform);
            NSTextUtils.setTextDecorationAndTransformOnViewTextTextDecorationLetterSpacingLineHeightColor(
                this.nativeTextViewProtected,
                text,
                this.style.textDecoration || '',
                letterSpacing,
                lineHeight,
                uiColor
            );

            if (!style.color && majorVersion >= 13 && UIColor.labelColor) {
                this._setColor(UIColor.labelColor);
            }
        };
    }
}
