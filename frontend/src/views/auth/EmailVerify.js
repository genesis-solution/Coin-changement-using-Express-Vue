import React from 'react'
import {
  CWidgetSimple,
  CButton,
  CCol,
  CForm,
  CInvalidFeedback,
  CFormGroup,
  CLabel,
  CInput,
  CRow
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { userService } from '../../controllers/_services/user.service';
import { successNotification, warningNotification } from '../../controllers/_helpers';
import { useHistory } from 'react-router-dom';

const validationSchema = function (values) {
  return Yup.object().shape({
    verifyCode: Yup.string()
    .required('Please fill in the blank.')
  })
}

const validate = (getValidationSchema) => {
  return (values) => {
    const validationSchema = getValidationSchema(values)
    try {
      validationSchema.validateSync(values, { abortEarly: false })
      return {}
    } catch (error) {
      return getErrorsFromValidationError(error)
    }
  }
}

const getErrorsFromValidationError = (validationError) => {
  const FIRST_ERROR = 0
  return validationError.inner.reduce((errors, error) => {
    return {
      ...errors,
      [error.path]: error.errors[FIRST_ERROR],
    }
  }, {})
}

const initialValues = {
  verifyCode: ""
}

const EmailVerify = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const selectedUser = useSelector(state => state.selectedUser);
  
  const onSubmit = (values, { setSubmitting, setErrors }) => {
    userService.emailVerify(selectedUser.email, values.verifyCode, selectedUser.password)
      .then(
          res => {
            userService.login(selectedUser.email, selectedUser.password, false)
                .then(
                    result => {
                        dispatch({type: 'set', openSignin: false})
                        dispatch({type: 'set', openSignup: false})
                        dispatch({type: 'set', openEmailVerification: false})
                        dispatch({type: 'set', isLogin: true})
                        setSubmitting(false)
                        if (result.role) {
                          successNotification('Welcome Adminstrator', 3000)
                          dispatch({type: 'set', isAdmin: true})
                          history.push('admin')
                        } else {
                          successNotification('Welcome to Unicash', 3000)
                          history.push('dashboard')
                        }
                    },
                    error => {
                        warningNotification(error, 3000)
                        setSubmitting(false)
                    }
                );
            setSubmitting(false)
          },
          error => {
            warningNotification(error, 3000)
            setSubmitting(false)
          }
      );
  }

  return (
    <>
      <CWidgetSimple className="signin-widget text-left p-3 pt-0 pb-0 mx-auto">
        <h3 className="text-center mb-2">Email Verification</h3>
        <Formik
            initialValues={initialValues}
            validate={validate(validationSchema)}
            onSubmit={onSubmit}
          >
            {
              ({
                values,
                errors,
                touched,
                status,
                dirty,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                isValid,
                handleReset,
                setTouched
              }) => (
                <CRow>
                  <CCol>
                    <CForm onSubmit={handleSubmit} noValidate name='loginForm' className="text-left">
                      <CFormGroup>
                            <CLabel htmlFor="verifyCode">Enter the code.</CLabel>
                            <CInput type="password"
                                    name="verifyCode"
                                    id="verifyCode"
                                    placeholder="..."
                                    className="text-center"
                                    valid={!errors.verifyCode}
                                    invalid={touched.verifyCode && !!errors.verifyCode}
                                    required
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.verifyCode}/>
                            {/*<CInvalidFeedback>Required password containing at least: number, uppercase and lowercase letter, 8 characters</CInvalidFeedback>*/}
                            <CInvalidFeedback>{errors.verifyCode}</CInvalidFeedback>
                      </CFormGroup>
                      <CFormGroup>
                        <CButton type="submit" color="primary" className="signin-button mt-3 mb-0" disabled={isSubmitting || !isValid}>{isSubmitting ? 'Wait...' : 'Confirm'}</CButton>
                      </CFormGroup>
                    </CForm>
                  </CCol>
                </CRow>
              )}
          </Formik>
      </CWidgetSimple>
    </>
  )
}

export default EmailVerify
