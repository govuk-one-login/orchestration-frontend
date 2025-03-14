FROM node:23.10.0@sha256:e940261391ab78a883bbcfba448bcbb6d36803053f67017e6e270ef095f213ca as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:23.10.0@sha256:e940261391ab78a883bbcfba448bcbb6d36803053f67017e6e270ef095f213ca as release
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
