FROM node:23.9.0@sha256:c29271c7f2b4788fe9b90a7506d790dc8f2ff46132e1b70e71bf0c0679c8451c as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:23.9.0@sha256:c29271c7f2b4788fe9b90a7506d790dc8f2ff46132e1b70e71bf0c0679c8451c as release
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
