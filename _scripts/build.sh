#!/bin/bash

set -e

echo "Build starts"
rm -fr _dist
rm -fr server/build
rm -fr client/build

# Build server
echo "Building server code..."
cd server
npm run build

cd ..

# Build client
echo "Building client code..."
cd client
npm run build

cd ..

# Copy to output folder
echo "Copying to output folder..."
mkdir _dist

cp server/package.json _dist/package.json
cp -R server/build _dist/src
cp -R client/build _dist/src/public

echo "Build finished"
