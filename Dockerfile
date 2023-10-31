FROM node:20.9 as base
WORKDIR /app
COPY package-lock.json ./
COPY package.json ./
COPY tsconfig.json ./
COPY ./src ./src
RUN npm install 
RUN npm run build

FROM node:20.9 as release
WORKDIR /app
COPY --from=base /app/node_modules/ node_modules
COPY --from=base /app/dist/ dist

ENV NODE_ENV "production"
ENV PORT 3000

EXPOSE $PORT
USER node
CMD ["npm", "start"]
