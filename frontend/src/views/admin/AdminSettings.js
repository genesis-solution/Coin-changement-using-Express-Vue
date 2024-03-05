import React, { useEffect, useState } from 'react'
import {
    CCard,
    CCol,
    CRow,
    CButton,
    CFormGroup,
    CLabel,
    CInputCheckbox
} from '@coreui/react';
import TextField from '@material-ui/core/TextField';
import {
    alpha,
    makeStyles,
    } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { paymentService } from '../../controllers/_services';
import { warningNotification, successNotification } from '../../controllers/_helpers';

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
      },
      '&$focused': {
      backgroundColor: '#fff',
      boxShadow: `${alpha("#24242f", 0.25)} 0 0 0 1px`,
      borderRadius: 4,
      borderColor: "#24242f",
      borderBottom: "2px solid black",
      color: "#24242f"
      }
  },
  focused: {},
  }));

function RedditTextField(props) {
  const classes = useStylesReddit();
  
  return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
  }

const AdminSetting = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  dispatch({type: 'set', darkMode: false})

  const user = useSelector(state => state.user)

  if (!localStorage.getItem('user') || !user || !user.role) {
    dispatch({type: 'set', darkMode: true})
    history.push('/home')
  }

  const [adminEmail, setAdminEmail] = useState('');
  const [usdtReserve, setUsdtReserve] = useState('');
  const [profit, setProfit] = useState('');
  const [exchangeLimit, setExchangeLimit] = useState(false);
  const [exchangeLimitMessage, setExchangeLimitMessage] = useState('');
  const [usdtAddress, setUsdtAddress] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [btcAddress, setBtcAddress] = useState('');
  const [usdcAddress, setUsdcAddress] = useState('');
  const [bnbAddress, setBnbAddress] = useState('');
  const [busdAddress, setBusdAddress] = useState('');

  const [unionbankAccntNo, setUnionbankAccntNo] = useState('');
  const [unionbankAccntName, setUnionbankAccntName] = useState('');
  const [unionbankBranchAddress, setUnionbankBranchAddress] = useState('');
  const [unionbankMobNo, setUnionbankMobNo] = useState('');

  const [gcashMobNo, setGcashMobNo] = useState('');
  const [coinsphMobNo, setCoinsphMobNo] = useState('');

  const [smtpHostName, setSmtpHostName] = useState('');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpSSL, setSmtpSSL] = useState(false);

  const [transactionFee, setTransactionFee] = useState('');

  const [isWillCreate, setIsWillCreate] = useState(true);
  const [selectedId, setSelectedId] = useState();

  useEffect(() => {
    paymentService.getAdminsetting()
    .then(result => {
      if (result.length === 0 ) {
        setIsWillCreate(true);
      } else {
        setIsWillCreate(false); // If exist...
        setSelectedId(result[0].id);
        setAdminEmail(result[0].email);
        setUsdtReserve(result[0].usdtReserve);
        setProfit(result[0].profit);
        setExchangeLimit(result[0].exchangeLimit);
        setExchangeLimitMessage(result[0].exchangeLimitMessage);
        setUsdtAddress(result[0].usdtAddress);
        setEthAddress(result[0].ethAddress);
        setBtcAddress(result[0].btcAddress);
        setUsdcAddress(result[0].usdcAddress);
        setBnbAddress(result[0].bnbAddress);
        setBusdAddress(result[0].busdAddress);
        setUnionbankAccntName(result[0].unionbankAccountName);
        setUnionbankAccntNo(result[0].unionbankAccountNo);
        setUnionbankBranchAddress(result[0].unionbankBranchAdress);
        setUnionbankMobNo(result[0].unionbankMobileNo);
        setGcashMobNo(result[0].gcashMobileNo);
        setCoinsphMobNo(result[0].coinsphMobileNo);
        setSmtpHostName(result[0].smtpHostName);
        setSmtpUsername(result[0].smtpUsername);
        setSmtpPassword(result[0].smtpPassword);
        setSmtpPort(result[0].smtpPort);
        setSmtpSSL(result[0].smtpSSL);
        setTransactionFee(result[0].transactionFee);
      }
    }, err => {
      console.log(err);
    })
  }, []);

  const onSubmit = () => {
    let adminsettingObj = {
      email: adminEmail,
      usdtReserve: usdtReserve,
      profit: profit,
      exchangeLimit: exchangeLimit,
      exchangeLimitMessage: exchangeLimitMessage,
      usdtAddress: usdtAddress,
      ethAddress: ethAddress,
      btcAddress: btcAddress,
      usdcAddress: usdcAddress,
      bnbAddress: bnbAddress,
      busdAddress: busdAddress,
      unionbankAccountName: unionbankAccntName,
      unionbankAccountNo: unionbankAccntNo,
      unionbankBranchAdress: unionbankBranchAddress,
      unionbankMobileNo: unionbankMobNo,
      gcashMobileNo: gcashMobNo,
      coinsphMobileNo: coinsphMobNo,
      smtpHostName: smtpHostName,
      smtpUsername: smtpUsername,
      smtpPassword: smtpPassword,
      smtpPort: smtpPort,
      smtpSSL: smtpSSL,
      transactionFee: transactionFee
    }
    if (isWillCreate) {
      paymentService.createAdminsetting(adminsettingObj).then(
        result => {
          successNotification("Successfully created", 3000);
        },
        err => {
          warningNotification(err, 3000);
        }
      )
    } else {
      paymentService.updateAdminsetting(selectedId, adminsettingObj).then(
        result => {
          successNotification("Successfully updated", 3000);
        },
        err => {
          warningNotification(err, 3000);
        }
      )
    }
  }

  return (
    <>
      <CCard color="transparent" className="transaction-table  d-box-shadow1 d-border">
        <CRow>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="admin-email"
                    label="Admin Email"
                    placeholder="Admin Email"
                    fullWidth
                    value={adminEmail}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="usdt-reserve"
                    label="USDT Reserve"
                    placeholder="USDT Reserve"
                    fullWidth
                    value={usdtReserve}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setUsdtReserve(e.target.value)}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="profit"
                    label="Profit %"
                    placeholder="Profit %"
                    fullWidth
                    value={profit}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => { if (e.target.value === '' || Number(e.target.value)) setProfit(e.target.value) }}
                    variant="filled"
                />
          </CCol>
        </CRow>
      </CCard>
      <CCard color="transparent" className="transaction-table  d-box-shadow1 d-border">
        <h3>EXCHANGE BUTTON</h3>
        <CRow>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="12" lg="6" md="6">
            <CFormGroup variant="custom-checkbox" className="smtp-ssl">
              <CInputCheckbox custom id="inline-checkbox1" name="inline-checkbox1" color="danger" value="limit" checked={exchangeLimit}
                onChange={(e) => {
                  setExchangeLimit(!exchangeLimit);
                }}
              />
              <CLabel variant="custom-checkbox" htmlFor="inline-checkbox1">LIMIT (8AM to 5PM, MONDAY to SATURDAY)</CLabel>
            </CFormGroup>
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="6" md="6">
            <RedditTextField
                  id="exchange-message"
                  label="MESSAGE CONTENT"
                  placeholder="MESSAGE.."
                  fullWidth
                  value={exchangeLimitMessage}
                  InputLabelProps={{
                      shrink: true,
                  }}
                  onChange={(e) => setExchangeLimitMessage(e.target.value)}
                  variant="filled"
              />
          </CCol>
        </CRow>
      </CCard>
      <CCard color="transparent" className="transaction-table  d-box-shadow1 d-border">
        <h3>PAYMENTS MODE</h3>
        <CRow>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="usdt"
                    label="USDT ADDRESS"
                    placeholder="USDT ADDRESS"
                    fullWidth
                    value={usdtAddress}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setUsdtAddress(e.target.value)}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="eth"
                    label="ETH ADDRESS"
                    placeholder="ETH ADDRESS"
                    fullWidth
                    value={ethAddress}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setEthAddress(e.target.value)}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="btc"
                    label="BTC ADDRESS"
                    placeholder="BTC ADDRESS"
                    fullWidth
                    value={btcAddress}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setBtcAddress(e.target.value)}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="usdc"
                    label="USDC ADDRESS"
                    placeholder="USDC ADDRESS"
                    fullWidth
                    value={usdcAddress}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setUsdcAddress(e.target.value)}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="bnb"
                    label="BNB ADDRESS"
                    placeholder="BNB ADDRESS"
                    fullWidth
                    value={bnbAddress}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setBnbAddress(e.target.value)}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="busd"
                    label="BUSD ADDRESS"
                    placeholder="BUSD ADDRESS"
                    fullWidth
                    value={busdAddress}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setBusdAddress(e.target.value)}
                    variant="filled"
                />
          </CCol>
        </CRow>
      </CCard>
      <CCard color="transparent" className="transaction-table  d-box-shadow1 d-border">
        <CRow>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="unionbank-account-no"
                    label="UNIONBANK ACCNT.NO."
                    placeholder="Unionbank account No."
                    fullWidth
                    value={unionbankAccntNo}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setUnionbankAccntNo(e.target.value)}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="unionbank-account-name"
                    label="UNIONBANK ACCNT.NAME"
                    placeholder="Unionbank account name"
                    fullWidth
                    value={unionbankAccntName}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setUnionbankAccntName(e.target.value)}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="unionbank-branch-address"
                    label="UNIONBANK BRANCH ADDRESS"
                    placeholder="Unionbank branch address"
                    fullWidth
                    value={unionbankBranchAddress}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setUnionbankBranchAddress(e.target.value)}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="unionbank-mob-no"
                    label="UNIONBANK MOB. NO."
                    placeholder="Unionbank mobile number"
                    fullWidth
                    value={unionbankMobNo}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => { if (Number(e.target.value)) setUnionbankMobNo(e.target.value) }}
                    variant="filled"
                />
          </CCol>
        </CRow>
      </CCard>
      <CCard color="transparent" className="transaction-table  d-box-shadow1 d-border">
        <CRow>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="gcash-mobile-no"
                    label="GCASH MOBILE NO"
                    placeholder="Gcash mobile number"
                    fullWidth
                    value={gcashMobNo}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => { if (Number(e.target.value)) setGcashMobNo(e.target.value) }}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="coinsph-mob-no"
                    label="COINS.PH MOBILE NO."
                    placeholder="Coins.ph mobile number"
                    fullWidth
                    value={coinsphMobNo}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => { if (Number(e.target.value)) setCoinsphMobNo(e.target.value) }}
                    variant="filled"
                />
          </CCol>
        </CRow>
      </CCard>

      <CCard color="transparent" className="transaction-table  d-box-shadow1 d-border">
        <h3>EMAIL PROVIDER</h3>
        <CRow>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="smtp-host-name"
                    label="SMTP HOST NAME"
                    placeholder="SMTP Host Name"
                    fullWidth
                    value={smtpHostName}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setSmtpHostName(e.target.value)}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="smtp-username"
                    label="SMTP USERNAME"
                    placeholder="SMTP USERNAME"
                    fullWidth
                    value={smtpUsername}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setSmtpUsername(e.target.value)}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="smtp-password"
                    label="SMTP PASSWORD"
                    placeholder="SMTP PASSWORD"
                    fullWidth
                    value={smtpPassword}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
              <RedditTextField
                    id="smtp-port"
                    label="SMTP PORT"
                    placeholder="SMTP PORT"
                    fullWidth
                    value={smtpPort}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => {
                      if (Number(e.target.value)) setSmtpPort(e.target.value)
                    }}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4">
                <CFormGroup variant="custom-checkbox" className="smtp-ssl">
                  <CInputCheckbox custom id="inline-checkbox3" name="inline-checkbox" color="danger" value="SSL" checked={smtpSSL}
                    onChange={(e) => {
                      setSmtpSSL(!smtpSSL);
                    }}
                  />
                  <CLabel variant="custom-checkbox" htmlFor="inline-checkbox3">SSL</CLabel>
                </CFormGroup>
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="6" lg="4" md="4"></CCol>
        </CRow>
      </CCard>

      <CCard color="transparent" className="transaction-table  d-box-shadow1 d-border">
        <CRow>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="12" lg="4" md="4">
              <RedditTextField
                    id="transaction-fee"
                    label="TRANSACTION FEE"
                    placeholder="Transaction Fee"
                    fullWidth
                    value={transactionFee}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => { if (Number(e.target.value)) setTransactionFee(e.target.value) }}
                    variant="filled"
                />
          </CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="0" lg="4" md="4"></CCol>
          <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="0" lg="4" md="4"></CCol>
        </CRow>
      </CCard>

      <CRow>
        <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="0" lg="4" md="4"></CCol>
        <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="0" lg="4" md="4"></CCol>
        <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border mt-3" sm="12" lg="4" md="4">
            <CButton block className="button-exchange" onClick={onSubmit}>
              Save
            </CButton>
        </CCol>
      </CRow>
    </>
  )
}

export default AdminSetting
