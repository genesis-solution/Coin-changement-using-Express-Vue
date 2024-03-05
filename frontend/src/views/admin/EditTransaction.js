import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    CModal,
    CModalBody,
    CButton,
    CFormGroup,
    CInputRadio,
    CInput,
    CLabel,
    CCol,
    CInputGroupAppend,
    CInputGroupText,
    CInputGroup
  } from '@coreui/react'
import TextField from '@material-ui/core/TextField';
import {
    makeStyles,
    } from '@material-ui/core/styles';
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
    focused: {},
    }));

function RedditTextField(props) {
    const classes = useStylesReddit();
    
    return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
    }

const EditTransaction = () => {
  const dispatch = useDispatch()
  const editTransaction = useSelector(state => state.editTransaction)
  const selectedPaymentMethod = useSelector(state => state.selectedPaymentMethod)
  const selectedTransaction = useSelector(state => state.selectedTransaction)

  const handleClose = () => {
    dispatch({type: 'set', editTransaction: false})
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

  const [selectedStatus, setSelectedStatus] = useState('Processing')

  const onChangeTransaction = (value) => {
      if (selectedTransaction) {
          setSelectedStatus(value);
          selectedTransaction.status = value;
      }
  }

  useEffect(() => {
      if (selectedPaymentMethod) {
        setSelectedCurrency(selectedPaymentMethod.selectedCurrency)
        setBankAccountName(selectedPaymentMethod.bankAccountName)
        setBankAccountNo(selectedPaymentMethod.bankAccountNo)
        setBankBranch(selectedPaymentMethod.bankBranch)
        setMobileNo(selectedPaymentMethod.mobileNo)
        setLastName(selectedPaymentMethod.lastName)
        setFirstName(selectedPaymentMethod.firstName)
        setMiddleName(selectedPaymentMethod.middleName)
        setCompleteAddress(selectedPaymentMethod.completeAddress)

        setSelectedStatus('Processing')
        setFilePath('')
      }
  }, [selectedPaymentMethod]);

  const onSubmit = () => {
      if (selectedTransaction) {
          paymentService.updateTransaction(selectedTransaction.id, selectedTransaction).then(
              result => {
                  successNotification("Successfully processed", 3000);
                  dispatch({type: 'set', editTransaction: false})
              },
              err => {
                  console.log(err)
              }
          )
      }
  }

  const [filePath, setFilePath] = useState('');
  const [selectedFile, setSelectedFile] = useState();

  const inputFile = useRef() 

  const showOpenFileDialog = () => {
    inputFile.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        setFilePath(file.name);
        setSelectedFile(file);
    }
  };

  const [isSubmiting, setIsSubmiting] = useState(false);

  const fileUpload = () => {
      if (selectedFile && !isSubmiting) {
          setIsSubmiting(true)
          paymentService.fileUpload(selectedFile).then(
              result => {
                  if (!result.error) {
                      setIsSubmiting(false)
                      setFilePath(result.path);
                      if (selectedTransaction) selectedTransaction.image = result.path
                  } else {
                      setIsSubmiting(false)
                      warningNotification("Failed, please try again", 3);
                  }
              },
              err => {
                  warningNotification(err, 3000);
              }
          )
      }
  }

  return (
    <CModal 
        show={editTransaction} 
        onClose={handleClose}
        className="p-0 auth-modal"
        centered
        >
        <CModalBody className="p-3">
            <h3 className="p-3">Exchange</h3>

            { selectedTransaction && 
                <div className="d-flex mt-2 px-3">
                    <RedditTextField
                            id="order-id"
                            label="ORDER ID"
                            placeholder="Order ID"
                            fullWidth
                            value={selectedTransaction.orderId}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                </div>
            }

            { selectedTransaction && 
                <div className="d-flex mt-2 px-3">
                    <RedditTextField
                            id="amount"
                            label="AMOUNT"
                            placeholder="AMOUNT"
                            fullWidth
                            value={selectedTransaction.amount}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
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
                        variant="filled"
                    />
            </div>

            <div className="d-flex mt-2 px-3 mb-3">
                <RedditTextField
                        id="mobile-no"
                        label="Mobile no."
                        placeholder="Mobile no."
                        fullWidth
                        value={mobileNo}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="filled"
                    />
            </div>

            <div className="d-flex mt-3 px-3">
                <CFormGroup className="edit-transaction-checkbox">
                  <CCol md="4" lg="4" sm="12">
                    <CFormGroup variant="custom-checkbox">
                      <CInputRadio custom id="inline-checkbox1" name="inline-checkbox" color="success" value="Completed" checked={selectedStatus === 'Completed'}
                        onChange={(e) => {
                            onChangeTransaction(e.target.value)
                        }}
                      />
                      <CLabel variant="custom-checkbox" htmlFor="inline-checkbox1">Completed</CLabel>
                    </CFormGroup>
                  </CCol>
                  <CCol md="4" lg="4" sm="12">
                    <CFormGroup variant="custom-checkbox">
                      <CInputRadio custom id="inline-checkbox2" name="inline-checkbox" value="Canceled" checked={selectedStatus === 'Canceled'}
                        onChange={(e) => {
                            onChangeTransaction(e.target.value)
                        }}
                      />
                      <CLabel variant="custom-checkbox" htmlFor="inline-checkbox2">Canceled</CLabel>
                    </CFormGroup>
                  </CCol>
                  <CCol md="4" lg="4" sm="12">
                    <CFormGroup variant="custom-checkbox">
                      <CInputRadio custom id="inline-checkbox3" name="inline-checkbox" color="danger" value="Refunded" checked={selectedStatus === 'Refunded'}
                        onChange={(e) => {
                            onChangeTransaction(e.target.value)
                        }}
                      />
                      <CLabel variant="custom-checkbox" htmlFor="inline-checkbox3">Refunded</CLabel>
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
            </div>
            
            <div className="d-flex mt-3 px-3">
                <input type='file' accept=".png, .jpg, .jpeg" ref={inputFile} style={{display: 'none'}} onChange={handleFileChange}/>
                <CFormGroup className="file-input-box-group">
                  <CCol md="12" lg="12" sm="12">
                        <CInputGroup className="pr-0 mr-0">
                            <CInput className="file-input-box" placeholder="Browse File" onClick={showOpenFileDialog} value={filePath} />
                            <CInputGroupAppend className="mr-0 pr-0">
                                <CInputGroupText className="file-input-box-button" onClick={fileUpload} disabled={selectedFile}>
                                    { !isSubmiting ? 'Upload' : 'Uploading' }
                                </CInputGroupText>
                            </CInputGroupAppend>
                        </CInputGroup>
                  </CCol>
                </CFormGroup>
            </div>

            <div className="d-flex mx-3 px-3">
                <CButton block className="button-exchange p-1 pt-2" onClick={onSubmit} disabled={selectedStatus === 'Processing'}>
                    <h3>Save</h3>
                </CButton>
            </div>
        </CModalBody>
    </CModal>
  )
}

export default EditTransaction
