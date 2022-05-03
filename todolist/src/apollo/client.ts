import { ApolloClient, InMemoryCache } from "@apollo/client";
import { LocalStorageWrapper, persistCache } from "apollo3-cache-persist";
import tasksVar from "./stores/tasks";

// 방법 1. useReactiveVar 사용하는 경우
// const cache = new InMemoryCache({});


// 방법 2. useQuery 사용하는 경우
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getTasks: {
          read() {
            return tasksVar();
          },
        },
      },  
    },
  },
});

// await persistCache({
//   cache,
//   storage: new LocalStorageWrapper(window.localStorage),
// });

const client = new ApolloClient({
  cache,
});

export default client;