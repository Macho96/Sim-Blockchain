import { faAt, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ILogin from '../types/login.type';
import userService from '../services/user.service';
import { useState } from 'react';
import { useNavigate } from "react-router";
import "../css/login.css";
import * as msg from '../common/messages';
import * as alerts from "../common/alerts";
const Login = () => {
  var uLogin: ILogin = { Email: '', Password: '' };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const logear = () => {

    if (email === "" || password === "" || email === " " || password === " ") {
      //alert
      alerts.alert(msg.REQUIRE_FIELD, msg.REQUIRE, msg.ICON_WARNING);
    } else {
      uLogin.Email = email;
      uLogin.Password = password;
      alerts.loading();
      userService.login(uLogin)
        .then((response: any) => {
          // setResult(response);
          let res = response.data;
          if (res.msg === "contraseña incorrecta") {
            //alert
            setTimeout(() => { alerts.alert(msg.WRONG_PASSWORD, msg.LOGIN_INCORRECT, msg.ICON_ERROR) }, 1000);


          } else if (res.msg === "usuario no existe") {
            //alert
            setTimeout(() => { alerts.alert(msg.WRONG_USER, msg.LOGIN_INCORRECT, msg.ICON_ERROR); }, 1000);

          } else {
            //console.log(result);
            setTimeout(() => { alerts.alert('Bienvenido', '', msg.ICON_SUCCESS) }, 1000);

            uLogin.Email = "";
            uLogin.Password = "";
            localStorage.setItem("user", JSON.stringify(res)); //login
            //  const userStr = localStorage.getItem("user"); JSON.parse(userStr); consume localstorage
            // localStorage.removeItem("user"); logout

            setTimeout(() => { window.location.reload() }, 0);
            navigate('/home')


            //

          }

        })
        .catch((e: Error) => {
          console.log(e);
        });
    }
  }
  return (
    <div >
      <div className="container">

        <div className="wrapper">
          <div className="title"><span>Login</span></div>
          <div className="form1">
            {/* email*/}

            <div className="row">
              <i>
                <FontAwesomeIcon icon={faAt} />
              </i>
              <input id="Email" name="Email" type="email" placeholder="jhondoe@gmail.com"
                value={email} onChange={e => setEmail(e.target.value.toLowerCase())} required />
            </div>

            {/* password*/}

            <div className="row">
              <i>
                <FontAwesomeIcon icon={faKey} />
              </i>
              <input id="Password" name="Password" type="password" placeholder="*******" value={password}
                onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="col-md-12 text-center">
              <button type="submit" className="button" onClick={logear}>iniciar</button>
            </div>
            <div className="signup-link">Not a member? <a href="/registro">Signup now</a></div>
          </div>
        </div>
      </div>
    </div >
  );

}
export default Login;