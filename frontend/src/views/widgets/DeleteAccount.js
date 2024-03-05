import React, { lazy, useState, useEffect } from 'react'
import {
  CCard,
  CButton,
  CCardBody,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import TextField from '@material-ui/core/TextField';
import {
    alpha,
    makeStyles,
  } from '@material-ui/core/styles';
// import {
//     MuiPickersUtilsProvider,
//     KeyboardTimePicker,
//     KeyboardDatePicker,
//   } from '@material-ui/pickers';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { userService } from '../../controllers/_services';
import InputMask from 'react-input-mask';
import { successNotification, warningNotification } from '../../controllers/_helpers';

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

const DeleteAccount = () => {
 const dispatch = useDispatch()
 const history = useHistory()
 
 const [isSubmitting, setIsSubmitting] = useState(false)
 const [email, setEmail] = useState()
 const [deleteConfirm, setDeleteConfirm] = useState(false)

 const user = useSelector(state => state.user)
 
 useEffect(() => {
    if (localStorage.getItem('user') && user) {
        setEmail(user.email)
        
    }
 }, [user]);
  
  const onSubmit = () => {
      if (user) {
          setIsSubmitting(true)
          userService.delete(user.id).then(
              result => {
                  dispatch({type: 'set', user: {}})
                  dispatch({type: 'set', isLogin: false})
                  dispatch({type: 'set', isAdmin: false})
                  dispatch({type: 'refresh'})
                  userService.logout()
                  history.push('/home')
                  successNotification("Deleted your profile successfully", 3000)
                  setIsSubmitting(false)
              },
              error => {
                  warningNotification(error, 3000)
                  setIsSubmitting(false)
              }
          )
      }
  }
  // render
  return (

    <CCard color="transparent" className="d-box-shadow1 d-border" style={{height: "222.5px"}}>
        <CCardBody className="card-setting m-0" style={{height: "222.5px"}}>

            <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="email"
                        label="Email"
                        placeholder="Type your email"
                        value={email}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        variant="filled"
                    />
                }
            </div>

            <div className="d-flex mt-4 float-right">
                <CButton className="button-exchange" onClick={() => setDeleteConfirm(true)} disabled={isSubmitting}>
                    {isSubmitting ? 'Wait...' : 'Delete Account'}
                </CButton>
            </div>

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
              <h5 className="text-center">Are you sure you want to delete your account?</h5>
            </CModalBody>
            <CModalFooter>
              <CButton color="danger" onClick={() => onSubmit()}>Delete</CButton>{' '}
              <CButton color="secondary" onClick={() => setDeleteConfirm(!deleteConfirm)}>Cancel</CButton>
            </CModalFooter>
          </CModal>
        </CCardBody>
    </CCard>

    )
}

export default DeleteAccount
