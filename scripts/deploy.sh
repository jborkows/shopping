#!/bin/bash

# Fetch the latest changes from the remote
git fetch origin

# Check if there are any local changes that have not been committed or pushed
if [[ $(git status --porcelain) ]]; then
    echo "Error: There are uncommitted changes or changes not pushed to the remote."
    exit 1
fi

# Check out the master branch and ensure it is up-to-date
git checkout master
git pull origin master

# Push the master branch to the prod branch on the origin remote
git push origin master:prod
