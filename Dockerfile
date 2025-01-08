FROM node:23.6.0@sha256:2f73096d856b0b9d6fa43002edb619f1527f939bab870eab6c909f633bcf56e9 as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:23.6.0@sha256:2f73096d856b0b9d6fa43002edb619f1527f939bab870eab6c909f633bcf56e9 as release
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
