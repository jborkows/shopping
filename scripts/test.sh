set -e

pnpm install
# npx lerna bootstrap

# npx firebase --project=fakeproject emulators:exec 'npm run test'
 firebase --project=fakeproject --only firestore emulators:exec 'pnpm run test'
