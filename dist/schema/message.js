"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageSubscription = exports.MessageMutation = exports.MessageQuery = undefined;

var _message = require("../models/message");

var _apolloServerExpress = require("apollo-server-express");

const pubsub = new _apolloServerExpress.PubSub();
const MessageQuery = {
  messageById: _message.MessageTC.getResolver('findById')
};
const MessageMutation = {
  postMessage: _message.MessageTC.getResolver('postMessage', [async (next, s, a, c, i) => {
    const res = await next(s, a, c, i);
    const _id = res._id;
    if (_id) pubsub.publish('MESSAGE_CREATED', _id);
    return res;
  }])
};
const MessageSubscription = {
  messageCreated: {
    type: _message.MessageTC,
    // way 1: load Order in resolver
    resolve: _id => _message.Message.findById(_id),
    subscribe: () => pubsub.asyncIterator(['MESSAGE_CREATED'])
  }
};
exports.MessageQuery = MessageQuery;
exports.MessageMutation = MessageMutation;
exports.MessageSubscription = MessageSubscription;