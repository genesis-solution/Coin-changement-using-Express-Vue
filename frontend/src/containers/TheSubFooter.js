import React from 'react'
import { 
    CImg,
    CRow,
    CCol,
    CLink
 } from '@coreui/react'

const TheSubFooter = () => {
  return (
    <div fixed={false} color="transparent" className="d-box-shadow1 d-border subfooter mb-3">
      <CRow>
        <CCol sm="12" lg="6" className="text-xs-center text-sm-center text-md-left text-lg-left">
          <span className="ml-0 mr-3">About</span>
          <span className="ml-0 mr-3">Reviews</span>
          <span className="ml-0 mr-3">Support</span>
          <span className="ml-0">Supported currencies</span>
        </CCol>
        <CCol sm="12" lg="6">
          <span className="float-lg-right d-sm-down-none">
            <CLink href="https://telegram.com" target="_blank">
              <CImg src={'img/icons8-telegram-app-50.png'} alt="Telegram" height={20} className="app-icon-img"></CImg>
            </CLink>
            <CLink href="https://twitter.com" target="_blank">
              <CImg src={'img/icons8-twitter-50.png'} alt="Twitter" height={20} className="ml-2 app-icon-img"></CImg>
            </CLink>
            <CLink href="https://facebook.com" target="_blank">
              <CImg src={'img/icons8-facebook-50.png'} alt="Facebook" height={20} className="ml-2 app-icon-img"></CImg>
            </CLink>
            <CLink href="">
              <CImg src={'img/icons8-send-email-50.png'} alt="Send email" height={20} className="ml-2 app-icon-img"></CImg>
            </CLink>
          </span>
        </CCol>
      </CRow>
    </div>
  )
}

export default React.memo(TheSubFooter)
