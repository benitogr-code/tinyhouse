## Server

The server application exposes a GraphQL API using Express and Apollo packages.

## Prerequisites

A MongoDB database must be provisioned. This database will store the data consumed by the API.

- Setup a free tier cluster in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Create a Database named **tinyhouse-main** containing a single collection named **test-listings**.

OAuth client credentials from Google to authenticate applications users using Google.

- Go to https://console.developers.google.com and create a new project.
- Add [OAuth](https://developers.google.com/identity/protocols/oauth2/scopes) client credentials for a web application. Add both the client ID and secret to your .env file.
- Enable [People API](https://developers.google.com/people/api/rest/v1/people/get).

Google Geocoding API

- This API must be enabled at https://console.developers.google.com.
- An application key must be created and added to the .env file.

Stripe Payments

- Create a test account at https://dashboard.stripe.com.
- Enable 'Connect' service and get the provided test public/ secret keys which will be used in the .env config file.

## Installation

Run the intall command: `npm install`.

Create a _.env_ file in the root directory and add the following environment variables to it:

```
NODE_ENV=development
PORT=9000
DB_USER=xxx
DB_USER_PWD=xxx
DB_CLUSTER=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_GEOCODING_API_KEY=xxx
APP_PUBLIC_URL=http://xxxxxx.com
APP_SECRET=xxx
STRIPE_SECRET=xxx
```

Seed sample data into the database: `npm run seed`.

Start the application: `npm start`.

Open a browser an go to [http://localhost:9000/api](http://localhost:9000/api) to access the API Playground.
