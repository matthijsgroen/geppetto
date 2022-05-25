#!/bin/sh
set -e

if [[ "$(git status --porcelain)" != "" ]]; then
    echo "There are unstaged changes. Please make sure the tree is clean before making a release. e.g. 'git stash -u'"
    exit 1
fi
echo "Preparing storybook for deploy"
rm -rf storybook-static
yarn build-storybook

git reset --hard
git switch gh-pages

mkdir -p docs/storybook
cp -rf storybook-static/* docs/storybook
git add docs/storybook

echo "Site is ready for deploy"
git status

echo "use ./finish-app-deploy.sh to commit, push and switch branch back"
