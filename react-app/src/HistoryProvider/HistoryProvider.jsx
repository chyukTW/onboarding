import HistoryRoot from "./HistoryRoot";
import Contents from "./Contents";
import Content from "./Content";

const HistoryProvider = ({ contents, hasTab }) => {
  return (
    <HistoryRoot hasTab={hasTab}>
      <Contents>
        {Object.entries(contents).map(([title, element], i)=> (<Content key={i} title={title} element={element} />))}
      </Contents>
    </HistoryRoot>
  )
}

export default HistoryProvider;
