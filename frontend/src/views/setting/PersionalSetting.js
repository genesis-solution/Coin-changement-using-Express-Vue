import React, { lazy, useEffect, useState } from 'react'
import {
  CRow,
  CCol
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const PersionalInfoSetting = lazy(() => import('../widgets/PersionalInfoSetting'))
const ChangePassword = lazy(() => import('../widgets/ChangePassword'))
const TFAVerification = lazy(() => import('../widgets/TFAVerification'))
const DeleteAccount = lazy(() => import('../widgets/DeleteAccount'))

const PersionalSetting = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  dispatch({type: 'set', darkMode: false})

  const user = useSelector(state => state.user)

  if (!localStorage.getItem('user') || !user || user.role) {
    dispatch({type: 'set', darkMode: true})
    history.push('/home')
  }

  return (
    <>
      <CRow color="transparent" className="d-box-shadow1">
        <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border" sm="12" lg="6" md="6">
          <h3>Persional Information</h3>
          <PersionalInfoSetting />
          <h3 className="mt-2">2FA Verification</h3>
          <TFAVerification />
        </CCol>
        <CCol className="pl-lg-1 pl-md-1 d-box-shadow1 d-border" sm="12" lg="6" md="6">
          <h3>Change Password</h3>
          <ChangePassword />
          <h3 className="mt-2">Email</h3>
          <DeleteAccount />
        </CCol>
      </CRow>
    </>
  )
}

export default PersionalSetting
