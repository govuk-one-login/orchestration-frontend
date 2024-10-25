FROM node:23.1.0@sha256:840dad0077213cadd2d734d542ae11cd0f648200be29504eb1b6e2c995d2b75a as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:23.1.0@sha256:840dad0077213cadd2d734d542ae11cd0f648200be29504eb1b6e2c995d2b75a as release
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
