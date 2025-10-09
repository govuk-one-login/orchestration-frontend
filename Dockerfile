FROM node:24.10.0@sha256:377f1c17906eb5a145c34000247faa486bece16386b77eedd5a236335025c2ef as base
WORKDIR /app
COPY . ./
RUN npm install 
RUN npm run build

FROM node:24.10.0@sha256:377f1c17906eb5a145c34000247faa486bece16386b77eedd5a236335025c2ef as release
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
