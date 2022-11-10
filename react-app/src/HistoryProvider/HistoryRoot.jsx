import { createContext, useEffect, useState } from "react";
import styled from 'styled-components'

export const HistoryContext = createContext({
  title: '',
  changeContent: () => undefined,
})

const HistoryRoot = ({ children, titles }) => {
  const initialContent = titles[0];
  const {location: {pathname}, history: {state}} = window;
  const [content, setContent] = useState(state?.title ?? initialContent);

  const changeContent = (title) => {
    window.history.pushState({ title }, '', pathname);
    
    setContent(title);
  };

  useEffect(() => {
    const handleOnpopstate = (event) => {
      setContent(event.state?.title ?? initialContent);
    };

    window.addEventListener("popstate", handleOnpopstate);

    return () => {
      window.removeEventListener("popstate", handleOnpopstate);
    };
  }, []);

  return (
    <HistoryContext.Provider value={{ title: content, changeContent }}>
      <Header>
        {titles.map((title, i)=> 
          (<li key={i} onClick={(e) => changeContent(e.target.innerText)}>{title}</li>)
        )}
      </Header>
      {children}
    </HistoryContext.Provider>
  )
}

export default HistoryRoot;

const Header = styled.ul`
  display: flex;
  align-items: center;
  background-color: tomato;
  height: 60px;
  padding-left: 10px;
  margin-bottom: 10px;
  
  & > li + li {
    margin-left: 30px;
  }

  li {
    font-size: 32px;
    color: white;
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer;
  }
`