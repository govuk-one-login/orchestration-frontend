FROM node:22.5.1@sha256:4c9ea09651a4939e37b15a4953d9ff8b5a038cfa949c77bb291b792d273b7239 as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:22.5.1@sha256:4c9ea09651a4939e37b15a4953d9ff8b5a038cfa949c77bb291b792d273b7239 as release
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
