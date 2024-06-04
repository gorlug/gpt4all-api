#!/bin/bash

DEST=/gpt4all-api

echo "Compiling nestjs..."
pnpm i
pnpm run build
echo "Compile complete."

echo "deploying"
mkdir -p $DEST/api
cp dist/main.js $DEST/api/main.js
cp package.json $DEST/api/package.json
cp pnpm-lock.yaml $DEST/api/pnpm-lock.yaml
cp models3.json $DEST/api/models3.json
cp docker/gpt4all-api/docker-compose.yml $DEST/docker-compose.yml

cd $DEST/api
pnpm i --prod
cd ..
docker-compose up -d
docker-compose restart
echo "Deployment complete."

