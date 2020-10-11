import { UserTC } from '../models/user';
import { createToken } from '../utils/auth';
const UserQuery = {
  userById: UserTC.getResolver('findById'),
};

const UserMutation = {
  signUp: UserTC.getResolver('signUp', [
    async (next, s, a, c, i) => {
      let res = await next(s, a, c, i);
      let token = createToken(res._id);
      res.token = token;
      return res;
    },
  ]),
  login: UserTC.getResolver('login', [
    async (next, s, a, c, i) => {
      let res = await next(s, a, c, i);
      let token = createToken(res._id);
      res.token = token;
      return res;
    },
  ]),
};

export { UserQuery, UserMutation };
