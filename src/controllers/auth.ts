import { RouteHandler } from 'fastify';
import { IDocumentUser, ISignInUserBody, ISignUpUserBody } from '../types/user';
import { MongoServerError } from 'mongodb';

import logger from '../logger';

export const signUpHandler: RouteHandler<{ Body: ISignUpUserBody }> = async (
  req,
  reply,
) => {
  const usersColRef = req.server.mongo.db?.collection('users');
  const { password, username } = req.body;

  try {
    const hash = await req.server.bcrypt.hash(password);
    const user = await usersColRef?.insertOne({
      username: username,
      password: hash,
    });

    // fetch user by id to get data
    const queryUserById = await usersColRef?.findOne({
      _id: user?.insertedId,
    });

    if (queryUserById) {
      reply.header(
        'authorization',
        `Bearer ${req.server.signJwt(req.server, {
          userId: queryUserById._id.toString(),
        })}`,
      );
      return reply
        .status(201)
        .send({ message: 'User created', data: queryUserById });
    }

    return reply.status(201).send({ message: 'User created' });
  } catch (err: MongoServerError | any) {
    logger.error('signUpHandler err:', err);
    if (err instanceof MongoServerError) {
      switch (err.code) {
        case 11000:
          return reply.status(400).send({
            message: `username already in use: '${err?.keyValue?.username}'`,
          });

        default:
          return reply
            .status(400)
            .send({ message: 'Something went wrong', err: err });
      }
    }
    return reply
      .status(500)
      .send({ message: 'Something went wrong. Please try again later' });
  }
};

export const signInHandler: RouteHandler<{ Body: ISignInUserBody }> = async (
  req,
  reply,
) => {
  const usersColRef = req.server.mongo.db?.collection('users');
  const { password, username } = req.body;
  let foundUser: IDocumentUser | null = null;

  req.server.log.info(req.headers);

  // fetch user
  try {
    foundUser = (await usersColRef?.findOne({
      username: username,
    })) as IDocumentUser | null;
    if (!foundUser) {
      return reply.status(400).send({ message: 'Invalid credentials' });
    }
  } catch (err) {
    logger.error('signInHandler err:', err);
    return reply
      .status(500)
      .send({ message: 'Something went wrong. Please try again later' });
  }

  // compare password
  try {
    const compare = await req.server.bcrypt.compare(
      password,
      foundUser.password,
    );
    if (compare) {
      reply.header(
        'authorization',
        `Bearer ${req.server.signJwt(req.server, { userId: foundUser._id })}`,
      );
      const { password, ...rest } = foundUser;
      return reply.status(200).send({ message: 'Signed In', data: rest });
    } else {
      return reply.status(400).send({ message: 'Invalid credentials' });
    }
  } catch (err) {
    logger.error('signInHandler err:', err);
    return reply
      .status(500)
      .send({ message: 'Something went wrong. Please try again later' });
  }
};
