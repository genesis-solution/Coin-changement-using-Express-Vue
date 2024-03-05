import React, { lazy, useEffect, useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CInputGroup,
    CInputGroupAppend,
    CInputGroupText,
    CInput,
    CLabel
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { paymentService } from '../../controllers/_services/payment.service';
import { warningNotification } from '../../controllers/_helpers';
import TextField from '@material-ui/core/TextField';
import {
    alpha,
    makeStyles,
  } from '@material-ui/core/styles';

const EditTransaction = lazy(() => import('./EditTransaction'));

const useStylesReddit = makeStyles((theme) => ({
    root: {
      border: 'none',
      overflow: 'hidden',
      backgroundColor: 'transparent',
      fontWeight: '600',
      lineHeight: '15px',
      fontSize: '22px',
      color: "green",
      width: "200px",
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:hover': {
        backgroundColor: '#fff',
      },
      '&$focused': {
        backgroundColor: '#fff',
        boxShadow: `${alpha("#24242f", 0.25)} 0 0 0 1px`,
        color: "green"
      }
    },
    focused: {},
  }));

function RedditTextField(props) {
    const classes = useStylesReddit();
  
    return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
  }

const AdminTransaction = () => {
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

  const [searchOrderIDOrName, setSearchOrderIdOrName] = useState()

  const todayDate = new Date()

  const [date, setDate] = useState({startDate: format(todayDate.setMonth(todayDate.getMonth() - 1), 'yyyy-MM-dd'), endDate: format(new Date(), 'yyyy-MM-dd') })

  const onSearch = (e) => {
    const keyV = e.target.value;
    setSearchOrderIdOrName(keyV);

    if (keyV === '') setMytransactions(totalTransactions);
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
        setTotalTransactions(transactions);
        setMytransactions(transactions);
      },
      error => {}
    )
  }, [editTransaction]);

  const [isLoading, setIsLoading] = useState(false);

  const getAllTransactionsByDate = (startTime, endTime) => {
    setTotalTransactions([]);
    setMytransactions([]);
    setIsLoading(true);
    paymentService.getAllTransactionsByDate({from: startTime, to: endTime})
    .then(
      transactions => {
        setTotalTransactions(transactions);
        setMytransactions(transactions);
        setIsLoading(false);
      },
      error => { setIsLoading(false); warningNotification("Transaction not found.", 3000) }
    ) 
  }


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
      <CRow>
        <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border" sm="12" lg="12" md="12">
          <CCard color="transparent" className="transaction-table d-box-shadow1 d-border mt-3">
            <CCardHeader color="transparent d-border pl-0 pr-0" className="header-title">
                <CRow>
                    <CCol sm="12" md="7" lg="7">
                        <div className="d-flex ">
                            <CLabel className="transaction-date-label">From: &nbsp;</CLabel>
                            <RedditTextField
                                id="from-date"
                                label=""
                                placeholder="From date"
                                value={date.startDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                type="date"
                                onChange={(e) => {
                                    setDate({startDate: e.target.value, endDate: date.endDate})
                                    getAllTransactionsByDate(e.target.value, date.endDate)
                                }}
                            />
                            <CLabel className="transaction-date-label">To: &nbsp;</CLabel>
                            <RedditTextField
                                id="to-date"
                                label=""
                                placeholder="To date"
                                value={date.endDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                type="date"
                                onChange={(e) => {
                                    setDate({startDate: date.startDate, endDate: e.target.value})
                                    getAllTransactionsByDate(date.startDate, e.target.value)
                                }}
                            />
                        </div>
                    </CCol>
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
            { !isLoading && mytransactions && 
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
            { isLoading && 
                <h3 className="text-muted m-3 pt-3 text-center">Loading. Please wait..</h3>
            }
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      
      <EditTransaction />
    </>
  )
}

export default AdminTransaction
