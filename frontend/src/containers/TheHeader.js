import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CImg,
  CButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { useHistory } from 'react-router-dom';
import { userService } from '../controllers/_services/user.service';

const TheHeader = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  // const darkMode = useSelector(state => state.darkMode)
  // const sidebarShow = useSelector(state => state.sidebarShow)
  const isLogin = useSelector(state => state.isLogin)
  const currPath = history.location.pathname

  const [fullName, setFullName] = useState('')

  const localUser = localStorage.getItem('user')
  const user = useSelector(state => state.user)

  const [toggle, setToggle] = useState(false);
  
  useEffect(() => {
    if (localUser && JSON.parse(localUser).id) {
      userService.getById(JSON.parse(localUser).id)
        .then(
          result => {
            if (result.status !== 'Active') logout()
            else if (result.id && result.id === JSON.parse(localUser).id) {
              dispatch({type: 'set', isLogin: true})
              dispatch({type: 'set', user: result})
              // if (result.role === 1) dispatch({type: 'set', isAdmin: true})
            }
          },
          error => {
            logout()
          }
        )
    }
  }, [localUser])

  useEffect(() => {
    setFullName(String(user.fullName).split(' ')[0]);
  }, [user])

  const logout = () => {
    userService.logout();
    dispatch({type: 'set', isLogin: false})
    dispatch({type: 'set', isAdmin: false})
    dispatch({type: 'set', user: {}})
    dispatch({type: 'refresh'})
    history.push('/home')
  }

  const handleSignupClickOpen = () => {
    dispatch({type: 'set', openSignup: true})
  };

  const handleSigninClickOpen = () => {
    dispatch({type: 'set', openSignin: true})
  };

  const onClickLogo = () => {
    history.push('/home')
  }

  // const toggleSidebar = () => {
  //   const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
  //   dispatch({type: 'set', sidebarShow: val})
  // }

  // const toggleSidebarMobile = () => {
  //   const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
  //   dispatch({type: 'set', sidebarShow: val})
  // }

  return (
    <>
    <CHeader colorScheme="dark" className="header">
      {/* <CToggler
        inHeader
        className={isAdmin && isLogin ? 'ml-md-3 d-lg-none' : 'ml-md-3 d-none'}
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className={isAdmin && isLogin ? 'ml-3 d-md-down-none' : 'ml-3 d-none'}
        onClick={toggleSidebar}
      /> */}

      <CHeaderNav >
        <CHeaderNavItem >
          <CHeaderNavLink onClick={onClickLogo}>
            <CImg
              src={'img/Unicash.png'}
              alt="Unicash"
              height="37"
              style={{marginTop: "-9px"}}
            />
          </CHeaderNavLink>
        </CHeaderNavItem>
      </CHeaderNav>

      <CHeaderNav className="mr-auto">
        <CHeaderNavItem className={isLogin && !user.role ? 'px-3 d-md-down-none' : 'd-none'}>
          <CHeaderNavLink to="/dashboard" className={currPath === '/dashboard' || currPath === '/exchange' ? 'menu-item-active' : 'dropdown-toggle-exchange'}>Exchange</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className={isLogin && !user.role ? 'px-3 d-md-down-none' : 'd-none'}>
          <CHeaderNavLink to="/payment" className={currPath === '/payment' ? 'menu-item-active' : 'dropdown-toggle-exchange'}>Payment</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className={isLogin && !user.role ? 'px-3 d-md-down-none' : 'd-none'}>
          <CHeaderNavLink to="/setting" className={currPath === '/setting' ? 'menu-item-active' : 'dropdown-toggle-exchange'}>Settings</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className={isLogin && user.role ? 'px-3 d-md-down-none' : 'd-none'}>
          <CHeaderNavLink to="/admin" className={currPath === '/admin' ? 'menu-item-active' : 'dropdown-toggle-exchange'}>Home</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className={isLogin && user.role ? 'px-3 d-md-down-none' : 'd-none'}>
          <CHeaderNavLink to="/users" className={currPath === '/users' ? 'menu-item-active' : 'dropdown-toggle-exchange'}>Users</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className={isLogin && user.role ? 'px-3 d-md-down-none' : 'd-none'}>
          <CHeaderNavLink to="/config" className={currPath === '/config' ? 'menu-item-active' : 'dropdown-toggle-exchange'}>Settings</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className={isLogin && user.role ? 'px-3 d-md-down-none' : 'd-none'}>
          <CHeaderNavLink to="/transaction" className={currPath === '/transaction' ? 'menu-item-active' : 'dropdown-toggle-exchange'}>Transaction</CHeaderNavLink>
        </CHeaderNavItem>
      </CHeaderNav>

      <CHeaderNav className="px-3">
        {/* <CToggler
          inHeader
          className="ml-3 d-md-down-none"
          onClick={() => dispatch({type: 'set', darkMode: !darkMode})}
          title="Toggle Light/Dark Mode"
        >
          <CIcon name="cil-moon" className="c-d-dark-none" alt="CoreUI Icons Moon" />
          <CIcon name="cil-sun" className="c-d-default-none" alt="CoreUI Icons Sun" />
        </CToggler> */}
        {/* <TheHeaderDropdownNotif/>
        <TheHeaderDropdownTasks/>
        <TheHeaderDropdownMssg/>
        <TheHeaderDropdown/> */}

        <CHeaderNavLink className={isLogin ? 'd-none' : undefined}>
            <CButton block onClick={handleSignupClickOpen} className="button-sign">
              <strong>Sign up</strong>
            </CButton>
        </CHeaderNavLink>

        <CHeaderNavLink className={isLogin ? 'd-none' : undefined}>
            <CButton block onClick={handleSigninClickOpen} className="button-sign-active" active>
              <strong>Sign in</strong>
            </CButton>
        </CHeaderNavLink>
        
        <CDropdown variant="btn-group" className={isLogin ? 'm-0 pt-0' : 'd-none'} toggle={toggle}
          onFocus={() => setToggle(!toggle)}
          onBlur={() => setToggle(!toggle)}>
            <CDropdownToggle className="m-0 pt-0 p-0 dropdown-toggle-exchange" color="success" caret={false}>
                Hi {fullName} 
                { !toggle ? 
                    <CImg src={'img/icons8-white-expand-arrow-24.png'} alt="Search" height={24}></CImg>
                :
                    <CImg src={'img/icons8-white-collapse-arrow-24.png'} alt="Search" height={24}></CImg>
                }
            </CDropdownToggle>
            <CDropdownMenu className="pt-1 dropdown-toggle-menu" placement="bottom-end">
                <CDropdownItem className={isLogin && !user.role ? 'dropdown-toggle-menuitem' : 'd-none'} onClick={() => history.push('payment')}>Payment method</CDropdownItem>
                <CDropdownItem className={isLogin && !user.role ? 'dropdown-toggle-menuitem' : 'd-none'} onClick={() => history.push('setting')}>Settings</CDropdownItem>
                <CDropdownItem className={isLogin && user.role ? 'dropdown-toggle-menuitem' : 'd-none'} onClick={() => history.push('admin')}>Home</CDropdownItem>
                <CDropdownItem className={isLogin && user.role ? 'dropdown-toggle-menuitem' : 'd-none'} onClick={() => history.push('users')}>Users</CDropdownItem>
                <CDropdownItem className={isLogin && user.role ? 'dropdown-toggle-menuitem' : 'd-none'} onClick={() => history.push('config')}>Settings</CDropdownItem>
                <CDropdownItem className={isLogin && user.role ? 'dropdown-toggle-menuitem' : 'd-none'} onClick={() => history.push('transaction')}>Transaction</CDropdownItem>
                <CDropdownItem className="dropdown-toggle-menuitem" onClick={logout}>Log out</CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
      </CHeaderNav>
    </CHeader>
    </>
  )
}

export default TheHeader
