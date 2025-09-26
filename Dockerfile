FROM node:24.9.0@sha256:a2ed436bacdcc9dd543202a327bbce2519c43e3755a41a186f8f51c037ef3342 as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:24.9.0@sha256:a2ed436bacdcc9dd543202a327bbce2519c43e3755a41a186f8f51c037ef3342 as release
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
