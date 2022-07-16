#Build React
FROM node:12.18.3

LABEL version="1.0"
LABEL maintainer = ["jeremy.castroe@alumnos.uv.cl"]

WORKDIR /src

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

EXPOSE 80

CMD ["npm", "start"]