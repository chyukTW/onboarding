import HistoryRoot from "./HistoryRoot";
import Contents from "./Contents";
import Content from "./Content";

const HistoryProvider = ({contents}) => {
  return (
    <HistoryRoot titles={Object.keys(contents)}>
      <Contents>
        {Object.entries(contents).map(([title, element], i)=> (<Content key={i} title={title} element={element} />))}
      </Contents>
    </HistoryRoot>
  )
}

export default HistoryProvider;
