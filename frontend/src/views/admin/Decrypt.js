import React, { useEffect, useState } from 'react'
import {
    CCard,
    CCol,
    CRow,
    CButton,
    CFormGroup,
    CLabel,
    CInputCheckbox
} from '@coreui/react';
import TextField from '@material-ui/core/TextField';
import {
    alpha,
    makeStyles,
    } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { paymentService } from '../../controllers/_services';
import { warningNotification, successNotification } from '../../controllers/_helpers';

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

const AdminDecrypt = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  dispatch({type: 'set', darkMode: false})

  const user = useSelector(state => state.user)

  if (!localStorage.getItem('user') || !user || !user.role) {
    dispatch({type: 'set', darkMode: true})
    history.push('/home')
  }

  const [addressKey, setAddressKey] = useState('');
  const [decryptedKey, setDecryptedKey] = useState('');

  const [isCopied, setIsCopied] = useState(false);
  const onCopyClicked = () => {
    navigator.clipboard.writeText(decryptedKey);
    setIsCopied(true)
  }

  const onSubmit = () => {
    paymentService.getDecryptedKey({key: addressKey}).then(
        result => {
          setDecryptedKey(result.result)
        },
        err => {
          warningNotification(err, 3000);
        }
      )
  }

  return (
    <>
      <CCard color="transparent" className="transaction-table  d-box-shadow1 d-border">
        <CRow>
            <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="12" lg="6" md="6">
                <RedditTextField
                        id="address-key"
                        label="ADDRESS KEY"
                        placeholder="Enter the key..."
                        fullWidth
                        value={addressKey}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => { setAddressKey(e.target.value) }}
                        variant="filled"
                    />
            </CCol>
            { decryptedKey && 
                <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="12" lg="6" md="6" style={{fontSize: '18px'}}>
                    <div className="d-flex mb-1">
                        <div className="flex-grow-1">
                            <RedditTextField
                                id="decrypted-key"
                                label="Decrypted Key"
                                placeholder="..."
                                value={decryptedKey}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="filled"
                                fullWidth
                            />
                        </div>
                        <div className="mr-auto pt-2">
                            { !isCopied && 
                                <CButton block className="copy-button mt-3" onClick={() => onCopyClicked()}>Copy</CButton>
                            }
                            { isCopied && 
                                <CButton block className="copied-button mt-3">Copied</CButton>
                            }
                        </div>
                    </div>
                </CCol>
            }
        </CRow>
      </CCard>

      <CRow>
        <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="12" lg="12" md="12">
            <CButton  className="button-exchange" onClick={onSubmit}>
              Change
            </CButton>
        </CCol>
      </CRow>
    </>
  )
}

export default AdminDecrypt
