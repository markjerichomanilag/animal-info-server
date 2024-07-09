import {
	FastifyInstance,
	FastifyPluginOptions,
	FastifyReply,
	preHandlerHookHandler,
} from "fastify";
import { IJWTPayload } from "../types/auth";
import { VerifyPayloadType } from "@fastify/jwt";

export const parseToObjectId = (
	fastify: FastifyInstance,
	options: FastifyPluginOptions,
	id: string
) => new fastify.mongo.ObjectId(id);

export function htmlReply(reply: FastifyReply) {
	reply.type("text/html");
	reply.send("<h1>HTML decorated reply</h1>");
}

export const signJwt = (fastify: FastifyInstance, payload: IJWTPayload) =>
	fastify.jwt.sign({ userId: payload }, { expiresIn: "1hr" });

export const verifyJwtToken = (
	fastify: FastifyInstance,
	token: string
): VerifyPayloadType & IJWTPayload => fastify.jwt.verify(token);

export const verifyAuthorization: preHandlerHookHandler = (
	req,
	reply,
	done
) => {
	const authorization = req.headers["authorization"];
	if (authorization) {
		const bearer = authorization.split(" ")[1];
		req.server.verifyJwtToken(req.server, bearer);
		done();
	} else {
		return reply.status(401).send("Unauthorized");
	}
};
