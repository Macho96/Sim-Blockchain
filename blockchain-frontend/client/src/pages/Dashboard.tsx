import { faRotate, faPlus, faTrash, faDownload, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalFooter } from 'react-bootstrap';
import { useEffect, useState } from "react";
import gif from '../assets/mining.gif';
import FileU from '../types/fileU.type';
import '../css/uploadfile.css';
import uploadService from "../services/upload.service";
import blockService from "../services/blockchain.service";

import { useNavigate } from "react-router-dom";
import * as msg from '../common/messages'
import jszip from 'jszip'
import { saveAs } from 'file-saver';
import Swal from "sweetalert2";
import * as alerts from "../common/alerts";
const Dashboard = () => {
  const navigate = useNavigate();
  const [user,] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("user");
    const initialValue = JSON.parse("" + saved);
    return initialValue || "";
  });
  const [selected, setSelected] = useState(0);
  const [init, setInit] = useState(false);
  const [fileList_to_selected, setFileList_to_selected] = useState<FileU[]>([]);
  const [data, setData] = useState<FileU[]>([]);
  const [modal, setModal] = useState(false);
  const handleClose = () => setModal(false);
  const handleShow = () => setModal(true);


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

  const updload = async () => {
    if (fileList.length === 0) {
      alerts.alert('Formatos no compatibles', '', msg.ICON_ERROR);
    } else {
      alerts.loading();
      if (fileList.length === 1) {
        var res = await uploadService.create(fileList[0]);
        handleClose();
        if (res === null) {
          alerts.alert(msg.CONNECTION_SERVICE_ERROR, '', msg.ICON_ERROR);
        } else {
          alerts.alert(res.data.msg, '', msg.ICON_SUCCESS);
          setTimeout(() => { BindData() }, 1500);
        }

      } else {
        var res2 = await uploadService.addToMemPool(fileList);
        handleClose();
        if (res2 === null) {
          alerts.alert(msg.CONNECTION_SERVICE_ERROR, '', msg.ICON_ERROR);

        } else {
          alerts.alert(res2.data.msg, '', msg.ICON_SUCCESS);
          setTimeout(() => { BindData() }, 1500);
        }
      }
    }
  }
  const formatDate = () => {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    return day + "/" + month + "/" + year;
  }
  const createFileU = (file: File) => {
    var date = formatDate();
    var type = file.type + "";
    var size = file.size / 1024;
    var sizekb = (parseFloat(size + "").toFixed(1)) + "";
    var name = file.name.split(".");
    convertToBase64(file, date, type, sizekb, name[0]);

  }
  let fileList: FileU[];
  const onChange = (e: any) => {
    fileList = new Array<FileU>();
    Array.from(e.target.files).forEach((file: File) => {
      switch (file.type) {
        case "image/png":
          createFileU(file)
          break;
        case "image/jpeg":
          createFileU(file)
          break;
        case "text/plain":
          createFileU(file)
          break;
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          createFileU(file)
          break;
        case "application/pdf":
          createFileU(file)
          break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          createFileU(file)
          break;
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
          createFileU(file)
          break;
        default:
          alerts.alert('uno o más archivos poseen un formato no compatible', 'se omitirán', msg.ICON_ERROR);
          break;
      }

    });
  };



  const convertToBase64 = (file: File, date: string, type: string, sizekb: string, name: string) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      let res = fileReader.result + "";
      var fileUU: FileU = {
        ID: null, Owner: user.UserName + "", Date: date + "", Format: type, Size: sizekb, File64: res, Name: name
      };
      fileList.push(fileUU);
    };
    fileReader.onerror = (error) => {
      console.log(error);
    };

  };
  const BindData = async () => {
    alerts.loading();
    const res = await uploadService.getAll(user.UserName);
    if (res.status === 200) {
      if (res.data.length > 0) {
        setData(res.data)
        setTimeout(() => { alerts.alert('tabla actualizada', '', msg.ICON_SUCCESS) }, 1000);
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
  const deleteFileI = (ID: string) => {
    Swal.fire({
      title: 'seguro que deseas eliminar el elemento?',
      text: "es irreversible",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        alerts.loading();
        uploadService.delete(ID).then((response: any) => {
          let res = response.data;
          setFileList_to_selected([]);
          setSelected(0);
          alerts.alert(res.msg, '', msg.ICON_SUCCESS);
          setTimeout(() => { BindData() }, 1500);
        }).catch((e: Error) => {
          console.log(e);
        });

      }
    });

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
  const removeSelected = () => {
    Swal.fire({
      title: 'seguro que deseas eliminar los elementos?',
      text: "es irreversible",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        alerts.loading();
        uploadService.deleteMany(fileList_to_selected).then((response: any) => {
          let res = response.data;
          //alert
          setFileList_to_selected([]);
          setSelected(0);
          alerts.alert(res.msg, '', msg.ICON_SUCCESS);
          setTimeout(() => { BindData() }, 1500);
        }).catch((e: Error) => {
          console.log(e);
        });

      }
    });


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
      saveAs(content, 'Files BlockChain ' + date + " " + time)
    });
    setFileList_to_selected([]);
    setSelected(0);
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


  const MinePool = async () => {
    if (data.length == 0) {
      alerts.alert("no hay datos que minar", '', msg.ICON_WARNING);
    } else {
      Swal.fire({
        title: 'Mining data... Please wait a few seconds...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        timerProgressBar: true,
        imageUrl: gif,
        imageHeight: 200,
        imageWidth: 300,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      //console.log(user.UserName);
      const res = await blockService.getAll(user.UserName);
      if (res.status === 200) {
        if (res.data["msg"] == null) {
          alerts.alert("The previous block is corrupted.", '', msg.ICON_ERROR);
        } else {
          console.log(res.data["msg"])
          setTimeout(() => { alerts.alert('Blocks created', '', msg.ICON_SUCCESS) }, 2000);
          uploadService.deleteMany(data).then((response: any) => {
            //let res = response.data;
            //alert
            //setFileList_to_selected([]);
            //setSelected(0);
            //alerts.alert(res.msg, '', msg.ICON_SUCCESS);
            setTimeout(() => { BindData() }, 1500);
          }).catch((e: Error) => {
            console.log(e);
          });
        }
      } else {
        alerts.alert(msg.CONNECTION_SERVICE_ERROR, '', msg.ICON_ERROR);
      }
    }
  }



  return (

    <>
      {user ?
        <>
          <div className="content-title">
            <h1>
              Bienvenido {user.UserName}
            </h1>
            <button className="btn btn-outline-light" onClick={() => { MinePool() }}>Mine</button>
          </div>
          <br />
          <div className="container-sm">
            <div className="d-flex justify-content-end">

            </div>
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
                    {Object.keys(data).map(datos => {
                      return (
                        <tr key={data[datos].Id}>
                          <td><input type="checkbox" onChange={(e) => { add_remove_to_Selectded(e, data[datos]) }} /> </td>
                          <td>{data[datos].Name}</td>
                          <td>{data[datos].Owner}</td>
                          <td>{renderGridFormat(data[datos].Format)}</td>
                          <td>{data[datos].Date}</td>
                          <td>{data[datos].Size} kb</td>
                          <td style={{ textAlign: "center" }}>
                            <button className="btn btn-success" onClick={() => { FileDownload(data[datos].File64, data[datos].Format, data[datos].Name) }}>  <FontAwesomeIcon icon={faDownload} /> </button>
                            <>  </>
                            <button className="btn btn-danger" onClick={() => { deleteFileI(data[datos].Id) }}>  <FontAwesomeIcon icon={faTrash} /> </button></td>
                        </tr>
                      )
                    })}

                  </>



                }
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    <button className="btn btn-primary" onClick={() => { setData([]); BindData(); }} >
                      <FontAwesomeIcon icon={faRotate} />
                    </button>
                    <> </>
                    <button className="btn btn-secondary" onClick={() => { handleShow(); }} >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>

                    <>  </>
                    {selected > 1 ?
                      <>
                        <button className="btn btn-success" onClick={() => { downloadFilesSelected() }}>  <FontAwesomeIcon icon={faDownload} /> </button>
                        <>  </>
                        <button className="btn btn-danger" onClick={() => { removeSelected() }}>  <FontAwesomeIcon icon={faTrash} /> </button>
                      </>
                      : <></>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* modal*/}
          {modal ?
            <>
              <Modal show={modal} style={{ color: "black" }} onHide={() => { handleClose(); }} animation={true}>
                <Modal.Header style={{ background: "#60909F", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }} closeButton>
                  <Modal.Title> Upload Files (txt-docs-pdf-xlsx-pptx-image)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <input type="file" accept="image/png, image/jpeg, .pdf, .txt, .docx, .xlsx, .pptx" multiple onChange={onChange} />
                </Modal.Body>
                <ModalFooter>
                  <button className="btn btn-secondary" onClick={() => { handleClose(); }}>
                    Close
                  </button>
                  <button className="btn btn-primary" onClick={updload}>
                    Save Changes
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
export default Dashboard;