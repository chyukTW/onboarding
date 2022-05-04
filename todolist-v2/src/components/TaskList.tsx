import { useQuery } from "@apollo/client";
import { GET_TASKS } from "../graphql/tasks/query";

import { Task } from "../types/task";
import TaskItem from "./TaskItem";

const TaskList = () => {
  const { loading, error, data } = useQuery(GET_TASKS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-only"
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Something happend :(</p>
  
  const tasks = data.getTasks;

  return (
    <>
    {/* <button type='button' onClick={()=> refetch()}>refetch!</button> */}
    <ul>
      {
        tasks && tasks.map((task: Task) => {
          return <TaskItem key={task.id} task={task} />
        })
      }
    </ul>
    </>
  )
};

export default TaskList;