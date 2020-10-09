import { InheritedCssProperty, Style, makeParser, makeValidator } from '@nativescript/core';
import { TextAlignment } from '@nativescript/core/ui/text-base';

export function enableIOSDTCoreText() {}

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

export const textAlignmentConverter = makeParser<TextAlignment>(makeValidator<TextAlignment>('initial', 'left', 'right', 'center'));
