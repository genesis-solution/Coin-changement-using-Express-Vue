import React, { useState, useEffect } from 'react'
import {
  CButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from '@coreui/react'
import clsx from 'clsx';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { yousendConstants, currencyConstants } from '../../controllers/_constants';
import { paymentService } from '../../controllers/_services/payment.service';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(0),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
      display: 'none'
    },
    textField: {
      width: '100%',
      minWidth: '370px',
      backgroundColor: 'white',
      color: 'black'
    },
  }));

const DropdownCurrency = ({listType, passDropListData}) => {
  const history = useHistory()

  const classes = useStyles();
  const user = useSelector(state => state.user)

  const [toggle, setToggle] = useState(false);
  const [searchInput, setSearchInput] = useState('')
  const [arrYousendList, setArrYousendList] = useState()
  const [arrYoureceiveList, setArrYoureceiveList] = useState()
  const [selectedYousend, setSelectedYousend] = useState()
  const [selectedYoureceive, setSelectedYoureceive] = useState()

  const currPath = history.location.pathname

  useEffect(() => {
    if (listType === 'yousend') {
      const yousendList = Object.assign([], yousendConstants).filter(
        item => item.label.toLowerCase().indexOf(searchInput.toLowerCase()) > -1 || 
          item.desc.toLowerCase().indexOf(searchInput.toLowerCase()) > -1
      );
      setArrYousendList(yousendList)
      if (yousendList && yousendList.length > 1) {
        setSelectedYousend(yousendList[1])
        passDropListData(yousendList[1])
      }
    } else {
      if (user && JSON.stringify(user) !== '{}') {
        paymentService.getPaymentMethodsById(user.id)
          .then(
              paymentMethods => {
                const youreceiveList = Object.assign([], paymentMethods).filter(
                  item => item.name.toLowerCase().indexOf(searchInput.toLowerCase()) > -1 || 
                    currencyConstants[item.selectedCurrency].desc.toLowerCase().indexOf(searchInput.toLowerCase()) > -1
                );
                setArrYoureceiveList(youreceiveList)
                if (youreceiveList && youreceiveList.length > 0) {
                  setSelectedYoureceive(currencyConstants[youreceiveList[0].selectedCurrency])
                  passDropListData(currencyConstants[youreceiveList[0].selectedCurrency])
                }
              },
              error => {}
          )
      } else {
        const youreceiveList = Object.assign([], currencyConstants).filter(
          item => item.label.toLowerCase().indexOf(searchInput.toLowerCase()) > -1 || 
            item.desc.toLowerCase().indexOf(searchInput.toLowerCase()) > -1
        );
        setArrYoureceiveList(youreceiveList);
        if (youreceiveList && youreceiveList.length > 0 && currPath !== '/dashboard') {
          setSelectedYoureceive(youreceiveList[0])
          passDropListData(youreceiveList[0])
        }
      }
    }
  }, [listType, searchInput, user])
  
  return (
    <CDropdown
      className="c-header-nav-item mx-0 px-0"
      toggle={toggle}
      onFocus={() => setToggle(!toggle)}
      onBlur={() => setToggle(!toggle)}
      tabIndex="0"
    >
      <CDropdownToggle className="d-box-shadow1 mx-0 px-0" caret={false}>
        <CButton className="d-box-shadow1 mr-0 pr-0">
            <div className="d-flex mt-0 button-currency">
                <div className="flex-grow-1">
                    <div className="align-self-start small-full-currency">
                      { listType === 'yousend' && arrYousendList && selectedYousend && 
                        <span title={selectedYousend.desc}>{selectedYousend.desc}</span>
                      }
                      { listType === 'youreceive' && arrYoureceiveList && selectedYoureceive && 
                        <span title={selectedYoureceive.desc}>{selectedYoureceive.desc}</span>
                      }
                    </div>
                    <div className="align-self-end currency-name">
                      { listType === 'yousend' && arrYousendList && selectedYousend && 
                        <span title={selectedYousend.label}>{selectedYousend.label}</span>
                      }
                      { listType === 'youreceive' && arrYoureceiveList && selectedYoureceive && 
                        <span title={selectedYoureceive.label}>{selectedYoureceive.label}</span>
                      }
                    </div>
                </div>
                <div className="status-icon">
                    { !toggle ? 
                        <CImg src={'img/icons8-expand-arrow-24.png'} alt="Search" height={24}></CImg>
                    :
                        <CImg src={'img/icons8-collapse-arrow-24.png'} alt="Search" height={24}></CImg>
                    }
                </div>
            </div>
        </CButton>
      </CDropdownToggle>
      <CDropdownMenu className="p-0 mt-1 currency-dropdown-menu" placement="bottom-end">
        <CDropdownItem
          header
          tag="div"
          color="transparent"
          className="search-dropdown"
        >
          <TextField
            label=""
            id="standard-start-adornment"
            className={clsx(classes.margin, classes.textField)}
            value={searchInput}
            InputProps={{
                startAdornment: 
                <InputAdornment position="start">
                    <CImg src={'img/icons8-search-96.png'} alt="Search" height={20}></CImg>
                </InputAdornment>,
            }}
            onChange={(e) => setSearchInput(e.target.value)}
            />
        </CDropdownItem>
        { listType === 'yousend' && arrYousendList && 
          arrYousendList.map((yousend, index) => (
            <CDropdownItem className="currency-dropdown" onClick={() => { 
              passDropListData(yousend)
              setSelectedYousend(yousend);
              }}>
              <CImg src={yousend.logo} alt="BTC Logo" height={25}></CImg>
              <span className="stands-of-currency">{yousend.label}</span>
              <span className="full-currency">{yousend.desc}</span>
            </CDropdownItem>
          ))
        }
        {  listType === 'youreceive' && arrYoureceiveList && 
          arrYoureceiveList.map((youreceive, index) => (
            <CDropdownItem className="currency-dropdown" onClick={() => {
                if (user && JSON.stringify(user) !== '{}') {
                  passDropListData(currencyConstants[youreceive.selectedCurrency]);
                  setSelectedYoureceive(currencyConstants[youreceive.selectedCurrency]);
                } else {
                  passDropListData(youreceive)
                  setSelectedYoureceive(youreceive)
                }
              }}>
              <span className="stands-of-currency">
                { youreceive && user && JSON.stringify(user) !== '{}' ? (currencyConstants[youreceive.selectedCurrency] ? currencyConstants[youreceive.selectedCurrency].label : '') : (youreceive ? youreceive.label : '')}
              </span>
              <span className="full-currency">
                { youreceive && user && JSON.stringify(user) !== '{}' ? (currencyConstants[youreceive.selectedCurrency] ? currencyConstants[youreceive.selectedCurrency].desc : '') : ( youreceive ? youreceive.desc : '' )}
              </span>
            </CDropdownItem>
          ))
        }
      </CDropdownMenu>
    </CDropdown>
  )
}

export default DropdownCurrency