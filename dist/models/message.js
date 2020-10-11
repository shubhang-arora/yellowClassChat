"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Message = exports.MessageTC = exports.MessageSchema = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require("mongoose-timestamp");

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _graphqlComposeMongoose = require("graphql-compose-mongoose");

var _apolloServerExpress = require("apollo-server-express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MessageSchema = exports.MessageSchema = new _mongoose.Schema({
  user: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    trim: true,
    required: true
  },
  group: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  }
}, {
  collection: 'messages'
});
MessageSchema.plugin(_mongooseTimestamp2.default);
MessageSchema.index({
  createdAt: 1,
  updatedAt: 1
});

const Message = _mongoose2.default.model('Message', MessageSchema);

const MessageTC = (0, _graphqlComposeMongoose.composeWithMongoose)(Message);
MessageTC.addResolver({
  name: 'postMessage',
  type: MessageTC,
  args: {
    message: 'String!',
    group: 'String'
  },
  resolve: async ({
    source,
    args,
    context,
    info
  }) => {
    // I know there must be a better way to verify auth
    if (!context._id) {
      throw new _apolloServerExpress.AuthenticationError('Authentication token is invalid, please log in');
    } else {
      const msg = new Message({
        user: context._id,
        group: args.group,
        message: args.message
      });
      let savedMsg = await msg.save();
      return savedMsg;
    }
  }
});
exports.MessageTC = MessageTC;
exports.Message = Message;