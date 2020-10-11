"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlCompose = require("graphql-compose");

var _user = require("./user");

var _group = require("./group");

var _message = require("./message");

const schemaComposer = new _graphqlCompose.SchemaComposer();
schemaComposer.Query.addFields({ ..._user.UserQuery,
  ..._group.GroupQuery,
  ..._message.MessageQuery
});
schemaComposer.Mutation.addFields({ ..._user.UserMutation,
  ..._message.MessageMutation
});
schemaComposer.Subscription.addFields({ ..._message.MessageSubscription
});
exports.default = schemaComposer.buildSchema();