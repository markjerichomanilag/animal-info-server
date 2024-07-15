import { verifyJwtToken } from './helpers';

import Fastify from 'fastify';
import dbInitialize from './db-configuration';
import AnimalRoutes from './routes/animals';
import AuthRoutes from './routes/auth';
import fastifyJwt from '@fastify/jwt';
import 'dotenv/config';

const fastify = Fastify({ logger: true });

const PORT = 5000;

// initialize DB
dbInitialize(fastify);

// decorators
fastify.decorate('verifyJwtToken', verifyJwtToken);

// register plugins
fastify.register(fastifyJwt, { secret: 'SUPER-SECRET-KEY' }); // create an env variable for this

// register routes
fastify.register(AnimalRoutes, { prefix: '/animals' });
fastify.register(AuthRoutes, { prefix: '/auth' });

fastify.ready((err) => {
  if (err) {
    fastify.log.error(`register-plugins error: ${err}`);
  }
});

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info(address);
});
