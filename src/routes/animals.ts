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

async function AnimalRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void,
) {
  //  decorators
  fastify.decorate('parseToObjectId', parseToObjectId);
  fastify.decorate('verifyAuthorization', verifyAuthorization);

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
    handler: createAnimalHandler,
  });

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: deleteAnimalOpts.schema,
    handler: deleteAnimalHandler,
  });

  fastify.route({
    method: 'GET',
    url: '/protected',
    preHandler: [fastify.verifyAuthorization],
    handler: getAnimalsHandler,
  });

  done();
}

export default AnimalRoutes;
