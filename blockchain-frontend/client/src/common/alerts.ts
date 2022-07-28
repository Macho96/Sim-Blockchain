import Swal from "sweetalert2";
import * as msg from '../common/messages'

export const alert = (title: string, text: string, icon: any) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showConfirmButton: false,
      timer: msg.ALERT_TIMER,
      timerProgressBar: true,
    });
  }
  export const loading=()=>{
    Swal.fire({
title:'Cargando!',
html:'esperando respuesta',
allowOutsideClick:false,
allowEscapeKey:false,
showConfirmButton:false,
icon:'info',
didOpen:()=>{
    Swal.showLoading();
}
    });
  }
  export const mine=()=>{
    Swal.fire({
      title:'MINANDO!',
      html:'esperando respuesta',
      allowOutsideClick:false,
      allowEscapeKey:false,
      showConfirmButton:false,
      icon:'info',
      didOpen:()=>{
          Swal.showLoading();
      }
          });
        
  }
  