import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CImg,
  CButton,
  CCard,
  CCardBody,
  CLink
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { paymentService } from '../../controllers/_services/payment.service';

const Desc = () => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    paymentService.getExchangeLimit()
        .then(result => {
          console.log(result)
            if (result.data) {
              const today_date = new Date()
              const day = today_date.getDay()
              const startTime = new Date(today_date.getFullYear(), today_date.getMonth(), today_date.getDate(), 8, 0);
              const endTime = new Date(today_date.getFullYear(), today_date.getMonth(), today_date.getDate(), 17, 0);
 
              if (day > 6 || today_date < startTime || today_date > endTime) { // if Sunday
                setIsOnline(false);
              } else setIsOnline(true);
            } else setIsOnline(true);
        },
        err => {}
      )
  }, []);

  return (
    <CCard color="transparent" className="d-box-shadow1 d-border pr-0">
      <CCardBody color="transparent" className="pt-4 pr-0 card-desc">
        <CRow color="transparent" className="d-box-shadow1 d-border pr-0">
          <CCol sm="12" lg="12">
              <p className="h1 intro-title">Fast and secure crypto exchange<span className="text-success">.</span></p>
              <p className="h6 intro-desc">Instant exchange to local currency.</p>
          </CCol>
          <CCol sm="12" lg="12" style={{marginTop: "24px"}}>
              <div>
                <CLink href="https://play.google.com" target="_blank">
                  <CImg
                    src={'img/play.png'}
                    alt="Google play"
                    height="40"
                    className="app-icon-img"
                  />
                </CLink>
                <CLink href="https://apps.apple.com" target="_blank">
                  <CImg
                    src={'img/app-store.png'}
                    alt="App Store"
                    height="40"
                    className="pl-2 app-icon-img"
                  />
                </CLink>
              </div>
          </CCol>
          <CCol sm="12" lg="12" className="pb-1" style={{marginTop: "24px"}}>
              <div>
                <CImg
                  src={'img/btc.png'}
                  alt="Bitcoin"
                  height="50"
                />
                <CImg
                  src={'img/bnb.png'}
                  alt="BNB"
                  height="50"
                  className="ml-3"
                />
                <CImg
                  src={'img/usdt.png'}
                  alt="USDT"
                  height="50"
                  className="ml-3"
                />
                <CImg
                  src={'img/eth.png'}
                  alt="ETH"
                  height="50"
                  className="ml-3"
                />
                <CImg
                  src={'img/USD_Coin_icon.png'}
                  alt="USD Coin"
                  height="50"
                  className="ml-3"
                />
              </div>
          </CCol>
          <CCol sm="12" lg="12" className="pl-0 pt-0">
              <div className="d-flex">
                <div className="pl-0">
                  <CImg
                      src={'img/Union-Bank.png'}
                      alt="Union Bank"
                      height="115"
                      style={{marginTop: '-5px', marginLeft: '-5px'}}
                    />
                </div>
                <div className="pl-2 flex-grow-1 pt-3">
                    <div className="align-self-start">
                      <CImg
                        src={'img/GCash-Logo-Transparent-PNG-1.png'}
                        alt="GCash"
                        height="40"
                      />
                      <small className="text-muted ml-1 pt-2 font-weight-bold font-xs">& more...</small>
                    </div>
                    <div className="align-self-end">
                      <small className="ml-3 mt-1 font-weight-bold unicash-url" color="secondary">coins.ph</small>
                    </div>
                </div>
                <div className="pl-2 align-self-end pb-0">
                    <CButton className="ml-5 mt-1 float-right" color="secondary">
                      <CIcon name="cil-circle" alt="online status" color="success" className={isOnline ? 'online-status' : 'offline-status'}></CIcon> &nbsp; 
                      {isOnline ? 'Online' : 'Offline'}
                    </CButton>
                </div>
              </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    )
}

export default Desc
