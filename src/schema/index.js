import { SchemaComposer } from 'graphql-compose';

const schemaComposer = new SchemaComposer();

import { UserQuery, UserMutation } from './user';
import { GroupQuery } from './group';
import { MessageQuery, MessageMutation, MessageSubscription } from './message';

schemaComposer.Query.addFields({
  ...UserQuery,
  ...GroupQuery,
  ...MessageQuery,
});

schemaComposer.Mutation.addFields({
  ...UserMutation,
  ...MessageMutation,
});

schemaComposer.Subscription.addFields({
  ...MessageSubscription,
});

export default schemaComposer.buildSchema();
