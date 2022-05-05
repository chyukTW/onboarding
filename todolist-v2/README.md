# Todolist with GraphQL Server
<br/>

## 기본 형태  
<br/>
아폴로 클라이언트와 graphQL서버 연동하기

```jsx
// src/apollo/client.ts

import { ApolloClient, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache,
});

```
<br/>
클라이언트를 리액트에 연결하기

```jsx
// src/index.tsx

import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

```
<br/>

## 쿼리  
<br/>
useQuery로 쿼리 날리기
: useQuery는 컴포넌트가 마운팅될 때 호출된다.

```jsx
// src/components/TaskList.tsx

import { useQuery } from "@apollo/client";
import { GET_TASKS } from "../graphql/tasks/query";

import { Task } from "../types/task";
import TaskItem from "./TaskItem";

const TaskList = () => {
  const { loading, error, data } = useQuery(GET_TASKS);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Something happend :(</p>
  
  const tasks = data.getTasks;

  return (
    <ul>
      {
        tasks && tasks.map((task: Task) => {
          return <TaskItem key={task.id} task={task} />
        })
      }
    </ul>
  )
};

export default TaskList;

```
<br/>

요청에 사용된 쿼리는 이렇게 생겼음
```jsx
// src/graphql/query.ts

import {gql} from '@apollo/client';

export const GET_TASKS = gql`
	query GetTasks {
    getTasks {
      id
      text
      updatedAt
    }
  }
`;

```
<br/>

useQuery를 기본적으로 요청된 모든 데이터가 캐시에 있으면 해당 데이터를 반환시키고, 만약 캐시 데이터가 없다면 서버로 요청을 보내는 'cache-first' 정책을 취함
반대로 캐시를 확인하지 않고 네트워크 요청을 보내는 'network-only' 등 여러 fetch policy가 있음
<br/>

[🔗 Supported fetch policies](https://www.apollographql.com/docs/react/data/queries#supported-fetch-policies)
<br/>

nextFetchPolicy까지 사용한 예:
```jsx

const { loading, error, data } = useQuery(GET_TASKS, {
  fetchPolicy: "network-only",   // Used for first execution
  nextFetchPolicy: "cache-first" // Used for subsequent executions
});

```
<br/>

Apollo Client Devtools에서 캐시를 확인할 수 있다.  
![스크린샷 2022-05-05 오전 11 18 50](https://user-images.githubusercontent.com/103919739/166856463-62bc7c92-ae1b-4a79-b4c5-5968af034ce5.png)  
캐시는 __typename와 id가 조합된 형태로 정규화되어 저장된다.
<br/>
<br/>

만약 no-cache라면,  
```jsx
const { loading, error, data } = useQuery(GET_TASKS, {
  fetchPolicy: "no-cache"
});
```
저장된 캐시가 없다.  
![스크린샷 2022-05-05 오전 11 18 33](https://user-images.githubusercontent.com/103919739/166855765-3b4eb31e-94af-40d6-8596-4c15aecdd299.png)  
<br/>

## 뮤테이션  
<br/>  

useMutation으로 뮤테이션 요청
```jsx
// src/components/TaskItem.tsx
import { useMutation } from "@apollo/client";
import { DELETE_TASK } from "../graphql/tasks/mutation";
import { GET_TASKS } from "../graphql/tasks/query";
import { Task } from "../types/task";

type Props = {
  task: Task;
};

const TaskItem = ({task}: Props) => {
  const [ deleteTask ] = useMutation(DELETE_TASK);

  const handleClickDeleteButton = () => {
    deleteTask({ variables: {id: task.id}});
  };
  
  return (
    <li>
      <span>{task.text}</span>
      <button type="button" onClick={handleClickDeleteButton}>❌</button>
    </li>
  );
};

export default TaskItem;
```
<br/>

refetchQueries 옵션을 사용하면 뮤테이션 후에 특정 쿼리를 refetch할 수 있음
```jsx
  
  // ...

  const [ deleteTask ] = useMutation(DELETE_TASK, {
    refetchQueries: [
      GET_TASKS,
      'GetTasks'
    ],
  });

  // ...

```
<br/>

## 로컬 전용 필드  
<br/>

서버에 정의되지 않은 로컬 전용 필드를 정의할 수 있음  
<br/>

@client라는 directive를 달아주면 된다.
```jsx
// src/graphql/tasks/query.ts
export const GET_TASKS = gql`
	query GetTasks {
    getTasks {
      id
      text
      updatedAt
      updatedAtString @client
    }
  }
`;
```
- 아폴로 클라이언트는 서버로 요청할 때 로컬 전용 필드를 제외시킴
- 쿼리의 최종 결과는 원격 및 로컬 필드가 모두 채워진 후에 반환됨
<br/>

InMemoryCache 생성자의 typePolicies 옵션에서 필드 정책을 커스텀할 수 있음
(로컬 전용필드가 아니더라도 가능하다.)
```jsx
// src/apollo/client.ts
const cache = new InMemoryCache({
  typePolicies: {
    Task: {
      fields: {
        updatedAtString: {
          read(_, { readField }) {
            const updatedAt = readField('updatedAt') as string;
            const time = new Date(parseInt(updatedAt));
            return `${time.getHours()}시 ${time.getMinutes()}분 ${time.getSeconds()}초`;
          },
        }
      },  
    },
  },
});

```
- read 함수를 갖는 필드를 요청하면 read 함수가 호출된다.
- 다소 억지로 만든 예시지만, 서버로부터 받아온 후 캐싱된 데이터에 readField(fieldname)로 접근 가능
- 로컬 전용 필드가 원하는 형태의 데이터를 반환하도록 활용할 수 있음
```jsx
// ...

  return (
    <li>
      <span>{task.text}</span>
      <button type="button" onClick={handleClickDeleteButton}>❌</button>
      <span> updated at: {task.updatedAtString}</span>
    </li>
  );
};

// ...
```
  
