import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

const createToken = (id) => {
  try {
    // here you will add actual database call to validate username/password
    const token = jwt.sign({ _id: id }, 'supersecret');
    return token;
  } catch (e) {
    throw new AuthenticationError(
      'Authentication token is invalid, please log in',
    );
  }
};

const verifyToken = (token) => {
  try {
    let { _id } = jwt.verify(token, 'supersecret');
    return _id;
  } catch (e) {
    //
  }
};

export { verifyToken, createToken };
