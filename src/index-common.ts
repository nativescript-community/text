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
    makeValidator,
} from '@nativescript/core';
import { FontStyle, FontWeight } from '@nativescript/core/ui/styling/font';
import { TextBase } from '@nativescript/core/ui/text-base';
import { createNativeAttributedString } from './index';

declare module '@nativescript/core/ui/text-base' {
    interface TextBase {
        createFormattedTextNative?(value: LightFormattedString | FormattedString): any;
    }
}

export interface ObjectSpans extends Pick<LightFormattedString, keyof LightFormattedString> {
    spans: any;
}

const CHILD_FORMATTED_TEXT = 'formattedText';

export function enableIOSDTCoreText() {}
export function usingIOSDTCoreText() {
    return false;
}

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
        configurable: true,
    });
};

export type VerticalTextAlignment = 'initial' | 'top' | 'middle' | 'bottom' | 'center';

export const verticalTextAlignmentConverter = makeParser<VerticalTextAlignment>(makeValidator<VerticalTextAlignment>('initial', 'top', 'middle', 'bottom', 'center'));
export const verticalTextAlignmentProperty = new InheritedCssProperty<Style, VerticalTextAlignment>({
    name: 'verticalTextAlignment',
    cssName: 'vertical-text-align',
    valueConverter: verticalTextAlignmentConverter,
});
verticalTextAlignmentProperty.register(Style);

export const textAlignmentConverter = makeParser<CoreTypes.TextAlignmentType>(makeValidator<CoreTypes.TextAlignmentType>('initial', 'left', 'right', 'center'));

export class LightFormattedString extends Observable {
    private _spans: ObservableArray<Span>;

    constructor() {
        super();
        this._spans = new ObservableArray<Span>();
        this._spans.addEventListener(ObservableArray.changeEvent, this.onSpansCollectionChanged, this);
    }
    fontFamily: string;
    fontSize: number;
    fontStyle: FontStyle;
    fontWeight: FontWeight;
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
export function overrideSpanAndFormattedString() {
    if (!overrideSpanAndFormattedStringEnabled) {
        overrideSpanAndFormattedStringEnabled = true;
    }
    TextBase.prototype._addChildFromBuilder = function (name: string, value: any) {
        if (name === Span.name) {
            if (!this.formattedText) {
                const formattedText = (new LightFormattedString() as any) as FormattedString;
                formattedText.spans.push(value);
                this.formattedText = formattedText;
                (formattedText as any).parent = this;
            } else {
                this.formattedText.spans.push(value);
            }
        } else if (name === CHILD_FORMATTED_TEXT || name === FormattedString.name || name === LightFormattedString.name) {
            this.formattedText = value;
            value.parent = this;
        }
    };
    TextBase.prototype._addView = function (view) {
        if (view instanceof LightFormattedString) {
            return;
        }
        this._super._addView(view);
    };
    TextBase.prototype._removeView = function (view) {
        if (view instanceof LightFormattedString) {
            return;
        }
        this._super._removeView(view);
    };
    TextBase.prototype.eachChild = function (callback: (child: ViewBase) => boolean) {
        const text = this.formattedText;
        if (text instanceof FormattedString) {
            callback(text);
        }
    };
    TextBase.prototype.createFormattedTextNative = function (value: LightFormattedString | FormattedString) {
        return createNativeAttributedString(value as any, this, this['autoFontSize'], this['fontSizeRatio']);
    };
    TextBase.prototype[colorProperty.setNative] = function (value) {
        if (value instanceof Color) {
            if (global.isIOS) {
                const color = value instanceof Color ? value.ios : value;
                this._setColor(color);
            } else if (global.isAndroid) {
                if (value instanceof Color) {
                    this.nativeTextViewProtected.setTextColor(value.android);
                } else {
                    this.nativeTextViewProtected.setTextColor(value);
                }
            }
        }
    };
}
