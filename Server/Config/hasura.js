import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(process.env.URL, {
  headers: {
    "x-hasura-admin-secret": process.env.SECRET_KEY,
  },
});

export default client;
