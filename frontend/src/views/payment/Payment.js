import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCollapse,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import { paymentService } from '../../controllers/_services/payment.service';
import { currencyConstants } from '../../controllers/_constants';
import { successNotification, warningNotification } from '../../controllers/_helpers';

const AddPayment = React.lazy(() => import('./AddPayment'));

const useStylesReddit = makeStyles((theme) => ({
  root: {
      border: 'none',
      overflow: 'hidden',
      backgroundColor: '#fcfcfb',
      fontWeight: '500',
      lineHeight: '20px',
      fontSize: '20px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:hover': {
        backgroundColor: '#fff',
        border: 'none',
        borderColor: 'transparent'
      },
      '&$focused': {
        backgroundColor: '#fff',
        boxShadow: 'none',
        color: "#24242f",
        borderColor: "#fff",
        border: 'none',
      }
  },
  focused: {
    border: 'none',
  },
  }));

function RedditTextField(props) {
  const classes = useStylesReddit();
  
  return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
  }

const Payment = () => {

  const dispatch = useDispatch()
  const history = useHistory()

  const [accordion, setAccordion] = useState(0)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [selectedDeleteRequest, setSelectedDeleteRequest] = useState()

  const user = useSelector(state => state.user)
  dispatch({type: 'set', darkMode: false})

  if (!localStorage.getItem('user') || !user || user.role) {
    dispatch({type: 'set', darkMode: true})
    history.push('/home')
  }

  const openingPopup = useSelector(state => state.openAddPayment)

  const [savedPaymentMethods, setSavedPaymentMethods] = useState()

  const deletePaymentMethod = () => {
    if (selectedDeleteRequest) {
      paymentService.deletePaymentmethod(selectedDeleteRequest)
      .then(
        paymentmethod => {
          successNotification("Successfully deleted.", 3000)
          setDeleteConfirm(!deleteConfirm)
          paymentService.getPaymentMethodsById(user.id)
          .then(
              paymentMethods => {
                setSavedPaymentMethods(paymentMethods)
              },
              error => {}
          )
        },
        error => {
          warningNotification(error, 3000)
          setDeleteConfirm(!deleteConfirm)
        }
      )
    }
  }

  useEffect(() => {
    if (user)
      paymentService.getPaymentMethodsById(user.id)
      .then(
          paymentMethods => {
            setSavedPaymentMethods(paymentMethods)
          },
          error => {}
      )
  }, [openingPopup, user]);

  const editPaymentMethod = (paymentMethod) => {
     dispatch({type: 'set', openAddPayment: true})
     dispatch({type: 'set', newPaymentMethod: false})
     dispatch({type: 'set', selectedPaymentMethod: paymentMethod})
  }

  return (
    <>
     
      <CCard color="transparent" className="transaction-table d-box-shadow1 d-border p-0 m-0">
        <CCardHeader color="transparent d-border p-0" className="header-title">
          PAYMENT
          <div className="d-flex mt-0 float-right">
              <div>
                  <CButton block className="button-exchange" onClick={() => {dispatch({type: 'set', openAddPayment: true}); dispatch({type: 'set', newPaymentMethod: true})}}>
                      + Add payment method
                  </CButton>
              </div>
          </div>
        </CCardHeader>
        <CCardBody className="p-0" color="default">
          { savedPaymentMethods && 
            <div className="mt-3" id="accordion">
              { savedPaymentMethods.map((paymentMethod, index) => (
                  <CCard className="mb-1">
                    <CCardHeader id="headingOne">
                      <CButton 
                        color="link"
                        className="text-left m-0 p-0" 
                        onClick={() => setAccordion(accordion === index ? null : index)}
                      >
                        <h5 className="m-0 p-0">{paymentMethod.name}</h5>
                      </CButton>
                      <CButton
                        color="transparent"
                        className="text-right text-danger m-0 p-1 button-group float-right"
                        onClick={() => { setSelectedDeleteRequest(paymentMethod.id); setDeleteConfirm(true)}} 
                      >
                        <h5 className="m-0 p-0">Delete</h5>
                      </CButton>
                      <CButton
                        color="transparent"
                        className="text-right text-info m-0 p-1 button-group float-right"
                        onClick={() => editPaymentMethod(paymentMethod)}
                      >
                        <h5 className="m-0 p-0">Edit</h5>
                      </CButton>
                    </CCardHeader>
                    <CCollapse show={accordion === index}>
                      <CCardBody>
                        { paymentMethod.bankAccountName && paymentMethod.bankAccountName !== '' && currencyConstants[paymentMethod.selectedCurrency].kind === 1 && 
                          <RedditTextField
                            id="bank-account-name"
                            label="Bank account name"
                            placeholder="Bank account name"
                            value={paymentMethod.bankAccountName}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                          />
                        }
                        { paymentMethod.bankAccountNo && paymentMethod.bankAccountNo !== '' && currencyConstants[paymentMethod.selectedCurrency].kind === 1 && 
                          <RedditTextField
                            id="bank-account-no"
                            label="Bank account number"
                            placeholder="Bank account number"
                            value={paymentMethod.bankAccountNo}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                          />
                        }
                        { paymentMethod.bankBranch && paymentMethod.bankBranch !== '' && currencyConstants[paymentMethod.selectedCurrency].kind === 1 && 
                          <RedditTextField
                            id="bank-branch"
                            label="Bank branch"
                            placeholder="Bank branch"
                            value={paymentMethod.bankBranch}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                          />
                        }
                        { paymentMethod.mobileNo && paymentMethod.mobileNo !== '' &&
                          <RedditTextField
                            id="mobile-no"
                            label="Mobile number"
                            placeholder="Mobile number"
                            value={paymentMethod.mobileNo}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                          />
                        }
                        { paymentMethod.firstName && paymentMethod.firstName !== '' && currencyConstants[paymentMethod.selectedCurrency].kind === 3 && 
                          <RedditTextField
                            id="first-name"
                            label="First Name"
                            placeholder="First Name"
                            value={paymentMethod.firstName}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                          />
                        }
                        { paymentMethod.middleName && paymentMethod.middleName !== '' && currencyConstants[paymentMethod.selectedCurrency].kind === 3 && 
                          <RedditTextField
                            id="middle-name"
                            label="Middle Name"
                            placeholder="Middle Name"
                            value={paymentMethod.middleName}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                          />
                        }
                        { paymentMethod.lastName && paymentMethod.lastName !== '' && currencyConstants[paymentMethod.selectedCurrency].kind === 3 && 
                          <RedditTextField
                            id="last-name"
                            label="Last Name"
                            placeholder="Last Name"
                            value={paymentMethod.lastName}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                          />
                        }
                        { paymentMethod.completeAddress && paymentMethod.completeAddress !== '' && currencyConstants[paymentMethod.selectedCurrency].kind === 3 && 
                          <RedditTextField
                            id="complete-address"
                            label="Complete address"
                            placeholder="Complete address"
                            value={paymentMethod.completeAddress}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                          />
                        }
                      </CCardBody>
                    </CCollapse>
                  </CCard>
                ))
              }
            </div>
          }
          { Object.assign([], savedPaymentMethods).length === 0 && 
            <h3 className="text-muted mt-3 pt-3">NO PAYMENT METHOD YET</h3>
          }
          <CModal 
              show={deleteConfirm} 
              onClose={() => setDeleteConfirm(!deleteConfirm)}
              color="danger"
              className="p-0 auth-modal"
              size="sm"
            >
            <CModalHeader closeButton>
              <CModalTitle>Please confirm</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h5 className="text-center">Are you sure you want to delete it?</h5>
            </CModalBody>
            <CModalFooter>
              <CButton color="danger" onClick={() => deletePaymentMethod()}>Delete</CButton>{' '}
              <CButton color="secondary" onClick={() => setDeleteConfirm(!deleteConfirm)}>Cancel</CButton>
            </CModalFooter>
          </CModal>
        </CCardBody>
      </CCard>
      <AddPayment />
    </>
  )
}

export default Payment
