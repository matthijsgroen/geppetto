#!/bin/sh

rm -rf docs/beta
cd website
yarn build
cp -r build ../docs/beta
