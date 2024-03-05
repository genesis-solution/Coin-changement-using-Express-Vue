import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    CModal,
    CModalBody,
    CSelect,
    CButton
  } from '@coreui/react'
import TextField from '@material-ui/core/TextField';
import {
    alpha,
    makeStyles,
    } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { currencyConstants } from '../../controllers/_constants';
import { paymentService } from '../../controllers/_services/payment.service';
import { successNotification, warningNotification } from '../../controllers/_helpers';

const useStylesReddit = makeStyles((theme) => ({
    root: {
        border: 'none',
        overflow: 'hidden',
        backgroundColor: '#fcfcfb',
        fontWeight: '700',
        lineHeight: '24px',
        fontSize: '24px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:hover': {
        backgroundColor: '#fff',
        },
        '&$focused': {
        backgroundColor: '#fff',
        boxShadow: `${alpha("#24242f", 0.25)} 0 0 0 1px`,
        borderRadius: 4,
        borderColor: "#24242f",
        borderBottom: "2px solid black",
        color: "#24242f"
        }
    },
    focused: {},
    }));

function RedditTextField(props) {
    const classes = useStylesReddit();
    
    return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
    }

const AddPayment = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const user = useSelector(state => state.user)
  const openAddPayment = useSelector(state => state.openAddPayment)
  const newPaymentMethod = useSelector(state => state.newPaymentMethod)
  const selectedPaymentMethod = useSelector(state => state.selectedPaymentMethod)

  const handleClose = () => {
    dispatch({type: 'set', openAddPayment: false})
  };

  const [bankAccountName, setBankAccountName] = useState('')
  const [bankAccountNo, setBankAccountNo] = useState('')
  const [bankBranch, setBankBranch] = useState('')
  
  const [mobileNo, setMobileNo] = useState('')

  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [completeAddress, setCompleteAddress] = useState('')

  const [selectedCurrency, setSelectedCurrency] = useState(1)

  useEffect(() => {
      if (!newPaymentMethod && selectedPaymentMethod) {
        setSelectedCurrency(selectedPaymentMethod.selectedCurrency)
        setBankAccountName(selectedPaymentMethod.bankAccountName)
        setBankAccountNo(selectedPaymentMethod.bankAccountNo)
        setBankBranch(selectedPaymentMethod.bankBranch)
        setMobileNo(selectedPaymentMethod.mobileNo)
        setLastName(selectedPaymentMethod.lastName)
        setFirstName(selectedPaymentMethod.firstName)
        setMiddleName(selectedPaymentMethod.middleName)
        setCompleteAddress(selectedPaymentMethod.completeAddress)
      } else {
        setSelectedCurrency(0)
        setBankAccountName('')
        setBankAccountNo('')
        setBankBranch('')
        setMobileNo('')
        setLastName('')
        setFirstName('')
        setMiddleName('')
        setCompleteAddress('')
      }
  }, [newPaymentMethod,  selectedPaymentMethod]);

  const getSavedPaymentMethods = (index) => {
    setSelectedCurrency(index)
  }

  const handleEnterKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  }

  const onSubmit = () => {
      if (currencyConstants[selectedCurrency].kind === 1) {
          if (bankAccountName === '' || bankAccountNo === '' || mobileNo === '' || bankBranch === '') {
              warningNotification("Please fill in the blank.", 2000)
              return false
          } else {
              setLastName(''); setFirstName(''); setMiddleName(''); setCompleteAddress('');
          }
      } else if (currencyConstants[selectedCurrency].kind === 2) {
          if (mobileNo === '') {
            warningNotification("Please fill in the blank.", 2000)
            return false
          } else {
            setBankAccountName(''); setBankAccountNo(''); setBankBranch('');
            setLastName(''); setFirstName(''); setMiddleName(''); setCompleteAddress('');
          }
      } else {
        if (lastName === '' || firstName === '' || middleName === '' || completeAddress === '' || mobileNo === '') {
            warningNotification("Please fill in the blank.", 2000)
            return false
        } else {
            setBankAccountName(''); setBankAccountNo(''); setBankBranch('');
        }
      }

      const paymentObj = {
          "userId": user.id,
          "selectedCurrency": selectedCurrency,
          "name": currencyConstants[selectedCurrency].label,
          "bankAccountName": bankAccountName,
          "bankAccountNo": bankAccountNo,
          "bankBranch": bankBranch,
          "mobileNo": mobileNo,
          "lastName": lastName,
          "firstName": firstName,
          "middleName": middleName,
          "completeAddress": completeAddress
      }
      if (!newPaymentMethod && selectedPaymentMethod) {
        paymentService.updatePaymentmethod(selectedPaymentMethod.id, paymentObj)
            .then(
                payment => {
                    successNotification('Successfully updated', 3000)
                    dispatch({type: 'set', openAddPayment: false})
                    history.push('/dashboard')
                },
                error => {
                    warningNotification(error, 3000)
                }
            );
      } else {
        paymentService.addPaymentmethod(paymentObj)
            .then(
                payment => {
                    successNotification('Successfully added new payment method.', 3000)
                    dispatch({type: 'set', openAddPayment: false})
                    history.push('/dashboard')
                },
                error => {
                    warningNotification(error, 3000)
                }
            );
      }
  }

  return (
    <CModal 
        show={openAddPayment} 
        onClose={handleClose}
        className="p-0 auth-modal"
        centered
        >
        <CModalBody className="p-3">
            <h3 className="p-3">Payment Method</h3>
            { newPaymentMethod && 
                <div className="px-3 add-payment">
                    <CSelect custom size="lg" className="add-payment-select" name="selectCurrency" id="selectCurrency" onChange={(e) => getSavedPaymentMethods(e.target.value)} value={selectedCurrency}>
                        {
                            currencyConstants.map((currency, index) => (
                                <option value={index}>{currency.label}</option>
                            ))
                        }
                    </CSelect>
                </div>
            }
            <div className={ currencyConstants[selectedCurrency].kind === 1 ? 'd-flex mt-2 px-3' : 'd-none'}>
                <RedditTextField
                        id="bank-account-name"
                        label="Bank account name"
                        placeholder="Bank account name"
                        fullWidth
                        value={bankAccountName}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onKeyDown={handleEnterKeyDown}
                        onChange={(e) => setBankAccountName(e.target.value)}
                        variant="filled"
                    />
            </div>
            <div className={ currencyConstants[selectedCurrency].kind === 1 ? 'd-flex mt-2 px-3' : 'd-none'}>
                <RedditTextField
                        id="bank-account-no"
                        label="Bank account no."
                        placeholder="Bank account no."
                        fullWidth
                        value={bankAccountNo}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onKeyDown={handleEnterKeyDown}
                        onChange={(e) => { if (e.target.value === '' || e.target.value === '0' || e.target.value === '0' || Number(e.target.value)) setBankAccountNo(e.target.value)  }}
                        variant="filled"
                    />
            </div>
            <div className={ currencyConstants[selectedCurrency].kind === 1 ? 'd-flex mt-2 px-3' : 'd-none'}>
                <RedditTextField
                        id="bank-branch"
                        label="Bank branch"
                        placeholder="Bank branch"
                        fullWidth
                        value={bankBranch}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onKeyDown={handleEnterKeyDown}
                        onChange={(e) => setBankBranch(e.target.value)}
                        variant="filled"
                    />
            </div>

            <div className={ currencyConstants[selectedCurrency].kind === 3 ? 'd-flex mt-2 px-3' : 'd-none'}>
                <RedditTextField
                        id="first-name"
                        label="First name"
                        placeholder="First name"
                        fullWidth
                        value={firstName}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onKeyDown={handleEnterKeyDown}
                        onChange={(e) => setFirstName(e.target.value)}
                        variant="filled"
                    />
            </div>

            <div className={ currencyConstants[selectedCurrency].kind === 3 ? 'd-flex mt-2 px-3' : 'd-none'}>
                <RedditTextField
                        id="middle-name"
                        label="Middle name"
                        placeholder="Middle name"
                        fullWidth
                        value={middleName}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onKeyDown={handleEnterKeyDown}
                        onChange={(e) => setMiddleName(e.target.value)}
                        variant="filled"
                    />
            </div>

            <div className={ currencyConstants[selectedCurrency].kind === 3 ? 'd-flex mt-2 px-3' : 'd-none'}>
                <RedditTextField
                        id="last-name"
                        label="Last name"
                        placeholder="Last name"
                        fullWidth
                        value={lastName}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onKeyDown={handleEnterKeyDown}
                        onChange={(e) => setLastName(e.target.value)}
                        variant="filled"
                    />
            </div>

            <div className={ currencyConstants[selectedCurrency].kind === 3 ? 'd-flex mt-2 px-3' : 'd-none'}>
                <RedditTextField
                        id="complete-address"
                        label="Complete address"
                        placeholder="Complete address"
                        fullWidth
                        value={completeAddress}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onKeyDown={handleEnterKeyDown}
                        onChange={(e) => setCompleteAddress(e.target.value)}
                        variant="filled"
                    />
            </div>

            <div className="d-flex mt-2 px-3">
                <RedditTextField
                        id="mobile-no"
                        label="Mobile no."
                        placeholder="Mobile no."
                        fullWidth
                        value={mobileNo}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onKeyDown={handleEnterKeyDown}
                        onChange={(e) => { if (e.target.value === '' || e.target.value === '0' || e.target.value === '0' || Number(e.target.value)) setMobileNo(e.target.value) }}
                        variant="filled"
                    />
            </div>
            
            <div className="d-flex mx-3 px-3">
                <CButton block className="button-exchange p-1 pt-2" onClick={onSubmit}>
                    { newPaymentMethod ? 
                        <h3>Save</h3> : <h3>Update</h3>
                    }
                </CButton>
            </div>
        </CModalBody>
    </CModal>
  )
}

export default AddPayment
