FROM node:25.2.1@sha256:3d7ea598252b440ed9cc212ada859811f8a8c195ce38f39aad3c045f7c67dce8 as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:25.2.1@sha256:3d7ea598252b440ed9cc212ada859811f8a8c195ce38f39aad3c045f7c67dce8 as release
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
