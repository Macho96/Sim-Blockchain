import { faAt, faKey, faBirthdayCake, faUser, faContactBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IUser from '../types/users.type';
import userService from '../services/user.service';
import { useState } from 'react';
import { useNavigate } from "react-router";
import "../css/login.css";
import * as msg from '../common/messages';
import * as alerts from "../common/alerts";


const Registro = () => {

  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const formatDate = () => {
    var date = new Date(birthdate);
    var month = date.getMonth() + 1;
    var day = date.getDate() + 1;
    var year = date.getFullYear();
    //setBirthDate(day+"/"+month+"/"+year);
    return day + "/" + month + "/" + year;
  }


  const create = () => {
    if (name === "" || lastname === "" || username === "" || email === "" || birthdate === "" || password === "" || name === " " || lastname === " " || username === " " || email === " " || birthdate === " " || password === " ") {
      alerts.alert(msg.REQUIRE_FIELD, msg.REQUIRE, msg.ICON_WARNING);
    } else {
      var date = formatDate();
      var user: IUser = {
        ID: null,
        Name: name,
        LastName: lastname,
        UserName: username,
        Email: email,
        BirthDate: date,
        Password: password
      };
      alerts.loading();
      userService.create(user)
        .then((response: any) => {
          let res = response.data;
          if (res.msg === "ya existe un usuario con ese correo") {
            alerts.alert(msg.EXISTING_USER, '', msg.ICON_ERROR);
          } else {
            //console.log(res.msg);
            alerts.alert(res.msg, '', msg.ICON_SUCCESS);
            setTimeout(() => { navigate('/login') }, 2500);
            ;
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
          <div className="title"><span>User</span></div>
          <div className="form1">

            {/* name*/}

            <div className="row">
              <i>
                <FontAwesomeIcon icon={faUser} />
              </i>
              <input id="Name" name="Name" type="text" placeholder="Jhon"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>

            {/* lastname*/}

            <div className="row">
              <i>
                <FontAwesomeIcon icon={faUser} />
              </i>
              <input id="LastName" name="LastName" type="text" placeholder="Doe"
                value={lastname} onChange={e => setLastName(e.target.value)} required />
            </div>

            {/* username*/}

            <div className="row">
              <i>
                <FontAwesomeIcon icon={faContactBook} />
              </i>
              <input id="UserName" name="UserName" type="text" placeholder="@Jhonny"
                value={username} onChange={e => setUserName(e.target.value)} required />
            </div>

            {/* birthdate*/}

            <div className="row">
              <i>
                <FontAwesomeIcon icon={faBirthdayCake} />
              </i>
              <input id="BirthDate" name="BirthDate" type="text" placeholder="birthdate" onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => { (e.target.type = "text") }}
                value={birthdate} onChange={e => setBirthDate(e.target.value)} required />
            </div>

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
              <input id="Password" name="Password" type="password" placeholder="*********" value={password}
                onChange={e => setPassword(e.target.value)} required />
            </div>

            {/*buttons*/}
            <div className="col-md-12 text-center">
              <button type="submit" className="button" onClick={create}>Registrar</button>
            </div>
            <div className="signup-link">Already member? <a href="/login">Login now</a></div>
          </div>
        </div>
      </div>
    </div>
  );

}
export default Registro;