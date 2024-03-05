import React, { lazy, useState, useEffect } from 'react'
import {
  CRow,
  CCol,
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
import { paymentService } from '../../controllers/_services/payment.service';

const Desc = lazy(() => import('./Desc'))
const DropdownCurrency = lazy(() => import('./DropdownCurrency'));

const useStylesReddit = makeStyles((theme) => ({
    root: {
      border: 'none',
      overflow: 'hidden',
      backgroundColor: '#fcfcfb',
      fontWeight: '700',
      lineHeight: '24px',
      fontSize: '24px',
      color: 'green',
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
        // color: "#24242f",
        color: 'green',
      }
    },
    focused: {},
  }));

function RedditTextField(props) {
    const classes = useStylesReddit();
  
    return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
  }

const WidgetsExchange = () => {

    const dispatch = useDispatch()
    const history = useHistory()
    const isLogin = useSelector(state => state.isLogin)

    const [inputSend, setInputSend] = useState(0.1);
    const [inputReceive, setInputReceive] = useState();

    const [yousend, setYousend] = useState();
    const [youreceive, setYoureceive] = useState();
    const [pricePerUnit, setPricePerUnit] = useState();
    const [conversionRateBetweenUSDPHP, setConversionRateBetweenUSDPHP] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onChangeOnSend = e => {
        const inputValue = e.target.value;
        if (inputValue === '' || inputValue === '0' || inputValue === '0.' || inputValue === '0.0' || inputValue === '0.00' || inputValue === '0.000' 
        || inputValue === '0.0000' || inputValue === '0.00000' || inputValue === '0.000000' || inputValue === '0.0000000' || inputValue === '0.00000000' || Number(inputValue)) {
            setInputSend(inputValue)
        }
        setIsSubmitting(false);
    };
    const onChangeOnReceive = e => {
        const inputValue = e.target.value;
        if (inputValue === '' || inputValue === '0' || inputValue === '0.' || Number(inputValue)) {
            setInputReceive(inputValue)
            // if (Number(inputValue) && yousend && conversionRateBetweenUSDPHP && pricePerUnit) {
            //     setInputSend(Math.floor(Number(inputReceive) / pricePerUnit / conversionRateBetweenUSDPHP * 10000) / 10000)
            // }
        }
    };
    const onClickExchangeNow = () => {
        if (isLogin) {
            history.push('dashboard')
        } else {
            dispatch({type: 'set', openSignup: true})
        }
    }

    useEffect(() => {
        if (yousend) {
            setIsSubmitting(true)
            paymentService.getConversionPrice(yousend.label + 'USDT')
                .then(
                    price => {
                        if (price.status) {
                            setConversionRateBetweenUSDPHP(Number(price.conversionRate));
                            const priceRate = Number(JSON.parse(price.data)['price'])
                            if (!isNaN(priceRate)) {
                                setPricePerUnit(priceRate)
                                setInputReceive(Math.floor((Number(inputSend) * priceRate * Number(price.conversionRate)) * 100) / 100)
                            }
                            else {
                                setPricePerUnit(null);
                                setInputReceive('');
                            }
                            setIsSubmitting(false)
                        }
                    },
                    error => {
                        console.log(error);
                    }
                )
        }
    }, [yousend, inputSend]);
    // render
    return (
        <>
            <CRow>
                <CCol sm="12" lg="5">
                    <CCard color="transparent">
                        <CCardBody className="card-exchange">
                            <div className="d-flex mt-2">
                                <div className="flex-grow-1">
                                    <RedditTextField
                                        id="you-send"
                                        label="You send"
                                        placeholder="..."
                                        value={inputSend}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="filled"
                                        style={{borderRight: "1px solid lightgray"}}
                                        onChange={onChangeOnSend}
                                        />
                                </div>
                                <div className="mr-auto">
                                    <DropdownCurrency listType="yousend" passDropListData={setYousend} />
                                </div>
                            </div>
                            <div className="d-flex mt-2">
                                <div>
                                    <p className="card-exchange-rate">
                                        { yousend && 
                                            <span className="card-exchange-rate">
                                                1 {yousend.label} =
                                            </span>
                                        }
                                        <span className="card-exchange-rate">
                                            { pricePerUnit ? Math.floor(pricePerUnit * conversionRateBetweenUSDPHP * 100) / 100 : '...' }
                                        </span>
                                        { youreceive && 
                                            <span className="card-exchange-rate">
                                                PHP
                                            </span>
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex mt-2">
                                <div className="flex-grow-1">
                                    <RedditTextField
                                        id="you-receive"
                                        label="You receive"
                                        placeholder="..."
                                        value={inputReceive}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="filled"
                                        style={{borderRight: "1px solid lightgray"}}
                                        onChange={onChangeOnReceive}
                                        />
                                </div>
                                <div className="mr-auto">
                                    <DropdownCurrency listType="youreceive" passDropListData={setYoureceive}/>
                                </div>
                            </div>
                            <div className="d-flex mt-3">
                                <CButton block className="button-exchange" onClick={onClickExchangeNow} disabled={isSubmitting || !yousend || !youreceive}>
                                    Exchange now
                                </CButton>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol sm="12" lg="7">
                    <Desc />
                </CCol>
            </CRow>
        </>
        )
}

export default WidgetsExchange
