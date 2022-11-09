import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components'

export const tabContext = createContext({
  tabTitle: '',
  changeTab: () => undefined,
})

const TabProvider = ({ children, tabTitles }) => {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const [currentTab, setCurrentTab] = useState(state?.tabTitle ?? tabTitles[0]);

  const changeTab = (tabTitle) => {
    navigate(pathname, { state: { tabTitle } });
    setCurrentTab(tabTitle);
  };

  useEffect(() => {
    const handleOnpopstate = (event) => {
      setCurrentTab(event.state?.usr?.tabTitle ?? tabTitles[0]);
    };

    window.addEventListener("popstate", handleOnpopstate);

    return () => {
      window.removeEventListener("popstate", handleOnpopstate);
    };
  }, []);

  return (
    <tabContext.Provider value={{ tabTitle: currentTab, changeTab }}>
      <TabTitles>
        {tabTitles.map((title, i)=> 
          (<li key={i} onClick={(e) => changeTab(e.target.innerText)}>{title}</li>)
        )}
      </TabTitles>
      {children}
    </tabContext.Provider>
  )
}

export default TabProvider;

const TabTitles = styled.ul`
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