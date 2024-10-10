FROM bitnami/node

WORKDIR /app

# Copy in package json files so that docker generates
# a cached layer, this speeds up the build process
COPY package*.json /app/
RUN npm install

COPY . .

CMD ["npm", "start"]
EXPOSE 3000