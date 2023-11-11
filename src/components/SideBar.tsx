import { NavLink } from "react-router-dom";
import "./style/SideBar.css";

export const SideBar = () => {
  return (
    <div className="side-bar">
      <p id="system-name">
        自由部屋<br></br>予約システム
      </p>
      <NavLink
        to={`/`}
        className={({ isActive }) =>
          isActive ? "active-link" : "inactive-link"
        }
      >
        <p>All Room</p>
      </NavLink>
      <NavLink
        to={`/f601Dashboard`}
        className={({ isActive }) =>
          isActive ? "active-link" : "inactive-link"
        }
      >
        <p>F601</p>
      </NavLink>
      <NavLink
        to={`/f602Dashboard`}
        className={({ isActive }) =>
          isActive ? "active-link" : "inactive-link"
        }
      >
        <p>F602</p>
      </NavLink>
      <NavLink
        to={`/f612Dashboard`}
        className={({ isActive }) =>
          isActive ? "active-link" : "inactive-link"
        }
      >
        <p>F612</p>
      </NavLink>
    </div>
  );
};
