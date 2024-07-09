import FastifyPlugin from 'fastify-plugin';
import FastifyMongo from '@fastify/mongodb';
import { FastifyInstance } from 'fastify';

async function createAnimalsCollection(fastify: FastifyInstance) {
  try {
    await fastify.mongo.db?.createCollection('animals');
    fastify.log.info('animals collection created or already existed');
  } catch (err) {
    fastify.log.error('animals collection failed to create');
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
    fastify.log.info('users collection created or already existed');
    fastify.log.info('users collection indexes ');
  } catch (err) {
    fastify.log.error('users collection failed to create');
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
    fastify.log.error(err);
  }
}

export default FastifyPlugin(dbInitialize);
