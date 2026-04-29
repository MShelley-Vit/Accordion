import { Base, html } from "#shared/foundations/base.js";
import resetStyles from "#shared/styles/shadow-reset.css?inline";
import AccordionStyles from "./accordion.css?inline";

/**
 * Accordion
 *
 * @summary A toggle component that reveals content when the header is clicked
 * @since 0.0.1
 * @status ready
 * @figma TBC
 *
 * @property {string} example - Example property description
 * @property {boolean} disabled - Whether the component is disabled
 * @property {number} count - Example count property
 *
 * @attribute {string} example - Example attribute description
 * @attribute {boolean} disabled - Whether the component is disabled
 * @attribute {number} count - Example count attribute
 *
 * @event {CustomEvent} change - Fired when the component value changes
 * @event {CustomEvent} click - Fired when the component is clicked
 *
 * @slot default - Default slot for component content
 * @slot header - Slot for header content
 * @slot footer - Slot for footer content
 *
 * @cssproperty --vit-color - Primary color of the component
 *
 * @cssstate has-errors - Styles applied when component has errors
 */
export class Accordion extends Base {
    // static override shadowOptions: ShadowRootInit | false = false;
    static override observedAttributes = [""];
    static override styles = [resetStyles, AccordionStyles];

    override connectedCallback() {
        super.connectedCallback();
    }

    override render() {
        return html`
            <details>
                <summary>
                    <slot name="icon"></slot>
                    <slot name="heading"></slot>
                </summary>

                <slot></slot>
            </details>
        `;
    }
}

customElements.define('vit-accordion', Accordion);
