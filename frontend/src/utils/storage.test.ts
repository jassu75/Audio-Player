import { expect, test } from "vitest";
import { readStoredJson, writeStoredJson } from "./storage";
test("malformed browser cache falls back safely", () => {
    const storage = { getItem: () => "{bad json" };
    expect(readStoredJson(storage, "user", null)).toBeNull();
});
test("blocked storage does not crash the app", () => {
    const storage = {
        getItem: () => { throw new Error("blocked"); },
        setItem: () => { throw new Error("quota"); },
    };
    expect(readStoredJson(storage, "user", [])).toEqual([]);
    expect(() => writeStoredJson(storage, "user", {})).not.toThrow();
});
