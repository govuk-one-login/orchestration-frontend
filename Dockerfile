FROM node:24.0.0@sha256:9a78ad78ae3eb85137fb6e6b03906b5bb65a7ac764f96ded0610c2ab516d8ccc as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:24.0.0@sha256:9a78ad78ae3eb85137fb6e6b03906b5bb65a7ac764f96ded0610c2ab516d8ccc as release
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
