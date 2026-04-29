import { Base } from "./base.js";

export class Form extends Base {
    static formAssociated: boolean = true;
    static override shadowOptions: ShadowRootInit = {
        mode: "open",
        delegatesFocus: true,
    };

    constructor() {
        super();

        this.addEventListener("invalid", (event: Event) => {
            event.preventDefault();
            console.warn("invalid event");
        });
    }

    get form(): HTMLFormElement | null {
        return this.internals.form;
    }
    get name(): string | null {
        return this.getAttribute("name");
    }
    get type(): string {
        return this.localName;
    }
    get validity(): ValidityState {
        return this.internals.validity;
    }
    get validationMessage(): string {
        return this.internals.validationMessage;
    }
    get willValidate(): boolean {
        return this.internals.willValidate;
    }

    checkValidity(): boolean {
        return this.internals.checkValidity();
    }
    reportValidity(): boolean {
        return this.internals.reportValidity();
    }
}
