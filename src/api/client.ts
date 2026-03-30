import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { HttpLink } from "@apollo/client/link/http";

// Определяем URL в зависимости от окружения
const getApiUrl = () => {
  // Продакшен (GitHub Pages): используем переменную из .env.production
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || "/graphql";
  }
  // Разработка: относительный путь (работает с Vite proxy)
  return "/graphql";
};

const httpLink = new HttpLink({
  uri: getApiUrl(),
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
