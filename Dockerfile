FROM node:23.6.1@sha256:3b73c4b366d490f76908dda253bb4516bbb3398948fd880d8682c5ef16427eca as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:23.6.1@sha256:3b73c4b366d490f76908dda253bb4516bbb3398948fd880d8682c5ef16427eca as release
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
