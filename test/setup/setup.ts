import index from "../../src/index";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

before(async () => {
  console.log("running setup");
  await fakeMongoDB();
  //TODO - use redis mocks on tests

  await waitUntilReady();
});

after(() => {
  console.log("tearing down");

  mongoServer?.stop();
  index.close();
});

const fakeMongoDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  process.env.MONGO_CONNECTION = mongoUri;
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
