import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(process.env.HASURA_URL, {
  headers: {
    "x-hasura-admin-secret": process.env.HASURA_SECRET_KEY,
  },
});

export default client;
