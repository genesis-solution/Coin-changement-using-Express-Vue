import React, { lazy, useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { paymentService } from '../../controllers/_services/payment.service';

const WidgetsDashboard = lazy(() => import('../widgets/WidgetsDashboard.js'))

const Dashboard = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  dispatch({type: 'set', darkMode: false})

  const user = useSelector(state => state.user)

  if (!localStorage.getItem('user') || !user || user.role) {
    dispatch({type: 'set', darkMode: true})
    history.push('/home')
  }

  const [mytransactions, setMytransactions] = useState()

  useEffect(() => {
    if (user)
    paymentService.getMyAllTransaction(user.id)
    .then(
      transactions => {
        setMytransactions(transactions)
      },
      error => {}
    )
  }, [user])

  return (
    <>
      <WidgetsDashboard />

      <CCard color="transparent" className="transaction-table d-box-shadow1 d-border p-0 m-0">
        <CCardHeader color="transparent d-border p-0" className="header-title">
          Transaction History
        </CCardHeader>
        <CCardBody className="p-0" color="default">
          { mytransactions && 
            <table className="table table-hover table-outline mb-0">
              <thead className="thead-light">
                <tr>
                  <th className="text-center">ID</th>
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
                      <td className="text-center">
                        {transaction.orderId}
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

    </>
  )
}

export default Dashboard
