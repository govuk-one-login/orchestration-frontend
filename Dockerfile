FROM node:24.2.0@sha256:16d3d3862d7442290079b2d073805f7584f466f7e2f69bde164ad5f16b272c67 as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:24.2.0@sha256:16d3d3862d7442290079b2d073805f7584f466f7e2f69bde164ad5f16b272c67 as release
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
