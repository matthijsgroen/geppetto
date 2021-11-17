#!/bin/sh

cd website
yarn build
cp -r build/ ../docs
