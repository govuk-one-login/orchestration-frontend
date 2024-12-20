FROM node:23.5.0@sha256:a569d16e90f2e59da5594793509db37ebfa2d4eb4c5982758fad8f4c79f8ff8f as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:23.5.0@sha256:a569d16e90f2e59da5594793509db37ebfa2d4eb4c5982758fad8f4c79f8ff8f as release
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
