import React, { useState,useEffect } from 'react'
import SignUp from '../assets/SignUP.png'
import  axios  from 'axios'
import showTaostify from './showTaostify'

const Signup = (props) => {
  useEffect(() => {
    document.title='Register - User'
    
  }, [])
    const submitData = async(e) => {
        e.preventDefault()

        let bool = validate()
        if(bool){
            try {
              const res = await axios.post('http://localhost:1923/api/v1/user/addUser',{
              name,
              email,
              password
            })
              showTaostify(res.data.success,res.data.msg)
            } catch (error) {
              // console.log(error)
              showTaostify(false,'Error in regestering')
            }
            
            setemail('')
            setpassword('')
            setcpass('')
            setname('')
        }
    }
    const validate = () =>{
        let bool = true
        //enmail
        if (!email.trim()) {
            setemailValid({ isValid: false, msg: 'Required' })
            bool = false
          } else if (!(email.trim()).match('^([0-9]*[a-zA-Z\.\-\_]+[0-9]*)+@([a-zA-Z]+\.)+([a-zA-Z]{2,})$')) {
            setemailValid({ isValid: false, msg: 'Email not valid' })
            bool = false
          } else {
            setemailValid({ isValid: true, msg: '' })
          }
          //pass
          if(!password.trim()){
            setpassValid({ isValid: false, msg: 'Required' })
            bool = false
          }else if(password.trim().length<4 || password.trim().length>16 ){
            setpassValid({ isValid: false, msg: 'Password must have 4-16 characters' })
            bool = false
          }else{
            setpassValid({ isValid: true, msg: '' })
          }
          //name
          if (!name.trim()) {
            setnameValid({ isValid: false, msg: 'Required' })
            bool = false
          } else if (!(name.trim()).match('^[a-z A-Z]+$')) {
            setnameValid({ isValid: false, msg: 'Only Characters' })
            bool = false
          } else {
            setnameValid({ isValid: true, msg: '' })
          }

          if(!cpass.trim()){
            setcpassValid({ isValid: false, msg: 'Required' })
            bool = false
          }else if(cpass.trim().length<4 || password.trim().length>16 ){
            setcpassValid({ isValid: false, msg: 'Password must have 4-16 characters' })
            bool = false
          }else if(cpass.trim() != password.trim()){
            setcpassValid({ isValid: false, msg: 'Password and confirm password must be same' })
            bool=false
          }else{
            setcpassValid({ isValid: true, msg: '' })
          }
          return bool
    }
    const changeinInput = (th) => {
        if (th.target.name == 'email') {
            setemail(th.target.value)
            if (!th.target.value.trim()) {
              console.log('in if')
              setemailValid({ isValid: false, msg: 'Required' })
              // bool = false
            } else if (!(th.target.value.trim()).match('^([0-9]*[a-zA-Z\.\-\_]+[0-9]*)+@([a-zA-Z]+\.)+([a-zA-Z]{2,})$')) {
              setemailValid({ isValid: false, msg: 'Email not valid' })
              // bool = false
            } else {
              setemailValid({ isValid: true, msg: '' })
            }
        } else if (th.target.name == 'password') {
            setpassword(th.target.value)
            if(!th.target.value.trim()){
              setpassValid({ isValid: false, msg: 'Required' })
              
            }else if(th.target.value.trim().length<4 || th.target.value.trim().length>16 ){
              setpassValid({ isValid: false, msg: 'Password must have 4-16 characters' })
              
            }else{
              setpassValid({ isValid: true, msg: '' })
            }
            
        } else if (th.target.name == 'name') {
            setname(th.target.value)
            if (!th.target.value.trim()) {
              setnameValid({ isValid: false, msg: 'Required' })
            } else if (!(th.target.value.trim()).match('^[a-z A-Z]+$')) {
              setnameValid({ isValid: false, msg: 'Only Characters' })
            }else {
              setnameValid({ isValid: true, msg: '' })
            }
        } else {
            setcpass(th.target.value)
            if(!th.target.value.trim()){
              setcpassValid({ isValid: false, msg: 'Required' })
              // bool = false
            }else if(th.target.value.trim().length<4 || password.trim().length>16 ){
              setcpassValid({ isValid: false, msg: 'Password must have 4-16 characters' })
              // bool = false
            }else{
              setcpassValid({ isValid: true, msg: '' })
            }
        }
    }
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [name, setname] = useState('')
    const [cpass, setcpass] = useState('')
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
      const [cpassValid, setcpassValid] = useState(
        {
          isValid: true,
          msg: 'Required'
        }
      )
      const [nameValid, setnameValid] = useState(
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
                        <img className='img-fluid' src={SignUp} alt="image" />
                    </div>
                    <div className='col-xl-6 col-ld-6 col-12 d-flex flex-column justify-content-center'>
                        <h5 className='text-center display-5'>Register</h5>
                        <div className='card mb-3'>
                            <form action='#' onSubmit={(event) => submitData(event)}>
                                <div className='card-body p-5'>
                                    <label className='form-label'>Name:-</label>
                                    <input onChange={(event) => changeinInput(event)} value={name} type="text" name='name' className='form-control' placeholder='Your Name' />
                                    <p className='mt-2 text-danger' hidden={nameValid.isValid}>{nameValid.msg}</p>
                                    <label className='form-label mt-3'>Email:-</label>
                                    <input onChange={(event) => changeinInput(event)} name='email' value={email} type="email" placeholder='Your Email' className='form-control' />
                                    <p className='mt-2 text-danger' hidden={emailValid.isValid}>{emailValid.msg}</p>
                                    <label className='form-label mt-3'>Password:-</label>
                                    <input onChange={(event) => changeinInput(event)} name='password' value={password} type="password" placeholder='Your Password' className='form-control' />
                                    <p className='mt-2 text-danger' hidden={passValid.isValid}>{passValid.msg}</p>
                                    <label className='form-label mt-3'>Confirm Password:-</label>
                                    <input onChange={(event) => changeinInput(event)} name='cpass' value={cpass} type="password" placeholder='Confirm Password' className='form-control' />
                                    <p className='mt-2 text-danger' hidden={cpassValid.isValid}>{cpassValid.msg}</p>
                                </div>
                                <div className='card-footer text-center p-3'>
                                    <button type='submit' className='btn btn-outline-success'>Submit</button>
                                </div>
                            </form>
                        </div>
                        <p>Already have account? <strong style={{ cursor: "pointer" }} onClick={()=>props.propState(true)} className='text-primary text-bold'>Login Now</strong></p>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Signup