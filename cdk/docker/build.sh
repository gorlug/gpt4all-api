cd ../../
pnpm run build:lambda
cd cdk/docker
cp ../../dist/gpt4all.hander.js ./index.js
cp ../../package.json ./
cp ../../pnpm-lock.yaml ./

pnpm install --prod --node-linker=hoisted

docker build --platform linux/amd64 -t gpt4all-api:latest .
