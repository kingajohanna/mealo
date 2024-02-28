module.exports = {
  preset: "ts-jest",
  verbose: true,
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
  collectCoverageFrom: ["src/graphql/**/*.ts", "!src/graphql/**/index.ts"],
};
