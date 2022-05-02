import React, { useState } from "react";

const TaskInputs = () => {
  const [todoValues, setTodoValues] = useState('');

  const handleSubmitTodoForm = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e.target);
  }

  const handleChangeTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoValues(e.target.value);
  };

  return (
    <form onSubmit={handleSubmitTodoForm}>
      <input type="text" onChange={handleChangeTodoInput} value={todoValues} />
      <button type="submit">submit</button>
    </form>
  )
};

export default TaskInputs;