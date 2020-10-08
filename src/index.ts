import { InheritedCssProperty, Style, makeParser, makeValidator } from '@nativescript/core';
import { TextAlignment } from '@nativescript/core/ui/text-base';

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

export const verticalTextAlignmentConverter = makeParser<VerticalTextAlignment>(
    makeValidator<VerticalTextAlignment>('initial', 'top', 'middle', 'bottom', 'center')
);
export const verticalTextAlignmentProperty = new InheritedCssProperty<Style, VerticalTextAlignment>({
    name: 'verticalTextAlignment',
    cssName: 'vertical-text-align',
    valueConverter: verticalTextAlignmentConverter,
});
verticalTextAlignmentProperty.register(Style);
