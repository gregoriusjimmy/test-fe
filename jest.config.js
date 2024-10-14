/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transformIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePaths: ["node_modules", "<rootDir>/src"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass|svg|png)$": "identity-obj-proxy",
    '^@constant/(.*)$': '<rootDir>/src/$1',
    '^@type/(.*)$': '<rootDir>/src/$1',
    '^@ui/(.*)$': '<rootDir>/src/$1',
  },
};