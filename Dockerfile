FROM node:23.0.0@sha256:e643c0b70dca9704dff42e12b17f5b719dbe4f95e6392fc2dfa0c5f02ea8044d as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:23.0.0@sha256:e643c0b70dca9704dff42e12b17f5b719dbe4f95e6392fc2dfa0c5f02ea8044d as release
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
