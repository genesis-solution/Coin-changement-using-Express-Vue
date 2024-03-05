import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    CModal,
    CModalBody,
    CButton,
    CFormGroup,
    CInputRadio,
    CLabel,
    CCol,
  } from '@coreui/react'
import TextField from '@material-ui/core/TextField';
import {
    makeStyles,
    } from '@material-ui/core/styles';
import { userService } from '../../controllers/_services';
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

const EditUser = () => {
  const dispatch = useDispatch()

  const editUser = useSelector(state => state.editUser)
  const selectedUser = useSelector(state => state.selectedUser)

  const handleClose = () => {
    dispatch({type: 'set', editUser: false})
  };

  const [selectedStatus, setSelectedStatus] = useState('Active')

  const onChangeTransaction = (value) => {
      if (selectedUser) {
          setSelectedStatus(value);
          selectedUser.status = value;
      }
  }

  useEffect(() => {
      if (selectedUser) {
        setSelectedStatus(selectedUser.status)
      }
  }, [selectedUser]);

  const onSubmit = () => {
      if (selectedUser) {
            userService.update(selectedUser).then(
              result => {
                  successNotification("Successfully processed", 3000);
                  dispatch({type: 'set', editUser: false})
              },
              err => {
                  console.log(err)
              }
            )
      }
  }

  const [isSubmiting, setIsSubmiting] = useState(false);

  return (
    <CModal 
        show={editUser} 
        onClose={handleClose}
        className="p-0 auth-modal"
        centered
        >
        <CModalBody className="p-3">
            <h3 className="p-3">User Information</h3>

            { selectedUser && 
                <div className="d-flex mt-2 px-3">
                    <RedditTextField
                            id="fullname"
                            label="FULL NAME"
                            placeholder="Full name"
                            fullWidth
                            value={selectedUser.fullName}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                </div>
            }

            { selectedUser && selectedUser.address && 
                <div className="d-flex mt-2 px-3">
                    <RedditTextField
                            id="address"
                            label="ADDRESS"
                            placeholder="ADDRESS"
                            fullWidth
                            value={selectedUser.address}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                </div>
            }

            { selectedUser && selectedUser.birthday && 
                <div className="d-flex mt-2 px-3">
                    <RedditTextField
                            id="address"
                            label="BIRTH DAY"
                            placeholder="BIRTH DAY"
                            fullWidth
                            value={selectedUser.birthday}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                </div>
            }

            <div className="d-flex mt-3 px-3">
                <CFormGroup className="edit-transaction-checkbox">
                  <CCol md="4" lg="4" sm="12">
                    <CFormGroup variant="custom-checkbox">
                      <CInputRadio custom id="inline-checkbox1" name="inline-checkbox" color="success" value="Block" checked={selectedStatus === 'Block'}
                        onChange={(e) => {
                            onChangeTransaction(e.target.value)
                        }}
                      />
                      <CLabel variant="custom-checkbox" htmlFor="inline-checkbox1">Block</CLabel>
                    </CFormGroup>
                  </CCol>
                  <CCol md="4" lg="4" sm="12">
                    <CFormGroup variant="custom-checkbox">
                      <CInputRadio custom id="inline-checkbox2" name="inline-checkbox" value="Suspend" checked={selectedStatus === 'Suspend'}
                        onChange={(e) => {
                            onChangeTransaction(e.target.value)
                        }}
                      />
                      <CLabel variant="custom-checkbox" htmlFor="inline-checkbox2">Suspend</CLabel>
                    </CFormGroup>
                  </CCol>
                  <CCol md="4" lg="4" sm="12">
                    <CFormGroup variant="custom-checkbox">
                      <CInputRadio custom id="inline-checkbox3" name="inline-checkbox" color="danger" value="Active" checked={selectedStatus === 'Active'}
                        onChange={(e) => {
                            onChangeTransaction(e.target.value)
                        }}
                      />
                      <CLabel variant="custom-checkbox" htmlFor="inline-checkbox3">Active</CLabel>
                    </CFormGroup>
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

export default EditUser
