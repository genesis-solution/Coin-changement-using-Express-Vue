import React, { lazy, useEffect, useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CWidgetSimple,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupAppend,
    CInputGroupText,
    CInput
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { paymentService } from '../../controllers/_services/payment.service';
import { warningNotification } from '../../controllers/_helpers';

const EditTransaction = lazy(() => import('./EditTransaction'));

const AdminHome = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  dispatch({type: 'set', darkMode: false})

  const user = useSelector(state => state.user)
  const editTransaction = useSelector(state => state.editTransaction)

  if (!localStorage.getItem('user') || !user || !user.role) {
    dispatch({type: 'set', darkMode: true})
    history.push('/home')
  }

  const [totalTransactions, setTotalTransactions] = useState([]);
  const [mytransactions, setMytransactions] = useState();

  const [numberOfProcessing, setNumberOfProcessing] = useState(0);
  const [numberOfCompleted, setNumberOfCompleted] = useState(0);
  
  const [amountOfUSDT, setAmountOfUSDT] = useState(0);
  const [amountOfETH, setAmountOfETH] = useState(0);
  const [amountOfBTC, setAmountOfBTC] = useState(0);
  const [amountOfUSDC, setAmountOfUSDC] = useState(0);
  const [amountOfBUSD, setAmountOfBUSD] = useState(0);
  const [amountOfBNB, setAmountOfBNB] = useState(0);

  const [searchOrderIDOrName, setSearchOrderIdOrName] = useState()

  const onSearch = (e) => {
    const keyV = e.target.value;
    setSearchOrderIdOrName(keyV);

    if (keyV == '') setMytransactions(totalTransactions);
    else {
        let tmpTransactions = [];
        totalTransactions.forEach(element => {
           if (element.orderId.toLowerCase().indexOf(keyV.toLowerCase()) > -1 || element.userName.toLowerCase().indexOf(keyV.toLowerCase()) > -1) {
               tmpTransactions.push(element);
           } 
        });
        setMytransactions(tmpTransactions);
    }
  }

  useEffect(() => {
    paymentService.getAllTransactions()
    .then(
      transactions => {
        let processingTransaction = [];
        let completedTransaction = [];
        let tempUSDT = 0;
        let tempETH = 0;
        let tempBTC = 0;
        let tempUSDC = 0;
        let tempBUSD = 0;
        let tempBNB = 0;
        transactions.forEach(element => {
            if (element.status === 'Processing') {
                processingTransaction.push(element);
                // if (element.from === 'USDT') tempUSDT = tempUSDT + Number(element.amount);
                // if (element.from === 'ETH') tempETH = tempETH + Number(element.amount);
                // if (element.from === 'BTC') tempBTC = tempBTC + Number(element.amount);
                // if (element.from === 'USDC') tempUSDC = tempUSDC + Number(element.amount);
                // if (element.from === 'BUSD') tempBUSD = tempBUSD + Number(element.amount);
                // if (element.from === 'BNB') tempBNB = tempBNB + Number(element.amount);
            }
            if (element.status === 'Completed') {
                completedTransaction.push(element);
            }
                
        });
        setNumberOfProcessing(processingTransaction.length);
        setNumberOfCompleted(completedTransaction.length);
        setAmountOfUSDT(Math.round(tempUSDT * 100) / 100)
        setAmountOfETH(Math.round(tempETH * 100) / 100)
        setAmountOfBTC(Math.round(tempBTC * 100) / 100)
        setAmountOfUSDC(Math.round(tempUSDC * 100) / 100)
        setAmountOfBUSD(Math.round(tempBUSD * 100) / 100)
        setAmountOfBNB(Math.round(tempBNB * 100) / 100)
        setTotalTransactions(processingTransaction);
        setMytransactions(processingTransaction);
      },
      error => {}
    )
  }, [editTransaction]);


  const onClickProcess = (transaction) => {
    paymentService.getPaymentMethodsByIdAndName(transaction.userId, transaction.to).then(
      result => {
        dispatch({type: 'set', editTransaction: true})
        dispatch({type: 'set', selectedPaymentMethod: result})
        dispatch({type: 'set', selectedTransaction: transaction})
      },
      error => { warningNotification(error, 3000); }
    )
  }

  return (
    <>
      <CRow color="transparent" className="d-box-shadow1">
        <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border" sm="12" lg="12" md="12">
            <div className="d-flex bg-light border admin-home-widget-dive">
                <div>
                    <CWidgetSimple header="" text="" className="admin-home-widget1 d-box-shadow1 d-border mb-0" color="transparent">
                        <div className="widget1-number">
                            <span>{numberOfProcessing}</span>
                        </div>
                        <p>Processing Transaction</p>
                    </CWidgetSimple>
                </div>
                <div>
                    <CWidgetSimple header="" text="" className="admin-home-widget1 d-box-shadow1 d-border mb-0" color="transparent">
                        <div className="widget1-number">
                            <span>{numberOfCompleted}</span>
                        </div>
                        <p>Completed Transaction</p>
                    </CWidgetSimple>
                </div>
                <div className={amountOfUSDT > 0 ? undefined : 'd-none'}>
                    <CWidgetSimple header="" text="" className="admin-home-widget1 d-box-shadow1 d-border mb-0" color="transparent">
                        <div className="widget2-number">
                            <span>{amountOfUSDT}</span>
                        </div>
                        <p>USDT Reserve</p>
                    </CWidgetSimple>
                </div>
                <div className={amountOfETH > 0 ? undefined : 'd-none'}>
                    <CWidgetSimple header="" text="" className="admin-home-widget1 d-box-shadow1 d-border mb-0" color="transparent">
                        <div className="widget2-number">
                            <span>{amountOfETH}</span>
                        </div>
                        <p>ETH Reserve</p>
                    </CWidgetSimple>
                </div>
                <div className={amountOfBTC > 0 ? undefined : 'd-none'}>
                    <CWidgetSimple header="" text="" className="admin-home-widget1 d-box-shadow1 d-border mb-0" color="transparent">
                        <div className="widget2-number">
                            <span>{amountOfBTC}</span>
                        </div>
                        <p>BTC Reserve</p>
                    </CWidgetSimple>
                </div>
                <div className={amountOfUSDT > 0 ? undefined : 'd-none'}>
                    <CWidgetSimple header="" text="" className="admin-home-widget1 d-box-shadow1 d-border mb-0" color="transparent">
                        <div className="widget2-number">
                            <span>{amountOfUSDT}</span>
                        </div>
                        <p>USDC Reserve</p>
                    </CWidgetSimple>
                </div>
                <div className={amountOfUSDC > 0 ? undefined : 'd-none'}>
                    <CWidgetSimple header="" text="" className="admin-home-widget1 d-box-shadow1 d-border mb-0" color="transparent">
                        <div className="widget2-number">
                            <span>{amountOfUSDC}</span>
                        </div>
                        <p>USDC Reserve</p>
                    </CWidgetSimple>
                </div>
                <div className={amountOfBUSD > 0 ? undefined : 'd-none'}>
                    <CWidgetSimple header="" text="" className="admin-home-widget1 d-box-shadow1 d-border mb-0" color="transparent">
                        <div className="widget2-number">
                            <span>{amountOfBUSD}</span>
                        </div>
                        <p>BUSD Reserve</p>
                    </CWidgetSimple>
                </div>
                <div className={amountOfBNB > 0 ? undefined : 'd-none'}>
                    <CWidgetSimple header="" text="" className="admin-home-widget1 d-box-shadow1 d-border mb-0" color="transparent">
                        <div className="widget2-number">
                            <span>{amountOfBNB}</span>
                        </div>
                        <p>BNB Reserve</p>
                    </CWidgetSimple>
                </div>
            </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border" sm="12" lg="12" md="12">
          <CCard color="transparent" className="transaction-table d-box-shadow1 d-border mt-3">
            <CCardHeader color="transparent d-border pl-0 pr-0" className="header-title">
                <CRow>
                    <CCol sm="12" md="7" lg="7">Pending Transaction</CCol>
                    <CCol sm="12" md="5" lg="5">
                        <CInputGroup className="admin-search pr-0 mr-0">
                            <CInput value={searchOrderIDOrName} onChange={onSearch} placeholder="Order id or Name" />
                            <CInputGroupAppend className="mr-0 pr-0">
                                <CInputGroupText className="admin-search-button">
                                    Search
                                </CInputGroupText>
                            </CInputGroupAppend>
                        </CInputGroup>
                    </CCol>
                </CRow>
            </CCardHeader>
            <CCardBody className="p-0" color="default">
            { mytransactions && 
              <table className="table table-hover table-outline mb-0">
                <thead className="thead-light">
                  <tr>
                    <th>Order ID</th>
                    <th className="text-center">Username</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">From</th>
                    <th className="text-center">To</th>
                    <th className="text-center">Amount</th>
                    <th className="text-center">Date Time</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                { mytransactions && 
                  mytransactions.map(transaction => (
                    <tr>
                      <td>
                        {transaction.orderId}
                      </td>
                      <td className="text-center">
                        { transaction.userName }
                      </td>
                      <td className="text-center">
                        { transaction.email }
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
                      <td className="text-center">
                        {transaction.status}
                      </td>
                      <td className="text-center">
                          <CButton color="success" onClick={() => onClickProcess(transaction)}>Process</CButton>
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
      
      <EditTransaction />
    </>
  )
}

export default AdminHome
