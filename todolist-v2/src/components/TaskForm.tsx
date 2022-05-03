import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { ADD_TASK } from "../graphql/tasks/mutation";
import { GET_TASKS } from "../graphql/tasks/query";

const TaskForm = () => {
  const [taskValue, setTaskValue] = useState('');
  const [ addTask ] = useMutation(ADD_TASK, {
    refetchQueries: [
      GET_TASKS,
      'GetTasks'
    ]
  })

  const handleSubmitTodoForm = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({ variables: { text: taskValue }});
    setTaskValue('');
  }

  const handleChangeTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmitTodoForm}>
      <input type="text" onChange={handleChangeTodoInput} value={taskValue} />
      <button type="submit">submit</button>
    </form>
  )
};

export default TaskForm;