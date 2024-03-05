import React, { lazy, useState, useEffect } from 'react'
import {
  CCard,
  CButton,
  CCardBody
} from '@coreui/react'
import TextField from '@material-ui/core/TextField';
import {
    alpha,
    makeStyles,
  } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
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
      color: "black",
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
        color: "black"
      }
    },
    focused: {},
  }));

  function RedditTextField(props) {
    const classes = useStylesReddit();
  
    return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
  }

  const ChangePassword = () => {
  const dispatch = useDispatch()
  const history = useHistory()
 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const user = useSelector(state => state.user)
  
  const [errMessageForOldPassword, setErrMessageForOldPassword] = useState('')
  const [errMessageForNewPassword, setErrMessageForNewPassword] = useState('')
  const [errMessageForConfirmPassword, setErrMessageForConfirmPassword] = useState('')
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)

  const handleBlurOldPassword = () => {
      if (!oldPassword || oldPassword === '') setErrMessageForOldPassword('Old password is required.')
      else {
        setErrMessageForOldPassword('')
        if (errMessageForNewPassword === '' && errMessageForConfirmPassword === '' && newPassword !== '' && newPassword === confirmPassword) {
            setSubmitButtonDisabled(false);
          } else {
            setSubmitButtonDisabled(true);
          }
      }
  }

  const handleBlurNewPassword = (e) => {
        const keyV = e.target.value;
        setNewPassword(keyV)
        if (!keyV || keyV === '') setErrMessageForNewPassword('New password is required')
        else if (keyV.length < 6) setErrMessageForNewPassword('Password have to be at least 6 characters!')
        else if (!keyV.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)) setErrMessageForNewPassword('Password must contain: numbers, uppercase and lowercase letters');
        else {
            setErrMessageForNewPassword('')
            if (errMessageForOldPassword === '' && errMessageForConfirmPassword === '' && keyV === confirmPassword && oldPassword !== '') {
                setSubmitButtonDisabled(false);
            } else {
                setSubmitButtonDisabled(true);
            }

            if (keyV !== confirmPassword) {
                setErrMessageForConfirmPassword('Passwords must match')
            }
        }
    }

const handleBlurConfirmPassword = (e) => {
        const keyV = e.target.value;
        setConfirmPassword(keyV);
        if (keyV !== newPassword) setErrMessageForConfirmPassword('Passwords must match')
        else {
            setErrMessageForConfirmPassword('');
            if (errMessageForOldPassword === '' && errMessageForNewPassword === '' && newPassword !== '' && keyV === newPassword && oldPassword !== '') {
                setSubmitButtonDisabled(false);
            } else {
                setSubmitButtonDisabled(true);
            }
        }
    }

  const onSubmit = () => {
      if (user && JSON.stringify(user) !== '{}') {
          
          setIsSubmitting(true);
          userService.updatePassword({
              "id": user.id,
              "oldPassword": oldPassword,
              "password": newPassword
          }).then(
              result => {
                  console.log(result);
                  successNotification("Successfully password changed!", 3000)
                  setIsSubmitting(false)
              },
              error => {
                  console.log(error);
                  warningNotification(error, 3000)
                  setIsSubmitting(false)
              }
          )
          
      }
  }
  // render
  return (

    <CCard color="transparent" className="d-box-shadow1 d-border">
        <CCardBody className="card-setting m-0">

            <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="old-password"
                        label="Old password"
                        placeholder="Type old password"
                        value={oldPassword}
                        helperText={errMessageForOldPassword && errMessageForOldPassword !== '' ? errMessageForOldPassword : '' }
                        error={errMessageForOldPassword && errMessageForOldPassword !== ''}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        type="password"
                        fullWidth
                        variant="filled"
                        onBlur={handleBlurOldPassword}
                        onFocus={handleBlurOldPassword}
                        onChange={(e) => { setOldPassword(e.target.value); handleBlurOldPassword(); }}
                    />
                }
            </div>

            <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="new-password"
                        label="New password"
                        placeholder="Type new password"
                        value={newPassword}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        type="password"
                        fullWidth
                        variant="filled"
                        helperText={errMessageForNewPassword && errMessageForNewPassword !== '' ? errMessageForNewPassword : '' }
                        error={errMessageForNewPassword && errMessageForNewPassword !== ''}
                        onChange={handleBlurNewPassword}
                    />
                }
            </div>

            <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="confirm-password"
                        label="Repeat new password"
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        type="password"
                        fullWidth
                        variant="filled"
                        helperText={errMessageForConfirmPassword && errMessageForConfirmPassword !== '' ? errMessageForConfirmPassword : '' }
                        error={errMessageForConfirmPassword && errMessageForConfirmPassword !== ''}
                        onChange={handleBlurConfirmPassword}
                    />
                }
            </div>

            <div className="d-flex mt-0 float-right">
                <CButton className="button-exchange" onClick={() => onSubmit()} disabled={submitButtonDisabled}>
                    {isSubmitting ? 'Wait...' : 'Change'}
                </CButton>
            </div>
        </CCardBody>
    </CCard>

    )
}

export default ChangePassword
