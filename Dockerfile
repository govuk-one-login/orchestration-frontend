FROM node:22.7.0@sha256:329e65250d507539bfdd909582937c8418ae4614c09677ce971d845951b25b1f as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:22.7.0@sha256:329e65250d507539bfdd909582937c8418ae4614c09677ce971d845951b25b1f as release
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
