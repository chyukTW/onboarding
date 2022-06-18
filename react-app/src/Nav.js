import { NavLink} from 'react-router-dom';
import styled from 'styled-components';

const Navigations = styled.nav`
  height: 24px;
  background-color: black;
  & > ul {
    display: flex;
    padding: 0 5px;
    height: 100%;
    align-items: center;
    & > li {
      color: white;
      & + li {
        margin-left: .5em;
      }
      & > a {
        font-size: 16px;
        font-family: Arial, Helvetica, sans-serif;
        text-decoration: none;
        color: white;
      }
    }
  }
`;

function Nav() {
  const activeStyle = { fontWeight: 800 };

  return (
    <Navigations>
      <ul>
        <li>
          <NavLink to="scroll" style={({isActive}) => isActive ? activeStyle : undefined}>Scroll</NavLink>
        </li>
        <li>
          <NavLink to="input" style={({isActive}) => isActive ? activeStyle : undefined}>Input</NavLink>
        </li>
        <li>
          <NavLink to="intersection" style={({isActive}) => isActive ? activeStyle : undefined}>I/O</NavLink>
        </li>
      </ul>
    </Navigations>
  );
}

export default Nav;
