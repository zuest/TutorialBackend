const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data) {
  const errors = {};
  const userData = data;
// Convert empty fields to an empty string so we can use validator functions
  userData.email = !isEmpty(userData.email) ? userData.email : '';
  userData.password = !isEmpty(userData.password) ? userData.password : '';
  userData.password2 = !isEmpty(userData.password2) ? userData.password2 : '';

// Email checks
  if (Validator.isEmpty(userData.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(userData.email)) {
    errors.email = 'Email is invalid';
  }
// Password checks
  if (Validator.isEmpty(userData.password)) {
    errors.password = 'Password field is required';
  }
  if (Validator.isEmpty(userData.password2)) {
    errors.password2 = 'Confirm password field is required';
  }
  if (!Validator.isLength(userData.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (!Validator.equals(userData.password, userData.password2)) {
    errors.password2 = 'Passwords must match';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
