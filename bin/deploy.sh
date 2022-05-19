#!/bin/sh
set -e

if [[ "$(git status --porcelain)" != "" ]]; then
    echo "There are unstaged changes. Please make sure the tree is clean before making a release. e.g. 'git stash -u'"
    exit 1
fi
echo "Preparing site for deploy"
rm -rf build/
yarn build
git checkout -- src/versionInfo.json
git switch gh-pages
mkdir -p docs/app
cp -rf build/* docs/app
git add docs/app

# git commit -m "Website deploy"
echo "Site is ready for deploy"
git status

echo "use ./finish-app-deploy.sh to commit, push and switch branch back"
