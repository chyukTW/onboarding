import { useMutation } from "@apollo/client";
import { DELETE_TASK, UPDATE_TASK } from "../graphql/tasks/mutation";
import { GET_TASKS } from "../graphql/tasks/query";
import { Task } from "../types/task";

type Props = {
  task: Task;
};

const TaskItem = ({task}: Props) => {
  const [ deleteTask ] = useMutation(DELETE_TASK, {
    refetchQueries: [
      GET_TASKS,
      'GetTasks'
    ],
  });

  const [ updateTask ] = useMutation(UPDATE_TASK, {
    refetchQueries: [
      GET_TASKS,
      'GetTasks'
    ],
  });

  const handleClickDeleteButton = () => {
    deleteTask({ variables: {id: task.id}});
  };

  const handleClickUpdateButton = () => {
    updateTask({ variables: {
      id: task.id,
      text: task.text.toUpperCase(),
    }});
  };
  
  return (
    <li>
      <span>{task.text}</span>
      <button type="button" onClick={handleClickDeleteButton}>❌</button>
      <button type="button" onClick={handleClickUpdateButton}>ToUpperCase</button>
      <span> updated at: {task.updatedAtString}</span>
    </li>
  );
};

export default TaskItem;