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
// import {
//     MuiPickersUtilsProvider,
//     KeyboardTimePicker,
//     KeyboardDatePicker,
//   } from '@material-ui/pickers';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
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
      color: "green",
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
        color: "green"
      }
    },
    focused: {},
  }));

function RedditTextField(props) {
    const classes = useStylesReddit();
  
    return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
  }

const PersionalInfoSetting = () => {
 const dispatch = useDispatch()
 const history = useHistory()
 
 const [isSubmitting, setIsSubmitting] = useState(false)
 const [fullName, setFullName] = useState()
 const [email, setEmail] = useState()
 const [address, setAddress] = useState()
 const [birthDay, setBirthday] = useState()
 const [toDateFormat, setToDateFormat] = useState(false)

 const user = useSelector(state => state.user)
 
 useEffect(() => {
    if (localStorage.getItem('user') && user) {
        setFullName(user.fullName)
        setEmail(user.email)
        setAddress(user.address)
        setBirthday(user.birthday)
        
    }
 }, [user]);
  
  const onSubmit = () => {
      if (user && fullName !== '') {
          const newUser = {
              ...user,
              "fullName": fullName,
              "address": address,
              "birthday": birthDay
          }
          setIsSubmitting(true);
          userService.update(newUser).then(
              result => {
                  console.log(result)
                  dispatch({type: 'set', user: result})
                  successNotification("Updated your profile successfully", 3000)
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

    <CCard color="transparent" className="d-box-shadow1 d-border">
        <CCardBody className="card-setting m-0">

            <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="full-name"
                        label="Full name"
                        placeholder="Full name"
                        value={fullName}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        variant="filled"
                        onChange={(e) => setFullName(e.target.value)}
                    />
                }
            </div>
            <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="address"
                        label="Address"
                        placeholder="Address"
                        value={address}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        variant="filled"
                        onChange={(e) => setAddress(e.target.value)}
                    />
                }
            </div>
            <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="birthday"
                        label="Birth date"
                        placeholder="Birth date"
                        value={birthDay}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        type={toDateFormat? 'date' : 'text'}
                        variant="filled"
                        onChange={(e) => setBirthday(e.target.value)}
                        onFocus={() => setToDateFormat(true) }
                        onBlur={() => setToDateFormat(true) }
                    />
                }
            </div>

            <div className="d-flex mt-0 float-right">
                <CButton className="button-exchange" onClick={() => onSubmit()} disabled={isSubmitting}>
                    {isSubmitting ? 'Wait...' : 'Update'}
                </CButton>
            </div>
        </CCardBody>
    </CCard>

    )
}

export default PersionalInfoSetting
