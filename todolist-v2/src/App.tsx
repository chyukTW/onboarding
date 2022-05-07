import { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Word from "./components/Word";

function App() {
  const [ toggle, setToggle ] = useState(false);

  const handleClickToggleButton = () => {
    setToggle(prev => !prev);
  }

  return (
    <>
      <TaskForm />
      <TaskList />
      <button type="button" onClick={handleClickToggleButton}>{toggle ? 'unsubscribe' : 'subscribe'} word</button>
      {toggle && <Word />}
    </>
  );
}

export default App;
