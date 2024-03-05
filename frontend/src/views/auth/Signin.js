import React, { useEffect, useState } from 'react'
import {
  CWidgetSimple,
  CButton,
  CImg
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import { userService } from '../../controllers/_services/user.service';
import { successNotification, warningNotification } from '../../controllers/_helpers';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import {
    alpha,
    makeStyles,
  } from '@material-ui/core/styles';

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
  
const Signin = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const [errMessageForEmail, setErrMessageForEmail] = useState('')
  const [errMessageForNewPassword, setErrMessageForNewPassword] = useState('')

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)

  useEffect(() => {
    if (email !== '' && password !== '' && errMessageForEmail === '' && errMessageForNewPassword === '' ) {
      setSubmitButtonDisabled(false);
    } else {
      setSubmitButtonDisabled(true);
    }
  }, [ email, password ])

  const handleEnterKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  }

  const onSubmit = () => {
    userService.login(email, password, true)
      .then(
          result => {
            if (result.is2FA || result.role) {
              warningNotification("Please check your email to verify the account.", 3000)
              dispatch({type: 'set', openSignin: false})
              dispatch({type: 'set', openSignup: false})
              dispatch({type: 'set', selectedUser: {
                                        "email": email,
                                        "password": password
                                      }})
              dispatch({type: 'set', openEmailVerification: true})
              userService.logout();
            } else {
              dispatch({type: 'set', openSignin: false})
              dispatch({type: 'set', openSignup: false})
              dispatch({type: 'set', openEmailVerification: false})
              dispatch({type: 'set', isLogin: true})
              successNotification('Welcome to Unicash', 3000)
              history.push('dashboard')
            }
          },
          error => {
            if (error === 'check-email') {
              warningNotification("Please check your email to verify the account.", 3000)
              dispatch({type: 'set', openSignin: false})
              dispatch({type: 'set', openSignup: false})
              dispatch({type: 'set', selectedUser: {
                                        "email": email,
                                        "password": password
                                      }})
              dispatch({type: 'set', openEmailVerification: true})
            } else {
              warningNotification(error, 3000)
            }
          }
      );
  }

  return (
    <>
      <CWidgetSimple className="signin-widget text-left p-3 pt-0 pb-0 mx-auto">
        <div className="float-right" style={{marginRight: '-20px'}}>
          <CImg src={'img/icons8-close.png'} style={{cursor: 'pointer'}} onClick={() => dispatch({type: 'set', openSignin: false})}></CImg>
        </div>
        <h2 className="text-left signin-header-title">Welcome to Unicash<span className="text-success">.</span></h2>
        <h5 className="text-left signin-header-desc">Login or register to continue Exchange</h5>
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
                          else setErrMessageForNewPassword('')
                        }}
                        onChange={(e) => { setPassword(e.target.value); }}
                    />
                }
            </div>

            <div className="d-flex mt-2">
              <h5 className="text-left signin-header-desc">By signing in or creating an account. you agree with our <span className="span-underline" onClick={() => {
                history.push('/terms'); dispatch({type: 'set', openSignin: false}); dispatch({type: 'set', openSignup: false})
              }}>Terms of Use</span> and <span className="span-underline" onClick={() => {
                history.push('/privacy');  dispatch({type: 'set', openSignin: false}); dispatch({type: 'set', openSignup: false})}
                }>Privacy Policy</span></h5>
            </div>

            <div className="mt-0 text-right p-0">
              <h5 className="text-right signin-header-desc p-0 m-0"><span className="span-underline" onClick={() => {
                dispatch({type: 'set', openSignin: false})
                dispatch({type: 'set', openSignup: false})
                dispatch({type: 'set', forgotPassword1: true})
              }}>Forgot password?</span></h5>
            </div>

            <div className="d-flex mt-0">
                <CButton block className="button-exchange p-2" onClick={() => onSubmit()} disabled={submitButtonDisabled}>
                    <h3>Sign in</h3>
                </CButton>
            </div>
            
            <div className="mt-1 text-center mb-0">
              <h5 className="signin-header-desc">No account yet? <span className="span-underline" onClick={() => {
                dispatch({type: 'set', openSignin: false})
                dispatch({type: 'set', openSignup: true})
                }}>Sign up</span></h5>
            </div>
      </CWidgetSimple>
    </>
  )
}

export default Signin
