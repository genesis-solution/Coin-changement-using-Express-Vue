import React, { lazy } from 'react'
import { CFooter, CRow, CCol } from '@coreui/react'

const TheSubFooter = lazy(() => import('./TheSubFooter.js'))

const TheFooter = () => {
  return (
    <>
      <TheSubFooter />
      <CFooter colorScheme="dark" className="footer">
        <CRow className="subfooter">
          <CCol sm="12" lg="6" className="ml-0 pl-0 text-lg-left text-sm-center">
            <span className="ml-0">Operated by ifastbit Foreign Exchange Services</span>
          </CCol>
          <CCol sm="12" lg="6" className="text-lg-right text-sm-center mr-0 pr-0">
            <span className="mr-0">all rights reserved &copy; 2021</span>
          </CCol>
        </CRow>
      </CFooter>
    </>
  )
}

export default React.memo(TheFooter)
