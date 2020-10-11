import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { AuthenticationError } from 'apollo-server-express';

export const MessageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      trim: true,
      required: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
  },
  {
    collection: 'messages',
  },
);

MessageSchema.plugin(timestamps);

MessageSchema.index({ createdAt: 1, updatedAt: 1 });

const Message = mongoose.model('Message', MessageSchema);

const MessageTC = composeWithMongoose(Message);

MessageTC.addResolver({
  name: 'postMessage',
  type: MessageTC,
  args: {
    message: 'String!',
    group: 'String',
  },
  resolve: async ({ source, args, context, info }) => {
    // I know there must be a better way to verify auth
    if (!context._id) {
      throw new AuthenticationError(
        'Authentication token is invalid, please log in',
      );
    } else {
      const msg = new Message({
        user: context._id,
        group: args.group,
        message: args.message,
      });
      let savedMsg = await msg.save();
      return savedMsg;
    }
  },
});

export { MessageTC, Message };
