/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  describe,
  test,
  beforeEach,
  beforeAll,
  afterAll,
  expect,
} from "@jest/globals";
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  expectFirestorePermissionDenied,
  expectFirestorePermissionUpdateSucceeds,
  getFirestoreCoverageMeta,
} from "./utils";
import { readFileSync, createWriteStream } from "node:fs";
import { get } from "node:http";
import { resolve } from "node:path";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  setLogLevel,
} from "firebase/firestore";

let testEnv: RulesTestEnvironment;
const PROJECT_ID = "fakeproject2";
const FIREBASE_JSON = resolve(__dirname, "../firebase.json");

beforeAll(async () => {
  // Silence expected rules rejections from Firestore SDK. Unexpected rejections
  // will still bubble up and will be thrown as an error (failing the tests).
  setLogLevel("error");
  const { host, port } = getFirestoreCoverageMeta(PROJECT_ID, FIREBASE_JSON);
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host,
      port,
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });
});

afterAll(async () => {
  // Write the coverage report to a file
  const { coverageUrl } = getFirestoreCoverageMeta(PROJECT_ID, FIREBASE_JSON);
  const coverageFile = "./firestore-coverage.html";
  const fstream = createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
    get(coverageUrl, (res) => {
      res.pipe(fstream, { end: true });
      res.on("end", resolve);
      res.on("error", reject);
    });
  });
  console.log(`View firestore rule coverage information at ${coverageFile}\n`);
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

// If you want to define global variables for Rules Test Contexts to save some
// typing, make sure to initialize them for *every test* to avoid cache issues.
//
//     let unauthedDb;
//     beforeEach(() => {
//       unauthedDb = testEnv.unauthenticatedContext().database();
//     });
//
// Or you can just create them inline to make tests self-contained like below.

describe("Public user profiles", () => {
  test("should not allow users to read from a random collection", async () => {
    let unauthedDb = testEnv.unauthenticatedContext().firestore();

    await expectFirestorePermissionDenied(getDoc(doc(unauthedDb, "foo/bar")));
  });

  test("should allow ONLY signed in users to create their own profile with required `createdAt` field", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "allowedUsers/user@example.com"), {
        foo: "bar",
      });
    });
    const aliceDb = testEnv
      .authenticatedContext("user-id", { email: "user@example.com" })
      .firestore();

    await expectFirestorePermissionUpdateSucceeds(
      setDoc(doc(aliceDb, "users/alice"), {
        birthday: "January 1",
        createdAt: serverTimestamp(),
      }),
    );

    const bobDB = testEnv
      .authenticatedContext("user-id-1", { email: "bob@example.com" })
      .firestore();
    // Signed in user without required fields
    await expectFirestorePermissionDenied(
      setDoc(doc(bobDB, "users/alice"), {
        birthday: "January 1",
      }),
    );
  });
});
