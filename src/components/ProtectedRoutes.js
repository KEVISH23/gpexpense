import React from 'react'
import { useEffect } from 'react'
import {Navigate,Outlet} from 'react-router-dom'
const ProtectedRoutes = () => {

    
    return localStorage.getItem("userLoggedIn") ? (
        <>
          <Outlet />
        </>
      ) : (
        <Navigate to="/" />
      );
}

export default ProtectedRoutes