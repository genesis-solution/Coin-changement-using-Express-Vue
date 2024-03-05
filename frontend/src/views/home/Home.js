import React, { lazy, useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetSimple,
  CImg
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import { format } from 'date-fns';
import { paymentService } from '../../controllers/_services';

const WidgetsExchange = lazy(() => import('../widgets/WidgetsExchange.js'))
const WidgetsAdvantage = lazy(() => import('../widgets/WidgetsAdvantage.js'))

const Home = () => {
  const dispatch = useDispatch()
  
  dispatch({type: 'set', darkMode: true})

  const [mytransactions, setMytransactions] = useState()

  useEffect(() => {
    paymentService.getTransactions()
    .then(
      transactions => {
        setMytransactions(transactions)
      },
      error => {}
    )
  }, []);

  return (
    <>
      <WidgetsExchange/>

      <CRow>
        <CCol>
          <CCard color="transparent" className="transaction-table d-box-shadow1 d-border mt-0">
            <CCardHeader color="transparent d-border pl-0" className="header-title">
              Live Transaction
            </CCardHeader>
            <CCardBody className="p-0" color="default">
            { mytransactions && 
              <table className="table table-hover table-outline mb-0">
                <thead className="thead-light">
                  <tr>
                    <th>Username</th>
                    <th className="text-center">From</th>
                    <th className="text-center">To</th>
                    <th className="text-center">Amount</th>
                    <th className="text-center">Date Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                {
                  mytransactions.map((transaction, index) => (
                    <tr>
                      <td>
                        { transaction.userName }
                      </td>
                      <td className="text-center">
                        {transaction.from}
                      </td>
                      <td className="text-center">
                        {transaction.to}
                      </td>
                      <td className="text-center">
                        {transaction.amount}
                      </td>
                      <td className="text-center">
                        { format(new Date(transaction.createdAt), 'yyyy-MM-dd kk:mm') }
                      </td>
                      <td>
                        {transaction.status}
                      </td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            }
            { Object.assign([], mytransactions).length === 0 && 
              <h3 className="text-muted m-3 pt-3 text-center">NO TRANSACTION</h3>
            }
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <WidgetsAdvantage />

      <CRow>
        <CCol>
          <CCard color="transparent" className="widget-feedbacks d-box-shadow1 d-border">
            <CCardHeader color="transparent pl-0" className="header-title d-border">
              Trusted by million users
            </CCardHeader>
            <CCardBody className="p-0" color="default">
              <CRow color="transparent d-border">
                <CCol sm="12" md="12" lg="6">
                  <CWidgetSimple className="widget-feedback p-0">
                    <div className="d-flex p-0">
                      <div><CImg src={'img/icons8-male-user-50.png'} height={64} width={64}></CImg></div>
                      <div className="feedback">
                        <div className="align-items-start text-left feedback-auth">kicka***</div>
                        <div className="align-items-end small text-muted text-left feedback-content">
                            It was a pure pleasure to use this service, Also.
                            I want to pay attention to the greatest support team ever
                        </div>
                      </div>
                    </div>
                  </CWidgetSimple>
                </CCol>
                <CCol sm="12" md="12" lg="6">
                  <CWidgetSimple className="widget-feedback p-0">
                    <div className="d-flex p-0">
                      <div><CImg src={'img/icons8-male-user-50.png'} height={64} width={64}></CImg></div>
                      <div className="feedback">
                        <div className="align-items-start text-left feedback-auth">Loyd***</div>
                        <div className="align-items-end small text-muted text-left feedback-content">
                            It was a pure pleasure to use this service, Also.
                            I want to pay attention to the greatest support team ever
                        </div>
                      </div>
                    </div>
                  </CWidgetSimple>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Home
