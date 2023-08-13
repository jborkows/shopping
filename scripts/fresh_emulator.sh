#!/bin/bash
rm -rf app_data || echo Not existing

firebase --only firestore,hosting,auth emulators:start --import "data" --export-on-exit "data"
cp -r data app_data

