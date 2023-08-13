#!/bin/bash
set -e

pnpm install
# npx lerna bootstrap

# npx firebase --project=fakeproject emulators:exec 'npm run test'
 firebase --only firestore,hosting,auth emulators:exec  --import "data" 'pnpm run test'
 rm -rf playwright-report/*.png
 firebase --project=fakeproject --only firestore,auth,hosting emulators:exec --import "data" 'npx playwright test'
