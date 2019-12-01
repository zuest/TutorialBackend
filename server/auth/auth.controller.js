const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const validateLoginInput = require('../helpers/login');
const bcrypt = require('bcryptjs');
const User = require('./../user/user.model');


/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // const header = req.headers['authorization'] || '';        // get the header
  // tok = header.split(/\s+/).pop() || '';           // and the encoded auth token
  // auth = new Buffer(tok, 'base64').toString();    // convert from base64
  // parts = auth.split(/:/);                          // split on colon
  //   username = parts[0];
  //  password = parts[1];
  // const userObj = {
  //   username,
  //   password
  // };
  const auth = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString();
  const parts = auth.split(/:/);                          // split on colon
  const username = parts[0];
  const password = parts[1];
  req.body.email = username;
  req.body.password = password;
  const { errors, isValid } = validateLoginInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const pass = req.body.password;
// Find user by email
  User.findOne({ email }).then((foundUser) => {
    // Check if user exists
    if (!foundUser) {
      return res.status(404).json({ emailnotfound: 'Email not found' });
    }
// Check password
    bcrypt.compare(pass, foundUser.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: foundUser.id,
        };
// Sign token
        jwt.sign(
          payload,
          config.jwtSecret,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: 'Password incorrect' });
      }
    });
  });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = { login, getRandomNumber };
