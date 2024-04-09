import React from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showTaostify = (type,msg) => {
  switch(type){
    case true:toast.success(msg,{
        position: "top-right",
        autoClose: 1000,
        closeOnClick: true,
        draggable: false,
        theme: "light",
        pauseOnHover:false,
        // transition:Slide
      });
      break;
    case false:toast.error(msg,{
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
        draggable: false,
        theme: "light",
      })
      break;
    default:return false
  }
}

export default showTaostify