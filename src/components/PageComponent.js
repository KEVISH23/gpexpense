import React, { useEffect, useState } from 'react'
import Login from './Login'
import Signup from './Signup'
import {useNavigate} from 'react-router-dom'
const PageComponent = () => {
  const navigate = useNavigate()
    useEffect(() => {
    if(localStorage.getItem('userLoggedIn')){
        navigate('/userDashboard')
    }else{
        navigate('/')
    }
    
    }, [])
    const [pageState, setpageState] = useState(true)
  return (
    <>
        {
            pageState?<Login propState={setpageState}></Login>:<Signup propState={setpageState}></Signup>
        }
    </>
  )
}

export default PageComponent