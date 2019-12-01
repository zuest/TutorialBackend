const User = require('./user.model');
const validateRegisterInput = require('../helpers/register');
const bcrypt = require('bcryptjs');
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((foundUser) => {
      req.user = foundUser; // eslint-disable-line no-param-reassign
      return next();
    }).catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res) {
    // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((foundUser) => {
    if (foundUser) {
      return res.status(400).json({ email: 'Email already exists' });
    }
    const newUser = new User({
      email: req.body.email,
      password: req.body.password
    });
// Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (hashError, hash) => {
        if (hashError) throw hashError;
        newUser.password = hash;
        newUser.save()
              .then(newCreatedUser => res.json(newCreatedUser))
              .catch(error => console.log(error));
      });
    });
  });
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const updatedUser = req.user;
  updatedUser.username = req.body.username;
  updatedUser.mobileNumber = req.body.mobileNumber;

  updatedUser.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const removedUser = req.user;
  removedUser.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
