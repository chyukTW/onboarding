import { useReactiveVar } from "@apollo/client";
import tasksVar from "../apollo/stores/tasks";

import TaskItem from "./TaskItem";

const TaskList = () => {
  const tasks = useReactiveVar(tasksVar);

  return (
    <ul>
      {
        tasks && tasks.map((task) => {
          return <TaskItem key={task.id} task={task} />
        })
      }
    </ul>
  )
};

export default TaskList;