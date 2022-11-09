import TabProvider from "./TabProvider";
import Tabs from "./Tabs";
import Tab from "./Tab";

const HistoryTab = ({tabs}) => {
  return (
    <TabProvider tabTitles={Object.keys(tabs)}>
      <Tabs>
        {Object.entries(tabs).map(([title, element])=> (<Tab title={title} element={element} />))}
      </Tabs>
    </TabProvider>
  )
}

export default HistoryTab;
