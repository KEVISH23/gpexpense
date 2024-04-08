import React, { useEffect, useState } from 'react'
import loginImg from '../assets/Login.png'
import axios from 'axios'
import showTaostify from './showTaostify'
import {useNavigate} from 'react-router-dom'
const Login = (props) => {
  useEffect(() => {
    document.title='Login'
    
  }, [])
  
  const navigate = useNavigate()
  const submitData = async(e) => {
    e.preventDefault()
    let bool = true;
    if (!email.trim()) {
      setemailValid({ isValid: false, msg: 'Required' })
      bool = false
    } else if (!(email.trim()).match('([0-9]*[a-zA-Z\.\-\_]+[0-9]*)+@([a-zA-Z]+\.)+([a-zA-Z]{2,})')) {
      setemailValid({ isValid: false, msg: 'Email not valid' })
      bool = false
    } else {
      setemailValid({ isValid: true, msg: '' })
    }

    if(!password.trim()){
      setpassValid({ isValid: false, msg: 'Required' })
      bool = false
    }else if(password.trim().length<4 || password.trim().length>16 ){
      setpassValid({ isValid: false, msg: 'Password must have 4-16 characters' })
      bool = false
    }else{
      setpassValid({ isValid: true, msg: '' })
    }
    if(bool){
      try {
        let res = await axios.post('http://localhost:1923/api/v1/user/loginUser',{
          email,
          password
        })
        showTaostify(res.data.success,res.data.msg)
        if(res.data.success){
          localStorage.setItem('userLoggedIn',JSON.stringify(res.data.user))
          navigate('/userDashboard')
        }
      } catch (error) {
        showTaostify(false,'Error in login')
      }
      setemail('')
      setpassword('')
    }
  }
  const changeinInput = (th) => {
    if (th.target.name == 'email') {
      setemail(th.target.value)
      if (!th.target.value.trim()) {
        setemailValid({ isValid: false, msg: 'Required' })
        // bool = false
      } else if (!(th.target.value.trim()).match('([0-9]*[a-zA-Z\.\-\_]+[0-9]*)+@([a-zA-Z]+\.)+([a-zA-Z]{2,})')) {
        setemailValid({ isValid: false, msg: 'Email not valid' })
        // bool = false
      } else {
        setemailValid({ isValid: true, msg: '' })
      }
    } else {
      setpassword(th.target.value)
      if(!th.target.value.trim()){
        setpassValid({ isValid: false, msg: 'Required' })
        // bool = false
      }else if(th.target.value.trim().length<4 || th.target.value.trim().length>16 ){
        setpassValid({ isValid: false, msg: 'Password must have 4-16 characters' })
        // bool = false
      }else{
        setpassValid({ isValid: true, msg: '' })
      }
    }
  }

  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [emailValid, setemailValid] = useState({
    isValid: true,
    msg: 'Required'
  })
  const [passValid, setpassValid] = useState(
    {
      isValid: true,
      msg: 'Required'
    }
  )
  return (
    <>

      <div className='container'>
        <div className='row'>
          <div className='col-xl-6 col-ld-6 col-12'>
            <img className='img-fluid' src={loginImg} alt="image" />
          </div>
          <div className='col-xl-6 col-ld-6 col-12 d-flex flex-column justify-content-center'>
            <h5 className='text-center display-5'>Login</h5>
            <div className='card mb-3'>
              <form action='#' onSubmit={(event) => submitData(event)}>
                <div className='card-body p-5'>
                  <label className='form-label '>Email:-</label>
                  <input onChange={(event) => changeinInput(event)} name='email' value={email} type="email" placeholder='Your Email' className='form-control' />
                  <p className='mt-2 text-danger' hidden={emailValid.isValid}>{emailValid.msg}</p>
                  <label className='form-label mt-3'>Password:-</label>
                  <input onChange={(event) => changeinInput(event)} name='password' value={password} type="password" placeholder='Your Password' className='form-control' />
                  <p className='mt-2 text-danger' hidden={passValid.isValid}>{passValid.msg}</p>
                </div>
                <div className='card-footer text-center p-3'>
                  <button type='submit' className='btn btn-outline-success'>Submit</button>
                </div>
              </form>
            </div>
            <p>Don't have account? <strong style={{ cursor: "pointer" }} className='text-primary text-bold' onClick={() => props.propState(false)}>Register Now</strong></p>
          </div>
        </div>

      </div>

    </>
  )
}

export default Login