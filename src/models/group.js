import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';

export const GroupSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    collection: 'groups',
  },
);

GroupSchema.plugin(timestamps);

GroupSchema.index({ createdAt: 1, updatedAt: 1 });

export const Group = mongoose.model('Group', GroupSchema);
export const GroupTC = composeWithMongoose(Group);
