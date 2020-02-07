class Validation {
    constructor(params) {
        this.form = params.form;
        this.input = params.input;
        this.button = params.button;
        this.errorField = params.errorField;
        this.setEventListeners = this.setEventListeners.bind(this);    
    }

    // слушатель полей ввода
    setEventListeners() {
        this.input.addEventListener('input', () => {
                this.inputValidate();
            });
    }

    // проверка поля на валидность
    inputValidate() {
            if (!this.input.validity.valid) {
                this.setInvalid();
                return false;
            }
            this.setValid();
            return true;
    }

    // если поле невалидно
    setInvalid() {
        this.errorField.classList.remove('search__error_inactive');
        this.button.setAttribute('disabled', true);
    }
    // если поле валидно
    setValid() {
        this.errorField.classList.add('search__error_inactive');
        this.button.removeAttribute('disabled', true);
    }
}

export {Validation};