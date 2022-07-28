import { faRotate, faDownload, faEye, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalFooter } from 'react-bootstrap';
import { useEffect, useState } from "react";
import Block from '../types/block.type';
import FileU from '../types/fileU.type';
import blockService from "../services/blockchain.service";
import { useNavigate } from "react-router-dom";
import * as msg from '../common/messages'
import jszip from 'jszip'
import { saveAs } from 'file-saver';
import Swal from "sweetalert2";
import * as alerts from "../common/alerts";
const Mined = () => {
  const navigate = useNavigate();
  const [user,] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("user");
    const initialValue = JSON.parse("" + saved);
    return initialValue || "";
  });
  const [selected, setSelected] = useState(0);
  const [init, setInit] = useState(false);
  const [fileList_to_selected, setFileList_to_selected] = useState<Block[]>([]);
  const [data, setData] = useState<Block[]>([]);
  const [listFile, setlistFile] = useState<FileU[]>([]);
  const [modal, setModal] = useState(false);
  const handleClose = (list: FileU[]) => { setModal(false); }
  const handleShow = (list: FileU[]) => { setModal(true); setlistFile(list) }


  useEffect(() => {
    if (user === "") {
      navigate('/login');
      setInit(false);
    } else {
      setInit(true);
    }
  }, [user]);
  useEffect(() => {
    if (init == true) {
      BindData();
    }
  }, [init]);
  const BindData = async () => {
    alerts.loading();
    const res = await blockService.getBlock(user.UserName);
    if (res.status === 200) {
      var datalist = res.data;
      if (datalist.length > 0) {
        var json = JSON.stringify(datalist[0]);
        var list = JSON.parse(json);
        console.log(datalist)
        setData(list.Blockchain)
        setTimeout(() => { alerts.alert('tabla actualizada', '', msg.ICON_SUCCESS) }, 1000);
        //alerts.alert('tabla actualizada', '', msg.ICON_SUCCESS)
      } else {
        setTimeout(() => { alerts.alert('sin datos', '', msg.ICON_WARNING) }, 1000);
      }

    } else {
      alerts.alert(msg.CONNECTION_SERVICE_ERROR, '', msg.ICON_ERROR);
    }
    if (res.data.length > 0) {
      setInit(false);
    } else {
      setInit(true);
    }
  }

  const add_remove_to_Selectded = (e: any, data: any) => {
    if (e.target.checked) {
      fileList_to_selected.push(data)
      setSelected((preview) => preview + 1);
    } else {
      var i = fileList_to_selected.indexOf(data);
      if (i > -1) {
        fileList_to_selected.splice(i, 1);
        setSelected((preview) => preview - 1);
      }

    }
  }

  const downloadFilesSelected = () => {
    var dateTime = new Date();
    var time = dateTime.toLocaleTimeString();
    var date = dateTime.toLocaleDateString();
    var zip = new jszip();
    Array.from(fileList_to_selected).forEach((element: any) => {
      var nameFile = element.Name + '.' + renderGridFormat(element.Format)
      var base = element.File64.substring(element.File64.lastIndexOf(",") + 1, element.File64.length)
      zip.file(nameFile, base, { base64: true })
    });
    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, 'Mined Files BlockChain ' + date + " " + time)
    });
  }
  const FileDownload = (base64: string, format: string, name: string) => {
    var a = document.createElement("a"); //Create <a>
    a.href = base64; //Image Base64 Goes here
    var pointFormat = renderGridFormat(format);
    a.download = name + "." + pointFormat; //File name and format
    a.click(); //Downloaded file
  };

  const renderGridFormat = (format: string) => {
    var pointFormat;
    switch (format) {
      case "image/png":
        pointFormat = "png";
        break;
      case "image/jpeg":
        pointFormat = "jpeg";
        break;
      case "text/plain":
        pointFormat = "txt";
        break;
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        pointFormat = "xlsx";
        break;
      case "application/pdf":
        pointFormat = "pdf";
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        pointFormat = "docx";
        break;
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        pointFormat = "pptx";
        break;
    }
    return pointFormat;
  }
  const formatDate = (time: string) => {
    var date = new Date(time);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    return day + "/" + month + "/" + year;
  }

  return (

    <>
      {user ?
        <>
          <div className="content-title">
            <h1>
              Minados
            </h1>
          </div>
          <br />
          <div className="container-sm">
            <div className="d-flex justify-content-end">

            </div>
            <table className="table table-striped table-bordered">
              <thead style={{ backgroundColor: "#60909F", color: "white", textAlign: "center" }}>
                <tr>
                  <th>IdBlock</th>
                  <th>Time</th>
                  <th>Miliseconds</th>
                  <th>Test</th>
                  <th>Hash</th>
                  <th>PreviusHash</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-striped" style={{ backgroundColor: "white", textAlign: "center" }}>
                {init ?
                  <>
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center" }}>
                        Sin datos
                      </td>
                    </tr>

                  </>
                  :
                  <>
                    {data.map(datos => {
                      return (
                        <tr key={datos.IdBlock}>
                          <td>{datos.IdBlock}</td>
                          <td>{datos.Time.split("T")[0]}</td>
                          <td>{datos.Milliseconds}</td>
                          <td>{datos.Test}</td>
                          <td onClick={() => { alerts.alert('Hash id=' + datos.IdBlock, datos.Hash, msg.ICON_INFO) }}>encrypt</td>
                          <td onClick={() => { alerts.alert('Hash id=' + datos.IdBlock, datos.PreviousHash, msg.ICON_INFO) }}>encrypt</td>
                          <td style={{ textAlign: "center" }}>
                            <button className="btn btn-success" onClick={() => { handleShow(datos.Documents) }}>  <FontAwesomeIcon icon={faEye} /> </button>
                          </td>
                        </tr>
                      )
                    })}
                  </>



                }
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    <button className="btn btn-primary" onClick={() => { setData([]); BindData() }} >
                      <FontAwesomeIcon icon={faRotate} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* modal*/}
          {modal ?
            <>
              <Modal show={modal} style={{ color: "black" }} onHide={() => { setSelected(0); handleClose([]); }} animation={true}>
                <Modal.Header style={{ background: "#60909F", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }} closeButton>
                  <Modal.Title> Files </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {listFile ?
                    <>
                      <table className="table table-striped table-bordered">
                        <thead style={{ backgroundColor: "#60909F", color: "white", textAlign: "center" }}>
                          <tr>
                            <th><FontAwesomeIcon icon={faCheck} /></th>
                            <th>Name</th>
                            <th>Owner</th>
                            <th>Format</th>
                            <th>Date</th>
                            <th>Size</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody className="table-striped" style={{ backgroundColor: "white", textAlign: "center" }}>
                          <>
                            {Object.keys(listFile).map(datos => {
                              return (
                                <tr key={listFile[datos].Id}>
                                  <td><input type="checkbox" onChange={(e) => { add_remove_to_Selectded(e, listFile[datos]) }} /> </td>
                                  <td>{listFile[datos].Name}</td>
                                  <td>{listFile[datos].Owner}</td>
                                  <td>{renderGridFormat(listFile[datos].Format)}</td>
                                  <td>{listFile[datos].Date}</td>
                                  <td>{listFile[datos].Size} kb</td>
                                  <td style={{ textAlign: "center" }}>
                                    <button className="btn btn-success" onClick={() => { FileDownload(listFile[datos].File64, listFile[datos].Format, listFile[datos].Name) }}>  <FontAwesomeIcon icon={faDownload} /> </button>
                                  </td>
                                </tr>
                              )
                            })}
                          </>
                          <tr>
                            <td colSpan={7} style={{ textAlign: "center" }}>
                              {selected > 1 ?
                                <>
                                  <button className="btn btn-success" onClick={() => { downloadFilesSelected() }}>  <FontAwesomeIcon icon={faDownload} /> </button>
                                </>
                                : <></>}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                    </>
                    :
                    <>
                    </>
                  }
                </Modal.Body>
                <ModalFooter>
                  <button className="btn btn-secondary" onClick={() => { setSelected(0); handleClose([]); }}>
                    Close
                  </button>
                </ModalFooter>
              </Modal>
            </>
            :
            <>

            </>
          }

        </>

        :
        <>
        </>
      }

    </>
  );

}
export default Mined;