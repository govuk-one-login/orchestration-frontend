FROM node:24.0.1@sha256:222f704ce7f499c7bd7d101c993b980d86393e87bb54d416bcfcfe8e62aa9f64 as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:24.0.1@sha256:222f704ce7f499c7bd7d101c993b980d86393e87bb54d416bcfcfe8e62aa9f64 as release
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
