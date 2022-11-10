import HistoryProvider from "../HistoryProvider";
import A from "./A";
import B from "./B";
import C from "./C";
import D from "./D";

const TABS = {
  'A': <A/>,
  'B': <B/>,
  'C': <C/>,
  'D': <D/>,
};

const Statistics = () => {
  return <HistoryProvider contents={TABS}/>
}

export default Statistics;
