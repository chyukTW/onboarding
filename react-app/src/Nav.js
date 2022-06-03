import { NavLink} from 'react-router-dom';

function Nav() {
  const activeStyle = { color: 'blue', fontWeight: 600 };

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="scroll" style={({isActive}) => isActive ? activeStyle : undefined}>Scroll</NavLink>
        </li>
        <li>
          <NavLink to="input" style={({isActive}) => isActive ? activeStyle : undefined}>Input</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
