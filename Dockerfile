FROM node:24.1.0@sha256:c332080545f1de96deb1c407e6fbe9a7bc2be3645e127845fdcce57a7af3cf56 as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:24.1.0@sha256:c332080545f1de96deb1c407e6fbe9a7bc2be3645e127845fdcce57a7af3cf56 as release
WORKDIR /app
COPY --chown=node:node --from=base /app/package*.json ./
COPY --chown=node:node --from=base /app/node_modules/ node_modules
COPY --chown=node:node --from=base /app/dist/ dist

COPY --from=khw46367.live.dynatrace.com/linux/oneagent-codemodules:nodejs / /
ENV LD_PRELOAD /opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

ENV NODE_ENV "production"
ENV PORT 3000

EXPOSE $PORT
USER node
CMD ["npm", "start"]
