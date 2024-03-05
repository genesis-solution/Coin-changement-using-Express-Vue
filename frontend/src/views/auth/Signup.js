import React, { useState, useEffect } from 'react'
import {
  CWidgetSimple,
  CButton,
  CImg
} from '@coreui/react'
import { useDispatch } from 'react-redux';
import { userService } from '../../controllers/_services';
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
  const history = useHistory()

  const [ethAddress, setEthAddress] = useState('0xbf4DA3faD3d4a1A2d58fA61AbE170aED94cF394f')
  const [ethKeys, setEthKeys] = useState('0xb260131f1858cb7d7a367f7f65fb4ece273aaea901bdf2aa0c8868ea9bcd8f13')
  const [btcAddress, setBtcAddress] = useState('1KAsWF4vjwnxHouBAWgzhuNgnKUYUeWyrf')
  const [btcKeys, setBtcKeys] = useState('Kz28CifCRty176kvGuvT3R9x9JiWKdsnVnKBSeyzoZqsCsWoq9tC')

  const handleEnterKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  }

  const onSubmit = () => {
    setIsSubmitting(true);
    userService.register({
      "fullName": fullName,
      "email": email,
      "password": password,
      "ETH_ADDRESS": ethAddress,
      "ETH_KEYS": ethKeys,
      "BTC_ADDRESS": btcAddress,
      "BTC_KEYS": btcKeys
    })
    .then(
        user => { 
          if (user && user.status) {
            successNotification(user.message, 3000);
            dispatch({type: 'set', openSignup: false})
            dispatch({type: 'set', openSignin: true})
            dispatch({type: 'set', openEmailVerification: false})
            setIsSubmitting(false);
          } else {
            warningNotification('Failed', 3000);
            setIsSubmitting(false);
          }
        },
        error => {
            warningNotification(error, 3000);
            setIsSubmitting(false);
        }
    );
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fullName, setFullName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()

  const [errMessageForFullName, setErrMessageForFullName] = useState('')
  const [errMessageForEmail, setErrMessageForEmail] = useState('')
  const [errMessageForNewPassword, setErrMessageForNewPassword] = useState('')
  const [errMessageForConfirmPassword, setErrMessageForConfirmPassword] = useState('')
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)

  useEffect(() => {
    if (fullName !== '' && email !== '' && password !== '' && errMessageForFullName === '' && errMessageForEmail === '' && errMessageForNewPassword === '' && 
        errMessageForConfirmPassword === '' && password === confirmPassword) {
      setSubmitButtonDisabled(false);
    } else {
      setSubmitButtonDisabled(true);
    }
  }, [fullName, email, password, confirmPassword])

  return (
    <>
      <CWidgetSimple className="signin-widget text-left p-3 pt-0 pb-0 mx-auto">
        <div className="float-right" style={{marginRight: '-20px'}}>
          <CImg src={'img/icons8-close.png'} style={{cursor: 'pointer'}} onClick={() => dispatch({type: 'set', openSignup: false})}></CImg>
        </div>
        <h2 className="text-left signin-header-title">Welcome to Unicash<span className="text-success">.</span></h2>
        <h5 className="text-left signin-header-desc">Login or register to continue Exchange</h5>
        <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="full-name"
                        label="Full name"
                        placeholder="Type full name"
                        value={fullName}
                        helperText={errMessageForFullName && errMessageForFullName !== '' ? errMessageForFullName : '' }
                        error={errMessageForFullName && errMessageForFullName !== ''}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onKeyDown={handleEnterKeyDown}
                        fullWidth
                        variant="filled"
                        onBlur={() => {
                          if (!fullName || fullName === '') setErrMessageForFullName('Full name is required')
                          else setErrMessageForFullName('')
                        }}
                        onChange={(e) => {
                          setFullName(e.target.value); }}
                    />
                }
            </div>

            <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="email"
                        label="Email"
                        placeholder="Type your email"
                        value={email}
                        helperText={errMessageForEmail && errMessageForEmail !== '' ? errMessageForEmail : '' }
                        error={errMessageForEmail && errMessageForEmail !== ''}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        variant="filled"
                        onKeyDown={handleEnterKeyDown}
                        onBlur={() => {
                          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                          if (!email || email === '') setErrMessageForEmail('Email is required')
                          else if (!re.test(String(email).toLowerCase())) setErrMessageForEmail('Invalid email address')
                          else setErrMessageForEmail('')
                        }}
                        onChange={(e) => {
                          setEmail(e.target.value); }}
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
                        helperText={errMessageForNewPassword && errMessageForNewPassword !== '' ? errMessageForNewPassword : '' }
                        error={errMessageForNewPassword && errMessageForNewPassword !== ''}
                        onKeyDown={handleEnterKeyDown}
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
                        helperText={errMessageForConfirmPassword && errMessageForConfirmPassword !== '' ? errMessageForConfirmPassword : '' }
                        error={errMessageForConfirmPassword && errMessageForConfirmPassword !== ''}
                        onKeyDown={handleEnterKeyDown}
                        onBlur={() => {
                          if (!confirmPassword || confirmPassword === '') setErrMessageForConfirmPassword('Password confirmation is required!')
                          else if (confirmPassword !== password) setErrMessageForConfirmPassword('Passwords must match')
                          else setErrMessageForConfirmPassword('')
                        }}
                        onChange={(e) => { setConfirmPassword(e.target.value); }}
                    />
                }
            </div>

            <div className="d-flex mt-2">
              <h5 className="text-left signin-header-desc">By signing in or creating an account. you agree with our <span className="span-underline" onClick={() => {
                history.push('/terms');  dispatch({type: 'set', openSignin: false}); dispatch({type: 'set', openSignup: false})}}
                >Terms of Use</span> and <span className="span-underline" onClick={() => {
                  dispatch({type: 'set', openSignin: false}); dispatch({type: 'set', openSignup: false}); history.push('/privacy')
                }}>Privacy Policy</span></h5>
            </div>

            <div className="d-flex mt-1">
                <CButton block className="button-exchange p-2" onClick={() => onSubmit()} disabled={submitButtonDisabled || isSubmitting}>
                    <h3>Sign up</h3>
                </CButton>
            </div>
            <div className="mt-1 text-center">
              <h5 className="signin-header-desc">Already have an account? <span className="span-underline" onClick={() => {
                dispatch({type: 'set', openSignup: false})
                dispatch({type: 'set', openSignin: true})
                }}>Sign in</span></h5>
            </div>
      </CWidgetSimple>
    </>
  )
}

export default Signup
