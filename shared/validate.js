import { CustomError } from './custom-error.js';

class ValidationError extends CustomError {
  constructor({ message = 'Validation failed.', status = 422, element }) {
    super(message);

    this.name = 'ValidationError';
    this.element = element;
    this.status = status;
  }
}

async function validate(element, options) {
  if (typeof options === 'undefined')
    options = {
      hook: 'required'
    };
  else if (typeof options === 'string')
    options = {
      hook: options
    };

  const value = element?.value;

  element.errorMessage = void 0;
  element.state = 'default';

  switch (options.hook) {
    case 'required':
      if (
        typeof value === 'undefined' ||
        value?.toString().replace(/\s*/g, '') === ''
      ) {
        element.errorMessage = 'Это поле обязательно';
        element.state = 'error';

        element?.focus();

        throw new ValidationError({
          element,
          message: 'Форма заполнена некорректно или не полностью.'
        });
      }

      break;
  }
}

function invalidate(element, options = {}) {
  const errorMessage = options.errorMessage ?? 'Неизвестная ошибка';

  if (element.$pppController.definition.type.name === 'Toast') {
    element.appearance = 'warning';
    element.dismissible = true;

    if (!element.source.toastTitle) element.source.toastTitle = 'ppp';

    element.source.toastText = errorMessage;

    element.visible = true;
  } else {
    element.errorMessage = errorMessage;
    element.state = 'error';

    element?.focus();
  }

  if (!options.silent)
    throw new ValidationError({
      message: errorMessage,
      element,
      status: options.status
    });
}

export { validate, invalidate };
