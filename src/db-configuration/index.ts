import { FastifyInstance } from 'fastify';

import FastifyPlugin from 'fastify-plugin';
import FastifyMongo from '@fastify/mongodb';
import logger from '../logger';

async function createAnimalsCollection(fastify: FastifyInstance) {
  try {
    const animalsColRef = await fastify.mongo.db?.createCollection('animals');
    animalsColRef?.createIndex({ name: 1 }, { unique: true });
    logger.info('animals collection created or already existed');
  } catch (err) {
    logger.error('animals collection failed to create err:', err);
  }
}

async function createUsersCollection(fastify: FastifyInstance) {
  try {
    const usersColRef = await fastify.mongo.db?.createCollection('users');
    usersColRef?.createIndex({ username: 1 }, { unique: true });
    usersColRef?.createIndex(
      { password: 1 },
      {
        unique: false,
      },
    );
    logger.info('users collection created or already existed');
  } catch (err) {
    logger.error('users collection failed to create err:', err);
  }
}

async function dbInitialize(fastify: FastifyInstance) {
  try {
    await fastify.register(FastifyMongo, {
      forceClose: true,
      url: 'mongodb://localhost:27018/fastify_test',
    });

    await createAnimalsCollection(fastify);
    await createUsersCollection(fastify);
  } catch (err: any) {
    logger.error('dbInitialize err:', err);
  }
}

export default FastifyPlugin(dbInitialize);
