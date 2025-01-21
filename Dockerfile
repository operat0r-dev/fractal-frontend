FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn global add serve
RUN yarn install
COPY . ./
EXPOSE 5173
CMD ["yarn", "dev", "--", "--host"]