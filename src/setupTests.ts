import "@testing-library/jest-dom";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";

// Extiende las expectativas de Vitest con los matchers de jest-dom
expect.extend(matchers);

// Limpia el DOM después de cada prueba
afterEach(() => {
  cleanup();
});
