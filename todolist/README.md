# Todolist with reactive variables

## Reactive variables 활용하기

### useQuery와 로컬 전용 필드를 활용한 예제

반응 변수 만들기

makeVar 메서드로 반응 변수 생성 (인자로 초기값을 전달할 수 있음)

```jsx
// src/apollo/stores/tasks.ts

import { makeVar } from '@apollo/client';

export type Task = {
  id: number;
  text: string;
}

const taskIndexRefVar = makeVar(0);

const tasksVar = makeVar<Task[]>([]);

export default tasksVar;
```

로컬 전용 필드 정의  

```jsx
// src/graphql/tasks/query.ts

import { gql } from '@apollo/client';

export const GET_TASKS = gql`
	query GetTasks {
    getTasks @client
  }
`;

```

필드 정책 커스텀
: getTasks 필드가 요청되면, 반응 변수 tasksVar를 리턴

```jsx
// src/apollo/client.ts

import { ApolloClient, InMemoryCache } from "@apollo/client";
import tasksVar from "./stores/tasks";

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

const client = new ApolloClient({
  cache,
});

```

useQuery로 요청

```jsx

// src/components/TaskList.tsx

import { useQuery } from "@apollo/client";
import { Task } from "../apollo/stores/tasks";
import { GET_TASKS } from "../graphql/tasks/query";

import TaskItem from "./TaskItem";

const TaskList = () => {
  const { data } = useQuery(GET_TASKS);
  
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

- 필드가 반응 변수에 의존하고 있을 때 반응 변수가 변경되면 해당 필드를 포함하는 쿼리가 자동으로 refresh
- refetch할 필요 없이 로컬 상태가 자동으로 반영됨


### useReactiveVar를 활용한 예제

- useReactiveVar Hook을 이용하면 쿼리를 날릴 필요 없이 반응 변수에 바로 접근 가능
- useQuery, local only field를 이용하는 방법보다 훨씬 간편함

```jsx
// src/components/TaskList.tsx

import { useReactiveVar } from "@apollo/client";
import tasksVar, { Task } from "../apollo/stores/tasks";

import TaskItem from "./TaskItem";

const TaskList = () => {
  const tasks = useReactiveVar(tasksVar);

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