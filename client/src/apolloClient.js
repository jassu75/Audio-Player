import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://tejas-music-app.hasura.app/v1/graphql",
  cache: new InMemoryCache(),
  headers: {
    "x-hasura-admin-secret":
      "oPbRqhKEssp8d2VLW0TwszphCqTF3t7IemCHY4W5mBfaf0kxioEM2UArfi29vrH9",
  },
});

export default client;
