import React, { useState, useEffect } from 'react'
import {
  CWidgetSimple,
  CButton,
  CImg
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux';
import { userService } from '../../controllers/_services/user.service';
import { successNotification, warningNotification } from '../../controllers/_helpers';
import TextField from '@material-ui/core/TextField';
import {
    alpha,
    makeStyles,
  } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStylesReddit = makeStyles((theme) => ({
  root: {
    border: "1px solid lightgray",
    overflow: 'hidden',
    backgroundColor: '#fcfcfb',
    fontWeight: '400',
    lineHeight: '18px',
    fontSize: '18px',
    height: '55px',
    color: "black",
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: '#fff',
    },
    '&$focused': {
      backgroundColor: '#fff',
      boxShadow: `${alpha("#24242f", 0.25)} 0 0 0 1px`,
      borderRadius: 2,
      borderColor: "#24242f",
      borderBottom: "1px solid black",
      color: "black"
    }
  },
  focused: {},
}));

function RedditTextField(props) {
  const classes = useStylesReddit();

  return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
}

const Signup = () => {
  const dispatch = useDispatch()
  const selectedUser = useSelector(state => state.selectedUser);
  const history = useHistory()

  const [confirmationCode, setConfirmationCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [errMessageForConfirmationCode, setErrMessageForConfirmationCode] = useState('')
  const [errMessageForNewPassword, setErrMessageForNewPassword] = useState('')
  const [errMessageForConfirmPassword, setErrMessageForConfirmPassword] = useState('')
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)

  if (!selectedUser || !selectedUser.email) {
    dispatch({type: 'set', openSignup: false})
    dispatch({type: 'set', openSignin: false})
    dispatch({type: 'set', openEmailVerification: false})
    dispatch({type: 'set', forgotPassword1: true})
    dispatch({type: 'set', forgotPassword2: false})
    return;
  }

  const handleEnterKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  }

  const onSubmit = () => {
    if (selectedUser && JSON.stringify(selectedUser) !== '{}')
    userService.forgotPassword({
      "code": confirmationCode,
      "email": selectedUser.email,
      "password": password
    })
        .then(
            user => { 
                successNotification("Your password is changed successfully.", 3000);
                onClose()
                dispatch({type: 'set', openSignin: true})
            },
            error => {
                warningNotification(error, 3000);
            }
        );    
  }

  const onClose = () => {
    dispatch({type: 'set', openSignup: false})
    dispatch({type: 'set', openEmailVerification: false})
    dispatch({type: 'set', forgotPassword1: false})
    dispatch({type: 'set', forgotPassword2: false})
    dispatch({type: 'set', openSignin: false})
  }

//   useEffect(() => {
//     if (confirmationCode !== '' && password !== '' && errMessageForConfirmationCode === '' && errMessageForNewPassword === '' && 
//         errMessageForConfirmPassword === '' && password === confirmPassword) {
//       setSubmitButtonDisabled(false);
//     } else {
//       setSubmitButtonDisabled(true);
//     }
//   }, [confirmationCode, password, confirmPassword])

  return (
    <>
      <CWidgetSimple className="signin-widget text-left p-3 pt-0 pb-0 mx-auto">
        <div className="float-right" style={{marginRight: '-20px'}}>
          <CImg src={'img/icons8-close.png'} style={{cursor: 'pointer'}} onClick={() => onClose()}></CImg>
        </div>
        <h2 className="text-left signin-header-title">Forgot password?</h2>
        <h5 className="text-left signin-header-desc">Please confirm your email and then reset your password.</h5>
        <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="verify-code"
                        label="Confirmation code"
                        placeholder="Type the confirmation code."
                        value={confirmationCode}
                        helperText={errMessageForConfirmationCode && errMessageForConfirmationCode !== '' ? errMessageForConfirmationCode : '' }
                        error={errMessageForConfirmationCode && errMessageForConfirmationCode !== ''}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        variant="filled"
                        onKeyDown={handleEnterKeyDown}
                        onBlur={() => {
                          if (!confirmationCode || confirmationCode === '') setErrMessageForConfirmationCode('Full name is required')
                          else setErrMessageForConfirmationCode('')
                        }}
                        onChange={(e) => {
                          setConfirmationCode(e.target.value); }}
                    />
                }
            </div>

            <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="password"
                        label="Password"
                        placeholder="Type your password"
                        value={password}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        type="password"
                        fullWidth
                        variant="filled"
                        onKeyDown={handleEnterKeyDown}
                        helperText={errMessageForNewPassword && errMessageForNewPassword !== '' ? errMessageForNewPassword : '' }
                        error={errMessageForNewPassword && errMessageForNewPassword !== ''}
                        onBlur={() => {
                          if (!password || password === '') setErrMessageForNewPassword('Password is required')
                          else if (password.length < 6) setErrMessageForNewPassword('Password hat to be at least 6 characters!')
                          else if (!password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)) setErrMessageForNewPassword('Password must contain: numbers, uppercase and lowercase letters');
                          else setErrMessageForNewPassword('')
                        }}
                        onChange={(e) => { setPassword(e.target.value); }}
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
                        onKeyDown={handleEnterKeyDown}
                        helperText={errMessageForConfirmPassword && errMessageForConfirmPassword !== '' ? errMessageForConfirmPassword : '' }
                        error={errMessageForConfirmPassword && errMessageForConfirmPassword !== ''}
                        onBlur={() => {
                          if (!confirmPassword || confirmPassword === '') setErrMessageForConfirmPassword('Password confirmation is required!')
                          else if (confirmPassword !== password) setErrMessageForConfirmPassword('Passwords must match')
                          else setErrMessageForConfirmPassword('')
                        }}
                        onChange={(e) => { setConfirmPassword(e.target.value); }}
                    />
                }
            </div>

            <div className="d-flex mt-1">
                <CButton block className="button-exchange p-2" onClick={() => onSubmit()} disabled={submitButtonDisabled}>
                    <h3>Reset your password</h3>
                </CButton>
            </div>
            <div className="mt-1 text-center">
              <h5 className="signin-header-desc">Already have an account? <span className="span-underline" onClick={() => {
                onClose()
                dispatch({type: 'set', openSignin: true})
                }}>Sign in</span></h5>
            </div>
      </CWidgetSimple>
    </>
  )
}

export default Signup
