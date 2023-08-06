set -e

pnpm install
# npx lerna bootstrap

# npx firebase --project=fakeproject emulators:exec 'npm run test'
 firebase --project=fakeproject --only firestore,auth,hosting emulators:exec 'pnpm run test'
 rm -rf playwright-report/*.png
 firebase --project=fakeproject --only firestore,auth,hosting emulators:exec 'npx playwright test'
