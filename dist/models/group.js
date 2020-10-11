"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupTC = exports.Group = exports.GroupSchema = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require("mongoose-timestamp");

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _graphqlComposeMongoose = require("graphql-compose-mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GroupSchema = exports.GroupSchema = new _mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  }
}, {
  collection: 'groups'
});
GroupSchema.plugin(_mongooseTimestamp2.default);
GroupSchema.index({
  createdAt: 1,
  updatedAt: 1
});

const Group = exports.Group = _mongoose2.default.model('Group', GroupSchema);

const GroupTC = exports.GroupTC = (0, _graphqlComposeMongoose.composeWithMongoose)(Group);