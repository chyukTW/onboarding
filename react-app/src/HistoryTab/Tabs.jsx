import React, { useContext, Children } from "react";
import { tabContext } from "./TabProvider";

const Tabs = ({ children }) => {
  const { tabTitle } = useContext(tabContext);

  let selectedTab = null;

  Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === React.Fragment) {
      return;
    }

    if (!child.props.title || !child.props.element) {
      return;
    }

    if (child.props.title !== tabTitle) {
      return;
    }

    selectedTab = child.props.element;
  });
  
  return selectedTab;
};

export default Tabs;