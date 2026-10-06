import test from "node:test";
import assert from "node:assert/strict";
import { sha256 } from "../worker.js";

test("sha256 deterministik", async () => {
  assert.equal(await sha256("SehatKita"), "6908a9c6a0d06f3c27064bfe776fd132f5b8100eb77f908b2c232fe82ce535d5");
});
