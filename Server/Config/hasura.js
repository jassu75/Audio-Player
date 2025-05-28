import { GraphQLClient } from "graphql-request";
import dotenv from "dotenv";

dotenv.config();

const client = new GraphQLClient(process.env.URL, {
  headers: {
    "x-hasura-admin-secret": process.env.SECRET_KEY,
  },
});

export default client;
