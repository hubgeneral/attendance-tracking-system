import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { getGraphQLEndpoint } from "../config/env";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: getGraphQLEndpoint(),
  }),
  cache: new InMemoryCache(),
});
