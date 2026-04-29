import type { SupportedStyles } from "./utils.js";
import { AdoptableStyles, createFragment, html, css, rescueElementPrototype } from "./utils.js";

export { html, css };

export abstract class Base extends HTMLElement {
    static shadowOptions: ShadowRootInit | false = { mode: "open" };
    static styles?: SupportedStyles;
    static observedAttributes?: string[];

    internals: ElementInternals;
    #rendered: boolean = false;

    constructor() {
        super();
        this.internals = this.attachInternals();

        const { shadowOptions, styles } = this.constructor as typeof Base;

        if (shadowOptions) {
            this.attachShadow(shadowOptions);
        }

        if (styles) {
            this.#attachStyles(styles);
        }
    }

    connectedCallback() {
        if (this.#rendered) return;
        this.#rendered = true;

        const renderResult = this.render();
        if (renderResult) this.root.append(createFragment(renderResult));
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        const callbackName = `${name}Changed`;
        const handler = (this as any)[callbackName as keyof this];

        if (typeof handler === "function") {
            handler.call(this, oldValue, newValue);
        }
    }

    adoptedCallback() {
        rescueElementPrototype(this);
    }

    disconnectedCallback() {
        rescueElementPrototype(this);
    }

    render(): string {
        return html``;
    }

    protected rerender() {
        this.root.innerHTML = "";

        const renderResult = this.render();
        if (renderResult) {
            this.root.append(createFragment(renderResult));
        }
    }

    #attachStyles(styles: SupportedStyles) {
        const normalisedStyles = AdoptableStyles.normalise(styles);

        if ("adoptedStyleSheets" in this.root) {
            this.root.adoptedStyleSheets = [...normalisedStyles];
        } else {
            this.root.append(
                ...normalisedStyles.map((s) => {
                    const style = document.createElement("style");
                    style.textContent = [...s.cssRules].map((r) => r.cssText).join("");
                    return style;
                }),
            );
        }
    }

    get root(): ShadowRoot | HTMLElement {
        return this.shadowRoot || this;
    }
}
