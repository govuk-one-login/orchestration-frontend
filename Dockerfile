FROM node:22.8.0@sha256:a1fcea4bebb41b8fb6fbea3ec8f0e1f044837f4dbbb84bf32f517b20297513ca as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:22.8.0@sha256:a1fcea4bebb41b8fb6fbea3ec8f0e1f044837f4dbbb84bf32f517b20297513ca as release
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
