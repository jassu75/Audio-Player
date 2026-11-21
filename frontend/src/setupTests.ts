import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import type { ActTestEnvironment } from "./test/types/setupTests.types";

const environment = globalThis as typeof globalThis & ActTestEnvironment;
const previous = environment.IS_REACT_ACT_ENVIRONMENT;
beforeAll(() => { environment.IS_REACT_ACT_ENVIRONMENT = true; });
afterAll(() => { environment.IS_REACT_ACT_ENVIRONMENT = previous; });
afterEach(cleanup);
