import { useEffect, useState } from "react";
import SystemService from '../services/system.service';
import SystemU from '../types/system.type';
import "../css/options.css";
import { Modal } from 'react-bootstrap';
import { faRotate, faPlus, faPencil, faTrash, faDatabase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as msg from '../common/messages';
import * as alerts from "../common/alerts";
const SystemOptions = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(false);
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [Op, setOp] = useState("");
  const [valueOp, setValueOp] = useState("");
  const [edit, setEdit] = useState(false);
  const [modal, setModal] = useState(false);
  const handleClose = () => setModal(false);
  const handleShow = () => setModal(true);
  const [data, setData] = useState<SystemU[]>([]);
  const [user,] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("user");
    const initialValue = JSON.parse("" + saved);
    return initialValue || "";
  });

  useEffect(() => {
    if (user === "") {
      navigate('/login');
    }
  }, [user]);
  useEffect(() => {
    if (state === false) {
      BindData();
    }
  }, []);

  const deleteOption = (option: any) => {
    Swal.fire({
      title: 'Estas seguro que deseas eliminarlo?',
      text: "es irreversible!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        SystemService.delete(option).then((response: any) => {
          let res = response.data;
          alerts.alert(res.msg, '', msg.ICON_SUCCESS);
          BindData();
        }).catch((e: Error) => {
          console.log(e);
        });

      }
    });


  };
  const create = () => {
    var systemOption = { "Id": null, "Option": Op, "Value": valueOp };
    if (Op === '' || valueOp === '' || Op === ' ' || valueOp === ' ') {
      alerts.alert(msg.REQUIRE_FIELD, msg.REQUIRE, msg.ICON_WARNING);
    } else {
      //alerts.loading();
      SystemService.create(systemOption).then((response: any) => {
        let res = response.data;
        alerts.alert(res.msg, '', msg.ICON_SUCCESS);
        handleClose();
        BindData();

      }).catch((e: Error) => {
        console.log(e);
      });
      //console.log("creando");
    }
  };
  const editOption = () => {
    var systemOption = { "Id": id, "Option": Op, "Value": valueOp };
    //console.log(systemOption);
    alerts.loading();
    SystemService.update(systemOption, Op).then((response: any) => {
      let res = response.data;
      // setAlerta("alert-info");
      // setError(res.msg);
      alerts.alert(res.msg, '', msg.ICON_SUCCESS);
      handleClose();
      BindData();
    }).catch((e: Error) => {
      console.log(e);
    });


  };
  const BindData = async () => {
    alerts.loading();
    const res = await SystemService.getAll();
    if ("OK" === res.statusText) {
      if (res.data.length > 0) {
        setData(res.data);
        setTimeout(() => { alerts.alert('tabla actualizada', '', msg.ICON_SUCCESS) }, 1000);
      } else {
        setTimeout(() => { alerts.alert('sin datos', '', msg.ICON_WARNING) }, 1000);
      }

    } else {
      alerts.alert("error al obtener datos reintente", '', msg.ICON_ERROR);
    }
    if (res.data.length > 0) {
      setState(true);
    } else {
      setState(false);
    }
  }

  return (

    <div className="container">
      {user ?
        <>

          <table className="table table-striped table-bordered">
            <thead style={{ backgroundColor: "#60909F", color: "white" }}>
              <tr>
                <th>Option</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-striped" style={{ backgroundColor: "white" }}>
              {state ?
                <>
                  {Object.keys(data).map(datos => {
                    return (
                      <tr key={datos}>
                        <td>{data[datos].Option}</td>
                        <td>{data[datos].Value}</td>
                        <td style={{ textAlign: "center" }}><button className="btn btn-info" onClick={() => { setEdit(true); handleShow(); setTitle("Edit"); setOp(data[datos].Option); setValueOp(data[datos].Value); setId(data[datos].Id) }}>  <FontAwesomeIcon icon={faPencil} /> </button>
                          <>  </>
                          <button className="btn btn-danger" onClick={() => deleteOption(data[datos].Option)}>  <FontAwesomeIcon icon={faTrash} /> </button></td>
                      </tr>
                    )
                  })}

                </>
                :
                <>
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      Sin datos
                    </td>
                  </tr>
                </>



              }
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  <button className="btn btn-primary" onClick={() => { setData([]); BindData(); }} >
                    <FontAwesomeIcon icon={faRotate} />
                  </button>
                  <>  </>

                  <button className="btn btn-secondary" onClick={() => { setEdit(false); handleShow(); setTitle("Create"); setOp(""); setValueOp("") }} >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          {modal ?
            <>
              <Modal show={modal} style={{ color: "black" }} onHide={() => { handleClose(); setOp(""); setValueOp("") }} animation={true}>
                <Modal.Header style={{ background: "#60909F", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }} closeButton>
                  <Modal.Title >{title} Option</Modal.Title>
                </Modal.Header>

                {edit ?
                  <>
                    <Modal.Body>
                      <div style={{ height: "45px", marginBottom: "15px", position: "relative" }}>
                        <i><FontAwesomeIcon icon={faDatabase} /></i>
                        <input style={{ height: "100%", width: "96%", outline: "none", paddingLeft: "60px", borderRadius: "5px", border: "1px solid lightgrey", fontSize: "16px", transition: "all 0.3s ease" }} type="text" value={Op} placeholder="ej: numero por bloque" onChange={e => setOp(e.target.value)} readOnly />
                      </div>
                      <div style={{ height: "45px", marginBottom: "15px", position: "relative" }}>
                        <i><FontAwesomeIcon icon={faPencil} /></i>
                        <input style={{ height: "100%", width: "96%", outline: "none", paddingLeft: "60px", borderRadius: "5px", border: "1px solid lightgrey", fontSize: "16px", transition: "all 0.3s ease" }} type="text" value={valueOp} placeholder="ej: 5" onChange={e => setValueOp(e.target.value)} />
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <button className="btn btn-secondary" onClick={() => { handleClose(); setOp(""); setValueOp("") }}>
                        Close
                      </button>
                      <button className="btn btn-primary" onClick={editOption}>
                        Save Changes
                      </button>
                    </Modal.Footer>
                  </>
                  :
                  <>
                    <Modal.Body>
                      <div style={{ height: "45px", marginBottom: "15px", position: "relative" }}>
                        <i><FontAwesomeIcon icon={faDatabase} /></i>
                        <input style={{ height: "100%", width: "96%", outline: "none", paddingLeft: "60px", borderRadius: "5px", border: "1px solid lightgrey", fontSize: "16px", transition: "all 0.3s ease" }} type="text" value={Op} placeholder="ej: numero por bloque" onChange={e => setOp(e.target.value)} />
                      </div>
                      <div style={{ height: "45px", marginBottom: "15px", position: "relative" }}>
                        <i><FontAwesomeIcon icon={faPencil} /></i>
                        <input style={{ height: "100%", width: "96%", outline: "none", paddingLeft: "60px", borderRadius: "5px", border: "1px solid lightgrey", fontSize: "16px", transition: "all 0.3s ease" }} type="text" value={valueOp} placeholder="ej: 5" onChange={e => setValueOp(e.target.value)} />
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <button className="btn btn-secondary" onClick={() => { handleClose(); setOp(""); setValueOp("") }}>
                        Close
                      </button>
                      <button className="btn btn-primary" onClick={create}>
                        Save
                      </button>
                    </Modal.Footer>

                  </>

                }

              </Modal>


            </>
            :
            <></>
          }

        </>
        :
        <>

        </>
      }


    </div>
  );

}
export default SystemOptions;