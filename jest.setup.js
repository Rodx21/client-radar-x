/* global jest */
// Jest setup: use the official in-memory mock for AsyncStorage in every test file.
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
