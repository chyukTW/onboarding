import React, { useState } from "react";
import { addTask } from "../apollo/stores/tasks";

const TaskForm = () => {
  const [taskValue, setTaskValue] = useState('');

  const handleSubmitTodoForm = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(taskValue);
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