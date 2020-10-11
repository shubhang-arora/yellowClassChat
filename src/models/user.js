import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server-express';

export const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'users',
  },
);

UserSchema.plugin(timestamps);

UserSchema.index({ createdAt: 1, updatedAt: 1 });

UserSchema.pre('save', function (next) {
  // arrow function not work with pre :/
  let user = this;

  // only hash the password if it has been modified (or is new)
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (error, salt) {
      // handle error
      if (error) return next(error);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function (error, hash) {
        // handle error
        if (error) return next(error);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// post saving user
UserSchema.post('save', function (user, next) {
  next();
});

const User = mongoose.model('User', UserSchema);
const UserTC = composeWithMongoose(User);

UserTC.addResolver({
  name: 'signUp',
  type: UserTC,
  args: {
    name: 'String!',
    email: 'String',
    password: 'String',
  },
  resolve: async ({ source, args, context, info }) => {
    const user = new User({
      name: args.name,
      email: args.email,
      password: args.password,
    });
    // Saving user in db
    let newUser = await user.save();
    return newUser;
  },
});

UserTC.addResolver({
  name: 'login',
  type: UserTC,
  args: {
    email: 'String',
    password: 'String',
  },
  resolve: async ({ source, args, context, info }) => {
    // Fetching user by email
    let user = await User.findOne({ email: args.email });
    if (!user) {
      throw new AuthenticationError('Wrong email');
    } else {
      // Checking password
      let isMatch = await bcrypt.compare(args.password, user.password);
      if (isMatch) {
        return user;
      } else {
        throw new AuthenticationError('Wrong Credentials');
      }
    }
  },
});

// Extra field added
UserTC.addFields({
  token: 'String',
});

export { User, UserTC };
