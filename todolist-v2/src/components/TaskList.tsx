import { useQuery } from "@apollo/client";
import { GET_TASKS } from "../graphql/tasks/query";
import { GET_USERS } from "../graphql/users/query";

import { Task } from "../types/task";
import TaskItem from "./TaskItem";

const TaskList = () => {
  const { loading, error, data } = useQuery(GET_TASKS);

  const { data: users } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Something happend :(</p>

  if (users) console.log(users);
  
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