"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createToken = exports.verifyToken = undefined;

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _apolloServerExpress = require("apollo-server-express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createToken = id => {
  try {
    // here you will add actual database call to validate username/password
    const token = _jsonwebtoken2.default.sign({
      _id: id
    }, 'supersecret');

    return token;
  } catch (e) {
    throw new _apolloServerExpress.AuthenticationError('Authentication token is invalid, please log in');
  }
};

const verifyToken = token => {
  try {
    let {
      _id
    } = _jsonwebtoken2.default.verify(token, 'supersecret');

    return _id;
  } catch (e) {//
  }
};

exports.verifyToken = verifyToken;
exports.createToken = createToken;