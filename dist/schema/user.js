"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserMutation = exports.UserQuery = undefined;

var _user = require("../models/user");

var _auth = require("../utils/auth");

const UserQuery = {
  userById: _user.UserTC.getResolver('findById')
};
const UserMutation = {
  signUp: _user.UserTC.getResolver('signUp', [async (next, s, a, c, i) => {
    let res = await next(s, a, c, i);
    let token = (0, _auth.createToken)(res._id);
    res.token = token;
    return res;
  }]),
  login: _user.UserTC.getResolver('login', [async (next, s, a, c, i) => {
    let res = await next(s, a, c, i);
    let token = (0, _auth.createToken)(res._id);
    res.token = token;
    return res;
  }])
};
exports.UserQuery = UserQuery;
exports.UserMutation = UserMutation;