type SupportedStyles = string | string[] | CSSStyleSheet | CSSStyleSheet[];

const styleCache: Map<string, CSSStyleSheet> = new Map();
const emptyArray: readonly CSSStyleSheet[] = Object.freeze([] as CSSStyleSheet[]);

function valueToSheet(value: string | CSSStyleSheet): CSSStyleSheet {
    return typeof value === "string" ? AdoptableStyles.for(value) : value;
}

const AdoptableStyles = Object.freeze({
    normalise(value?: SupportedStyles): readonly CSSStyleSheet[] {
        if (Array.isArray(value)) {
            // eslint-disable-next-line
            // console.log("Normalising array of styles:", value);
            return value.map(valueToSheet);
        } else if (value) {
            // eslint-disable-next-line
            // console.log("Normalising single style:", value);
            return [valueToSheet(value)];
        } else {
            // eslint-disable-next-line
            // console.log("Normalising empty styles");
            return emptyArray;
        }
    },

    for(cssText: string): CSSStyleSheet {
        let sheet = styleCache.get(cssText);

        if (!sheet) {
            // eslint-disable-next-line
            // console.info("Creating new sheet for:", cssText);
            sheet = new CSSStyleSheet();

            if (typeof sheet.replaceSync === "function") {
                sheet.replaceSync(cssText);
            }

            styleCache.set(cssText, sheet);
        } else {
            console.warn("Cache! Reusing the same stylesheet:", sheet);
        }

        return sheet;
    },
});

function css(strings: TemplateStringsArray, ...values: Array<string | number | boolean | null | undefined>): CSSStyleSheet {
    const cssText = String.raw(strings, ...values).trim();
    return AdoptableStyles.for(cssText);
}

function createFragment(htmlString: string): DocumentFragment {
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();
    return template.content.cloneNode(true) as DocumentFragment;
}

function html(strings: TemplateStringsArray, ...values: Array<string | number | boolean | null | undefined>): string {
    return String.raw(strings, ...values).trim();
}

function isParentShadowRoot(el: Node): boolean {
    const root = el.getRootNode();
    return root instanceof ShadowRoot;
}

function rescueElementPrototype(element: Element): void {
    // Return if everything looks as expected.
    if (element instanceof HTMLElement) return;

    // Otherwise, get the intended constructor…
    const constructor = customElements.get(element.localName);

    // …and set the prototype.
    if (constructor) {
        Object.setPrototypeOf(element, constructor.prototype);
    }
}

function hasAssignedNodes(slot?: HTMLSlotElement | null): boolean {
    return !!slot
        ?.assignedNodes({ flatten: true })
        .some(
            (node) =>
                node instanceof Element || (node instanceof Text && !!node.textContent?.trim()),
        );
}

export type { SupportedStyles };
export {
    AdoptableStyles,
    css,
    createFragment,
    html,
    isParentShadowRoot,
    rescueElementPrototype,
    hasAssignedNodes,
};
