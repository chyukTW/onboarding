import React, { useContext, Children, useRef } from "react";
import { HistoryContext } from "./HistoryRoot";

const Contents = ({ children }) => {
  const { title } = useContext(HistoryContext);
  const content = useRef(null)

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

    if (child.props.title !== title) {
      return;
    }

    content.current = child.props.element;
  });
  
  return content.current;
};

export default Contents;