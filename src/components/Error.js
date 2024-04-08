import React from 'react'
import errorImage from '../assets/notfound.png'
const Error = () => {
  return (
    <>
        <div className='container min-vh-100 d-flex justify-content-center align-items-center'>
            <img src={errorImage} width={500} height={500} alt="" className='img-fluid'/>
        </div>
    </>
  )
}

export default Error