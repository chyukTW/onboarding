import { useContext } from "react";
import { HistoryContext } from "../HistoryProvider/HistoryRoot";

const A = () => {
  const { changeContent } = useContext(HistoryContext);

  return (
    <div>
      <h1>A</h1>
      <button onClick={() => changeContent('B')}>
        change to B
      </button>
      <button onClick={() => changeContent('C')}>
        change to C
      </button>
      <button onClick={() => changeContent('D')}>
        change to D
      </button>
    </div>
  )
}

export default A;