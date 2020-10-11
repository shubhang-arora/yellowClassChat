import { Message, MessageTC } from '../models/message';
import { PubSub } from 'apollo-server-express';
const pubsub = new PubSub();

const MessageQuery = {
  messageById: MessageTC.getResolver('findById'),
};

const MessageMutation = {
  postMessage: MessageTC.getResolver('postMessage', [
    async (next, s, a, c, i) => {
      const res = await next(s, a, c, i);
      const _id = res._id;
      if (_id) pubsub.publish('MESSAGE_CREATED', _id);
      return res;
    },
  ]),
};

const MessageSubscription = {
  messageCreated: {
    type: MessageTC,
    // way 1: load Order in resolver
    resolve: (_id) => Message.findById(_id),
    subscribe: () => pubsub.asyncIterator(['MESSAGE_CREATED']),
  },
};

export { MessageQuery, MessageMutation, MessageSubscription };
