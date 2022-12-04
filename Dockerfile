FROM node:16 as builder
WORKDIR /workspace
COPY . .
RUN npm install


FROM node:16-alpine
WORKDIR /workspace
COPY --from=builder /workspace .
RUN apk --update add git
# find local docker image ip  docker inspect mongo | grep IPAddress
# docker compose will set this env variable
# ENV MONGODB_URI="mongodb://172.17.0.2:27017/reactapp"
CMD npm start
EXPOSE 4000