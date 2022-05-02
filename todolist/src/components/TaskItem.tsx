import { deleteTask, Task } from "../apollo/stores/tasks";

type Props = {
  task: Task;
};

const TaskItem = ({task}: Props) => {
  const handleClickDeleteButton = () => {
     deleteTask(task.id);
  };

  return (
    <li>
      <span>{task.text}</span>
      <button type="button" onClick={handleClickDeleteButton}>❌</button>
    </li>
  );
};

export default TaskItem;