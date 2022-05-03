# Todolist with reactive variables

## Local State 관리하기

### 방법 1: useQuery


```jsx

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

useQuery가 사용할 쿼리는


```jsx

// ../graphql/tasks/query.ts

import { gql } from '@apollo/client';

export const GET_TASKS = gql`
	query GetTasks {
    getTasks @client
  }
`;

```

cache에서 typePolicy 설정 - 추후 내용 보강

```jsx

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

export default client;

```

반응 변수 생성 - 추후 내용 보강

```jsx
import { makeVar } from '@apollo/client';

export type Task = {
  id: number;
  text: string;
}

const taskIndexRefVar = makeVar(0);

const tasksVar = makeVar<Task[]>([]);

export const addTask = (task: string) => {
  const prevId = taskIndexRefVar();
  const prevTasks = tasksVar();
  
  tasksVar([
    ...prevTasks,
    {
      id: prevId + 1,
      text: task
    }
  ]);
  taskIndexRefVar(prevId + 1);
};

export const deleteTask = (id: number) => {
  const prevTasks = tasksVar();
  const targetIndex = prevTasks.findIndex(task => task.id === id);
  
  if(targetIndex === -1) return;

  tasksVar([
    ...prevTasks.slice(0, targetIndex),
    ...prevTasks.slice(targetIndex + 1)
  ])
};

export default tasksVar;
```

### 방법 2: useReactiveVar

- cache에서 typePolicies 건드릴 필요 없음
- query 작성할 필요 없음
- useReactiveVar hook으로 반응 변수에 바로 접근

```jsx
import { useReactiveVar } from "@apollo/client";
import tasksVar, { Task } from "../apollo/stores/tasks";
import { GET_TASKS } from "../graphql/tasks/query";

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
