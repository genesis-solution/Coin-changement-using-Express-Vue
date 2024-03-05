import React, { lazy } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    CModal,
    CModalBody
  } from '@coreui/react'

const Signup = lazy(() => import('./Signup'));
const Signin = lazy(() => import('./Signin'));
const EmailVerify = lazy(() => import('./EmailVerify'));
const ForgotPassword1 = lazy(() => import('./ForgotPassword1'));
const ForgotPassword2 = lazy(() => import('./ForgotPassword2'));

const AuthDialog = () => {
  const dispatch = useDispatch()

  const openSignup = useSelector(state => state.openSignup)
  const openSignin = useSelector(state => state.openSignin)
  const openEmailVerification = useSelector(state => state.openEmailVerification)
  const forgotPassword1 = useSelector(state => state.forgotPassword1)
  const forgotPassword2 = useSelector(state => state.forgotPassword2)

  const handleClose = () => {
    dispatch({type: 'set', openSignup: false})
    dispatch({type: 'set', openSignin: false})
    dispatch({type: 'set', openEmailVerification: false})
    dispatch({type: 'set', forgotPassword1: false})
    dispatch({type: 'set', forgotPassword2: false})
  };

  return (
    <CModal 
        show={openSignup || openSignin || openEmailVerification || forgotPassword1 || forgotPassword2} 
        onClose={handleClose}
        className="p-0 auth-modal"
        centered
        size={openSignin || openSignup || forgotPassword1 || forgotPassword2 ? '' : 'sm' }
        >
        <CModalBody className="p-0">
          <>
            { openSignin && <Signin /> }
            { openSignup && <Signup /> }
            { openEmailVerification && <EmailVerify />}
            { forgotPassword1 && <ForgotPassword1 /> }
            { forgotPassword2 && <ForgotPassword2 /> }
          </>
        </CModalBody>
    </CModal>
  )
}

export default AuthDialog
