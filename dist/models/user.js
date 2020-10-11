"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserTC = exports.User = exports.UserSchema = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require("mongoose-timestamp");

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _graphqlComposeMongoose = require("graphql-compose-mongoose");

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _apolloServerExpress = require("apollo-server-express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserSchema = exports.UserSchema = new _mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  collection: 'users'
});
UserSchema.plugin(_mongooseTimestamp2.default);
UserSchema.index({
  createdAt: 1,
  updatedAt: 1
});
UserSchema.pre('save', function (next) {
  // arrow function not work with pre :/
  let user = this; // only hash the password if it has been modified (or is new)

  if (this.isModified('password') || this.isNew) {
    _bcrypt2.default.genSalt(10, function (error, salt) {
      // handle error
      if (error) return next(error); // hash the password using our new salt

      _bcrypt2.default.hash(user.password, salt, function (error, hash) {
        // handle error
        if (error) return next(error); // override the cleartext password with the hashed one

        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
}); // post saving user

UserSchema.post('save', function (user, next) {
  next();
});

const User = _mongoose2.default.model('User', UserSchema);

const UserTC = (0, _graphqlComposeMongoose.composeWithMongoose)(User);
UserTC.addResolver({
  name: 'signUp',
  type: UserTC,
  args: {
    name: 'String!',
    email: 'String',
    password: 'String'
  },
  resolve: async ({
    source,
    args,
    context,
    info
  }) => {
    const user = new User({
      name: args.name,
      email: args.email,
      password: args.password
    }); // Saving user in db

    let newUser = await user.save();
    return newUser;
  }
});
UserTC.addResolver({
  name: 'login',
  type: UserTC,
  args: {
    email: 'String',
    password: 'String'
  },
  resolve: async ({
    source,
    args,
    context,
    info
  }) => {
    // Fetching user by email
    let user = await User.findOne({
      email: args.email
    });

    if (!user) {
      throw new _apolloServerExpress.AuthenticationError('Wrong email');
    } else {
      // Checking password
      let isMatch = await _bcrypt2.default.compare(args.password, user.password);

      if (isMatch) {
        return user;
      } else {
        throw new _apolloServerExpress.AuthenticationError('Wrong Credentials');
      }
    }
  }
}); // Extra field added

UserTC.addFields({
  token: 'String'
});
exports.User = User;
exports.UserTC = UserTC;