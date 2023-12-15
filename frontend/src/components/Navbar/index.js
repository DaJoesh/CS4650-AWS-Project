import { Nav, NavMenu, NavBtn, NavBtnLink, NavLink } from "./NavbarElements"; // Import custom styled components
import { useContext } from "react";
import { AuthContext } from "../../App";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    navigate("/about");
  };

  return (
    <Nav>
      <div className="logo">
        <h1>Logo</h1>
      </div>
      <NavMenu>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact Us</NavLink>
        {isLoggedIn && <NavLink to="/predictor">Stock Predictor</NavLink>}
      </NavMenu>
      <NavBtn>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <NavBtnLink to="/login">Login</NavBtnLink>
        )}
      </NavBtn>
    </Nav>
  );
};

export default Navbar;
