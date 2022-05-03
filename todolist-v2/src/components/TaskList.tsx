import { useQuery } from "@apollo/client";
import { Task } from "../apollo/stores/tasks";
import { GET_TASKS } from "../graphql/tasks/query";

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