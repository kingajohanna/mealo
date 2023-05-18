const { MongoMemoryServer } = require("mongodb-memory-server");

module.exports = async () => {
  // Set up the MongoDB memory server
  const mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();

  // Set the MongoDB URI in the environment variable
  process.env.MONGO_URI = mongoUri;

  // Close the server after all tests are done
  await mongoServer.stop();
};
