const emailInput = document.getElementById('email');
const nameInput = document.getElementById('name');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('password-confirm');
const checkboxInput = document.getElementById('check');

const checkboxField = document.querySelector('.check');

const sendButton = document.querySelector('.button');

const form = document.querySelector('.form');

form.addEventListener('click', function (e) {
  if (e.target.classList.contains('form__input_error')) {
    e.target.classList.remove('form__input_error');
    e.target.nextSibling.remove();
  }
  if (
    e.target.classList.contains('check__input') &&
    e.target.parentElement.classList.contains('form__input_error')
  ) {
    e.target.parentElement.classList.remove('form__input_error');
    e.target.parentElement.nextSibling.remove();
  }
});

function checkForMaxLengthError(length, maxLength) {
  if (length > maxLength) {
    return `Максимальный размер строки: ${maxLength}`;
  }
  return false;
}

function checkForMinLengthError(length, minLength) {
  if (length < minLength) {
    return `Минимальный размер строки: ${minLength}`;
  }
  return false;
}

/*
 Так как в задании всего 2 случая, то есть либо содержать символ либо нет, 
 я вписал просто строками какие ошибки должны возвращаться.
*/
function checkForFormat(type, expression) {
  if (type === 'password') {
    let validatorScore = validator.isStrongPassword(expression, {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: true,
      pointsForContainingLower: 0,
      pointsForContainingUpper: 0,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    });

    if (validatorScore <= 8) {
      return 'Поле должно содержать как минимум 1 не буквенный символ';
    }

    return false;
  } else {
    return validator.isEmail(expression)
      ? false
      : 'Поле должно быть в формате xxx@xxx.xx';
  }
}

function checkEmail() {
  const maxEmailLength = 100;
  const errorMessageArray = [];

  if (emailInput.value.trim() !== '') {
    errorMessageArray.push(
      checkForMaxLengthError(emailInput.value.length, maxEmailLength)
    );
    errorMessageArray.push(checkForFormat('email', emailInput.value));
  } else {
    errorMessageArray.push('Поле обязательно для заполнения');
  }

  return errorMessageArray;
}

function checkName() {
  const maxNameLength = 150;
  const errorMessageArray = [];

  if (nameInput.value.trim() !== '') {
    errorMessageArray.push(
      checkForMaxLengthError(nameInput.value.length, maxNameLength)
    );
  } else {
    errorMessageArray.push('Поле обязательно для заполнения');
  }

  return errorMessageArray;
}

function checkPassword() {
  const minPasswordLength = 8;
  const maxPasswordLength = 30;

  const errorMessageArray = [];

  if (passwordInput.value.trim() !== '') {
    errorMessageArray.push(
      checkForMinLengthError(passwordInput.value.length, minPasswordLength)
    );
    errorMessageArray.push(
      checkForMaxLengthError(passwordInput.value.length, maxPasswordLength)
    );
    errorMessageArray.push(checkForFormat('password', passwordInput.value));
  } else {
    errorMessageArray.push('Поле обязательно для заполнения');
  }

  return errorMessageArray;
}

function checkConfirmPassword() {
  const errorMessageArray = [];

  if (confirmPasswordInput.value.trim() === '') {
    errorMessageArray.push('Поле обязательно для заполнения');
  } else {
    if (passwordInput.value !== confirmPasswordInput.value) {
      errorMessageArray.push('Пароли должны совпадать!');
    }
    errorMessageArray.push(false);
  }

  return errorMessageArray;
}

function checkCheckbox() {
  const errorMessageArray = [];

  if (!checkboxInput.checked) {
    errorMessageArray.push('Вы должны подтвердить регистрацию');
  } else {
    errorMessageArray.push(false);
  }

  return errorMessageArray;
}

function formatErrorMessageArray(errorMessageArray) {
  return errorMessageArray.filter(element => element !== false);
}

function insertErrorMessageHTML(inputType, errorArray) {
  inputType.classList.add('form__input_error');

  inputType.insertAdjacentHTML(
    'afterend',
    `<p class="form__error">${formatErrorMessageArray(errorArray).join(
      ', '
    )}</p>`
  );
}

sendButton.addEventListener('click', function (e) {
  let canPass = true;
  const errors = document.querySelectorAll('.form__error');
  errors.forEach(element => {
    element.remove();
  });

  e.preventDefault();

  emailErrors = checkEmail();
  nameErrors = checkName();
  passwordErrors = checkPassword();
  confirmPasswordErrors = checkConfirmPassword();
  checkboxErrors = checkCheckbox();

  if (formatErrorMessageArray(emailErrors).length !== 0) {
    insertErrorMessageHTML(emailInput, emailErrors);
    canPass = false;
  }

  if (formatErrorMessageArray(nameErrors).length !== 0) {
    insertErrorMessageHTML(nameInput, nameErrors);
    canPass = false;
  }

  if (formatErrorMessageArray(passwordErrors).length !== 0) {
    insertErrorMessageHTML(passwordInput, passwordErrors);
    canPass = false;
  }

  if (formatErrorMessageArray(confirmPasswordErrors).length !== 0) {
    insertErrorMessageHTML(confirmPasswordInput, confirmPasswordErrors);
    canPass = false;
  }

  if (formatErrorMessageArray(checkboxErrors).length !== 0) {
    insertErrorMessageHTML(checkboxField, checkboxErrors);
    canPass = false;
  }

  if (canPass) {
    localStorage.setItem('email', emailInput.value);
    localStorage.setItem('name', nameInput.value);
    localStorage.setItem('password', passwordInput.value);
    form.insertAdjacentHTML('afterend', `<h2>Вы создали аккаунт!</h2>`);
    form.remove();
  }
});
