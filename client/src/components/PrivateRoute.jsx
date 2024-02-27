import React from 'react'
import {Navigate, Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux'; 


function PrivateRoute() {
    const {currentUser} = useSelector(state=> state.user);
  return (
    <>
          {
            currentUser ? <Outlet /> : <Navigate to='/sign-in' />
          }
    </>
  )
}

export default PrivateRoute
