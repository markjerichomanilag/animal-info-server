import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { parseToObjectId, verifyAuthorization } from '../helpers';
import {
  createAnimalOpts,
  deleteAnimalOpts,
  getAnimalOpts,
  getAnimalsOpts,
} from '../route-options/animals';
import {
  createAnimalHandler,
  deleteAnimalHandler,
  getAnimalHandler,
  getAnimalsHandler,
} from '../controllers/animals';
import FastifyAuth from '@fastify/auth';

async function AnimalRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void,
) {
  fastify
    .decorate('parseToObjectId', parseToObjectId)
    .decorate('verifyAuthorization', verifyAuthorization)
    .register(FastifyAuth)
    .after(() => {
      fastify.route({
        method: 'GET',
        url: '/',
        schema: getAnimalsOpts.schema,
        handler: getAnimalsHandler,
      });

      fastify.route({
        method: 'GET',
        url: '/:id',
        schema: getAnimalOpts.schema,
        handler: getAnimalHandler,
      });
      fastify.route({
        method: 'POST',
        url: '/',
        schema: createAnimalOpts.schema,
        preHandler: fastify.auth([fastify.verifyAuthorization]),
        handler: createAnimalHandler,
      });
      fastify.route({
        method: 'DELETE',
        url: '/:id',
        schema: deleteAnimalOpts.schema,
        preHandler: fastify.auth([fastify.verifyAuthorization]),
        handler: deleteAnimalHandler,
      });

      fastify.route({
        method: 'GET',
        url: '/protected',
        preHandler: fastify.auth([fastify.verifyAuthorization]),
        handler: getAnimalsHandler,
      });
    });

  done();
}

export default AnimalRoutes;
