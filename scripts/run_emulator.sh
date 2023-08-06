#!/bin/bash
# firebase emulators:start --only firestore,hosting,auth

firebase --only firestore,hosting,auth emulators:exec 'pnpm start'

