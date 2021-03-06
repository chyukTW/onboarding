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

## Query  
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

캐시에 있는 Root Query를 살펴보면, '__typename: id'의 모양으로 정규화된 task를 참조하고 있는 것을 확인할 수 있다.
그런데 user data의 경우 애초에 id를 생성해주지 않았기 때문에 참조되지 않은 상태로 그대로 들어간 모양이다.  
![image](https://user-images.githubusercontent.com/103919739/167068399-d44d63de-1332-47ab-94c8-ab8e6db57c28.png)  

key fields API를 통해 어떤 속성을 유니크한 값으로 취급해 줄지 커스텀할 수 있다. typePolicy 옵션에서 정해주면 된다.

```jsx
const cache = new InMemoryCache({
  typePolicies: {
    // ...
    User: {
      keyFields: ['name']
    }
  },
});
```
이렇게 name 속성을 유니크한 값으로 취급해 준다면,  
![스크린샷 2022-05-06 오후 1 37 33](https://user-images.githubusercontent.com/103919739/167068858-0997db62-4155-4af2-813e-4774d3a17534.png)  
normalization된 모양으로 참조되고 있다.
<br />

## Mutation  
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

## Local-only fields  
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
<br/>


## Subscription  
<br/>

### 아폴로 클라이언트에 웹소켓 연결
<br/>

graphql-ws 설치
> yarn add graphql-ws
<br/>

```jsx
// src/apollo/client.ts
// ...

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql', // 백엔드에서 미리 만들어 준 엔드포인트
}));

// ...
```
<br/>

모든 오퍼레이션 타입이 GraphQLWsLink을 사용할 수 있지만,
쿼리나 뮤테이션은 HTTP를 이용하는 것이 효율적임
<br>

httpLink도 생성
``` jsx
// src/apollo/client.ts
// ...

import { HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

// ...
```
<br/>


split 메서드로 subscription이 아닐 때는 httpLink를 사용하도록 설정
```jsx
// src/apollo/client.ts
// ...

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// ...
```
<br/>


클라이언트 uri에 splitLink 연결
```jsx
// src/apollo/client.ts
// ...

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

// ...
```
<br/>


이제 구독을 위한 쿼리문(?)을 작성해주고

```jsx

export const WORD_SUBSCRIPTION = gql`
  subscription {
    randomWord 
  }
`;

```
<br/>


Word 컴포넌트에서 랜덤 단어를 받기 위한 구독 요청 
useSubscription hook을 사용

```jsx
import { useSubscription } from "@apollo/client";
import { WORD_SUBSCRIPTION } from "../graphql/words/subscription";

const Word = () => {
  const { data, loading } = useSubscription(WORD_SUBSCRIPTION);

  // console.log(data);

  return (
    <div>Random Word: {!loading && data?.randomWord}</div>
  )
};

export default Word;
```
<br/>

![image](https://user-images.githubusercontent.com/103919739/166884001-c26aa136-1be2-4262-85c1-a513a3919eb8.png)  
콘솔을 찍어보면 1초마다 내뱉는 단어를 확인할 수 있음

* 컴포넌트가 언마운트되면 자동으로 unsubscribe 됨  

unsubscribe가 잘 되는지 확인해보기
토글 버튼을 만들어주고,

```tsx

import { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Word from "./components/Word";

function App() {
  const [ toggle, setToggle ] = useState(false);

  const handleClickToggleButton = () => {
    setToggle(prev => !prev);
  }

  return (
    <>
      <TaskForm />
      <TaskList />
      <button type="button" onClick={handleClickToggleButton}>{toggle ? 'unsubscribe' : 'subscribe'} word</button>
      {toggle && <Word />}
    </>
  );
}

export default App;
```
<br />

버튼 클릭하면 subscribe/unsubscribe를 하도록 구현  
![image](https://user-images.githubusercontent.com/103919739/167245078-c47343e1-93ae-4872-916d-4ba196d401ed.png)  
<br />


버튼을 클릭하고 개발자 도구를 확인해보면,  
![image](https://user-images.githubusercontent.com/103919739/167245241-b187d1f9-f3c3-4dce-9902-e6fdc8155747.png)  <br />

HTTP 프로토콜 상에서 먼저 handshaking이 진행되고 message tab을 확인하면,
![스크린샷 2022-05-07 오후 4 43 37](https://user-images.githubusercontent.com/103919739/167245162-9ff33d7a-8e8d-4ce2-8679-dee2bf3fd2cb.png)  

1. {"type": "connection_init"}과 {"type": "connection_ack"}라는 데이터를 주고 받고,
2. subscription query가 포함된 payload가 전송된 후, (type은 subscribe)
3. 서버 측에서 정의된 resolver에 따라 데이터가 전송되는 것을 확인할 수 있다 (type은 next)
<br />

버튼을 한번 더 누르면,complete type이 포함된 데이터를 마지막으로 받고 unsubscribe된다.  
![스크린샷 2022-05-07 오후 4 57 11](https://user-images.githubusercontent.com/103919739/167245536-6bbd1e3b-f044-4e80-ae36-c01551dbf6a5.png)  
<br />




