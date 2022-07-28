import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import '../css/nav.css';
const NavBar = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("user");
    const initialValue = JSON.parse("" + saved);
    if (initialValue != null) {
      setShow(true);
      //window.location.reload()
    }
    return initialValue || "";
  });
  //setTimeout(() => {  setUser(json);console.log(json); }, 100);

  const cerrar = () => {
    if (user != null) {
      localStorage.removeItem("user");
      setUser(null);
      setShow(false);
      setTimeout(() => { window.location.reload() }, 0);
      navigate("login");
    } else {
      console.log("primero inicia sesion");
    }
  }

  return (
    <>
      <nav className="navbar navbar-dark navigation">

        <a href="/" className="navbar-brand brand-name ">
          BlockChain
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            width="32" height="32"
            viewBox="0 0 48 48"
            fill="#000000;"><path fill="#8097a2" d="M20.466,4.464L15.18,9.75l8.833,8.838l8.818-8.828l-5.296-5.296C26.558,3.488,25.279,3,24,3 C22.721,3,21.442,3.488,20.466,4.464z"></path><path fill="#37474f" d="M15.18,9.75L4.464,20.466C3.488,21.442,3,22.721,3,24c0,1.279,0.488,2.558,1.464,3.534l5.309,5.309 l14.24-14.255L15.18,9.75z"></path><path fill="#1565c0" d="M41.569 18.499L32.831 9.76 24.013 18.588 32.687 27.269z"></path><path fill="#90caf9" d="M43.536,20.466l-1.967-1.967l-8.882,8.77l5.555,5.559l5.293-5.293 c0.968-0.968,1.456-2.234,1.464-3.503C45.008,22.742,44.52,21.45,43.536,20.466z"></path><path fill="#03a9f4" d="M9.773,32.843l10.693,10.693C21.442,44.512,22.721,45,24,45c1.279,0,2.558-0.488,3.534-1.464 l10.708-10.708l-14.23-14.24L9.773,32.843z"></path></svg>

        </a>

        <div className="navigation-menu">
          <ul>

            {show ?
              <>
                <li><NavLink className="a" to="/dashboard">Dashboard </NavLink></li>
                <li><NavLink className="a" to="/mined">Mined</NavLink></li>
                <li><NavLink className="a" to="/system">System Configure </NavLink></li>
                <li><button className="btn btn-outline-danger" onClick={cerrar}> log-out
                  <> </>
                  <FontAwesomeIcon icon={faDoorOpen} />
                </button></li>
              </>
              :
              <>
                <li><NavLink className="a" to="/login">Login </NavLink></li>
                <li><a>|</a></li>
                <li><NavLink className="a" to="/registro">Registro </NavLink></li>
              </>
            }







            {/*<li><NavLink className="a"to="/dashboard">Dashboard </NavLink></li>*/}

          </ul>
        </div>


      </nav>
    </>
  );

}
export default NavBar;