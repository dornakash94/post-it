import express, { Request, Response, Express } from "express";
import createMiddleware from "swagger-express-middleware";
import controllers from "./controllers";
import { ControllerResponse, Session } from "./controllers/helper";
import { UserDao } from "./persistence/dao/UserDao";
import MongoUserDao from "./persistence/dao/mongo/MongoUserDao";
import MongoPostDao from "./persistence/dao/mongo/MongoPostDao";
import * as Auth from "./utils/auth";
import logger from "./utils/logger";
import "dotenv/config";
import { PostDao } from "./persistence/dao/PostDao";
import mongoose from "mongoose";
import { createClient, RedisClientType } from "redis";
import RedisStore from "rate-limit-redis";
import rateLimit from "express-rate-limit";
import { Server } from "http";

interface Context {
  redisClient: RedisClientType;
  app: Express;
  jwtInstance: Auth.JwtInstance<Session>;
  userDao: UserDao;
  postDao: PostDao;
  isReady: () => Promise<boolean>;
  close: () => void;
}

const init = (): Context => {
  if (!process.env.JWT_SECRET) {
    throw "couldn't find 'JWT_SECRET' on the env";
  }

  const app = express();

  const jwtInstance: Auth.JwtInstance<Session> = Auth.initialize(
    process.env.JWT_SECRET
  );

  const userDao: UserDao = MongoUserDao;
  const postDao: PostDao = MongoPostDao;

  let serverPromise: Promise<Server> | undefined;
  let ready = false;

  const result = {
    redisClient: undefined as any,
    isReady: () => Promise.resolve(false),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    close: () => {},
    app,
    jwtInstance,
    userDao,
    postDao,
  };

  const isReady = async (): Promise<boolean> => {
    if (!serverPromise) {
      if (!process.env.MONGO_CONNECTION) {
        throw "couldn't find 'MONGO_CONNECTION' on the env";
      }

      await mongoose.connect(process.env.MONGO_CONNECTION);

      if (!process.env.REDIS_CONNECTION) {
        throw "couldn't find 'REDIS_CONNECTION' on the env";
      }

      result.redisClient = createClient({
        url: process.env.REDIS_CONNECTION,
      });

      await result.redisClient.connect();

      const limiter = rateLimit({
        windowMs: 1000 * 60 * 15,
        max: 1000000,
        standardHeaders: true,
        legacyHeaders: false,
        store: new RedisStore({
          sendCommand: (...args: string[]) =>
            result.redisClient.sendCommand(args),
        }),
      });

      createMiddleware("../shared/post-it.yaml", app, (_err, middleware) => {
        app.use(
          middleware.metadata(),
          middleware.CORS(),
          middleware.files(),
          middleware.parseRequest(),
          middleware.validateRequest(),
          limiter
        );

        controllers.forEach((controller) => {
          app[controller.method](
            controller.path,
            async (req: Request, res: Response) => {
              try {
                const response: ControllerResponse<unknown> =
                  await controller.handler(
                    req.params as any,
                    req.query as any,
                    req.headers as any,
                    req.body as any
                  );
                res
                  .status(response.code || 200)
                  .send(response.body || response.error);
              } catch (e: any) {
                logger.error(e);
                res
                  .status(e.code || 500)
                  .send(e.error || "something went wrong");
              }
            }
          );
        });

        // Error handler to send the swagger validation response
        app.use((err: any, _req: Request, res: Response, _next: any) => {
          res.status(err.status).json({
            type: "SCHEMA VALIDATION FAILED",
            message: err.message.replace(/\r?\n|\r/g, ".").replace(/"/g, "'"),
          });
        });

        return Promise.resolve();
      });

      serverPromise = Promise.resolve(
        app.listen(8080, function () {
          logger.info("post-it is now running at http://localhost:8080");
          ready = true;
        })
      );
    }

    return Promise.resolve(ready);
  };

  const close = () => {
    serverPromise?.then((server) => server.close());
    mongoose.connection.close();
    result.redisClient.quit();
  };

  if (!process.env.MANUAL_START) {
    isReady(); //will auto start the server
  }

  result.isReady = isReady;
  result.close = close;

  return result;
};

export default init();
