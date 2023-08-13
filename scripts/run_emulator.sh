#!/bin/bash
# firebase emulators:start --only firestore,hosting,auth
firebase --only firestore,hosting,auth emulators:exec  --import "app_data" --export-on-exit "app_data" 'pnpm start'

