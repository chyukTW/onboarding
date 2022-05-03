import { useQuery, useReactiveVar } from "@apollo/client";
import tasksVar, { Task } from "../apollo/stores/tasks";
import { GET_TASKS } from "../graphql/tasks/query";

import TaskItem from "./TaskItem";

const TaskList = () => {
  // 방법 1. useReactiveVar 사용하기
  // const tasks = useReactiveVar(tasksVar);

  // 방법 2. useQuery 사용하기,
  // useQuery를 사용하면 query 및 InMemoryCache > typePolicies 작성해줘야 함
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