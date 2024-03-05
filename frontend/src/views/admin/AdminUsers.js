import React, { lazy, useEffect, useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CInputGroup,
    CInputGroupAppend,
    CInputGroupText,
    CInput
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { userService } from '../../controllers/_services';

const EditUsers = lazy(() => import('./EditUsers'));

const AdminUsers = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  dispatch({type: 'set', darkMode: false})

  const user = useSelector(state => state.user)
  const editUser = useSelector(state => state.editUser)

  if (!localStorage.getItem('user') || !user || !user.role) {
    dispatch({type: 'set', darkMode: true})
    history.push('/home')
  }

  const [totalUserList, setTotalUserList] = useState([]);
  const [userList, setUserList] = useState();

  const [searchUsernameOrEmail, setSearchUsernameOrEmail] = useState()

  const onSearch = (e) => {
    const keyV = e.target.value;
    setSearchUsernameOrEmail(keyV);

    if (keyV === '') setUserList(totalUserList);
    else {
        let tmpTransactions = [];
        totalUserList.forEach(element => {
           if (element.email.toLowerCase().indexOf(keyV.toLowerCase()) > -1 || element.fullName.toLowerCase().indexOf(keyV.toLowerCase()) > -1) {
               tmpTransactions.push(element);
           } 
        });
        setUserList(tmpTransactions);
    }
  }

  useEffect(() => {
    userService.getAll()
    .then(
      users => {
        let tmpUserList = [];
        users.forEach(element => {
            if (user && element.id !== user.id && !element.role) {
              tmpUserList.push(element);
            }   
        });
        setTotalUserList(tmpUserList);
        setUserList(tmpUserList);
      },
      error => {}
    )
  }, [editUser]);


  const onClickEdit = (user) => {
    dispatch({type: 'set', editUser: true})
    dispatch({type: 'set', selectedUser: user})
  }

  return (
    <>
      <CRow>
        <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border" sm="12" lg="12" md="12">
          <CCard color="transparent" className="transaction-table d-box-shadow1 d-border mt-3">
            <CCardHeader color="transparent d-border pl-0 pr-0" className="header-title">
                <CRow>
                    <CCol sm="12" md="7" lg="7">User List</CCol>
                    <CCol sm="12" md="5" lg="5">
                        <CInputGroup className="admin-search pr-0 mr-0">
                            <CInput value={searchUsernameOrEmail} onChange={onSearch} placeholder="User name or Email" />
                            <CInputGroupAppend className="mr-0 pr-0">
                                <CInputGroupText className="admin-search-button">
                                    Search
                                </CInputGroupText>
                            </CInputGroupAppend>
                        </CInputGroup>
                    </CCol>
                </CRow>
            </CCardHeader>
            <CCardBody className="p-0" color="default">
            { userList && 
              <table className="table table-hover table-outline mb-0">
                <thead className="thead-light">
                  <tr>
                    <th>User ID</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Name</th>
                    <th className="text-center">Address</th>
                    <th className="text-center">Date time</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                { userList &&
                  userList.map(userItem => (
                    <tr>
                      <td>
                        {userItem.id}
                      </td>
                      <td className="text-center">
                        { userItem.email }
                      </td>
                      <td className="text-center">
                        { userItem.fullName }
                      </td>
                      <td className="text-center">
                        {userItem.address}
                      </td>
                      <td className="text-center">
                        { format(new Date(userItem.createdAt), 'yyyy-MM-dd kk:mm') }
                      </td>
                      <td className="text-center">
                        {userItem.status}
                      </td>
                      <td className="text-center">
                          <CButton color="success" onClick={() => onClickEdit(userItem)}>Edit</CButton>
                      </td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            }
            { Object.assign([], userList).length === 0 && 
              <h3 className="text-muted m-3 pt-3 text-center">NO USER</h3>
            }
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      
      <EditUsers />
    </>
  )
}

export default AdminUsers
