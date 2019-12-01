const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateLoginInput(data) {
  const errors = {};
  const userInput = data;
  console.log('!!@!!!!', userInput);
// Convert empty fields to an empty string so we can use validator functions
  userInput.email = !isEmpty(userInput.email) ? userInput.email : '';
  userInput.password = !isEmpty(userInput.password) ? userInput.password : '';
// Email checks
  if (Validator.isEmpty(userInput.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(userInput.email)) {
    errors.email = 'Email is invalid';
  }
// Password checks
  if (Validator.isEmpty(userInput.password)) {
    errors.password = 'Password field is required';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
