## Server

The server application exposes a GraphQL API using Express and Apollo packages.

## Prerequisites

A MongoDB database must be provisioned. This database will store the data consumed by the API.

- Setup a free tier cluster in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Create a Database named **tinyhouse-main** containing a single collection named **test-listings**.

## Installation

Run the intall command: `npm install`.

Create a _.env_ file in the root directory and add the following environment variables to it:

```
PORT=9000
DB_USER=YOUR_DB_USER
DB_USER_PWD=YOUR_DB_USER_PASSWORD
DB_CLUSTER=YOUR_DB_CLUSTER
```

Seed sample data into the database: `npm run seed`.

Start the application: `npm start`.

Open a browser an go to [http://localhost:9000/api](http://localhost:9000/api) to access the API Playground.
