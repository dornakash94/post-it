import index from "../../src/index";
import { MongoMemoryServer } from "mongodb-memory-server";
import { RedisMemoryServer } from "redis-memory-server";

let mongoServer: MongoMemoryServer;
let redisServer: RedisMemoryServer;

before(async () => {
  console.log("running setup");
  await fakeMongoDB();
  await fakeRedis();
  await waitUntilReady();
});

after(() => {
  console.log("tearing down");

  mongoServer?.stop();
  redisServer?.stop();
  index.close();
});

const fakeMongoDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  process.env.MONGO_CONNECTION = mongoUri;
};

const fakeRedis = async () => {
  redisServer = await RedisMemoryServer.create();
  await redisServer.start();

  process.env.REDIS_CONNECTION = `redis://localhost:${redisServer.instanceInfoSync?.port}`;
};

const waitUntilReady = (): Promise<void> => {
  return new Promise((resolve) => {
    (function waitingForReady() {
      index.isReady().then((ready) => {
        if (ready) resolve();
        else setTimeout(waitingForReady, 30);
      });
    })();
  });
};
