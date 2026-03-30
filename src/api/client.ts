import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { HttpLink } from "@apollo/client/link/http";

const httpLink = new HttpLink({
  uri: "/graphql",
  credentials: "include",
});

const authLink = new SetContextLink((prevContext, _operation) => {
  const token = localStorage.getItem("jwt_token");
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
