import { useMutation } from "@apollo/client";
import { Task } from "../apollo/stores/tasks";
import { DELETE_TASK } from "../graphql/tasks/mutation";
import { GET_TASKS } from "../graphql/tasks/query";

type Props = {
  task: Task;
};

const TaskItem = ({task}: Props) => {
  const [deleteTask, { loading, error }] = useMutation(DELETE_TASK, {
    refetchQueries: [
      GET_TASKS,
      'GetTasks'
    ],
  });

  if (loading) console.log('Submitting...');
  if (error) console.log(`Submission error! ${error.message}`);

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