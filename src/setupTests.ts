// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: query === "(prefers-color-scheme: dark)", // Adjust this based on the test case
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated, use addEventListener
    removeListener: jest.fn(), // Deprecated, use removeEventListener
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
