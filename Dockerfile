FROM node:23.7.0@sha256:73236efc6d24b792e476251b7bc7b000f45314d0e084dcd6af3d0a54489ad489 as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:23.7.0@sha256:73236efc6d24b792e476251b7bc7b000f45314d0e084dcd6af3d0a54489ad489 as release
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
