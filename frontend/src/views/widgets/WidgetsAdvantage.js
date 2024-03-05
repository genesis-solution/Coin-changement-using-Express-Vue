import React from 'react'
import {
  CRow,
  CCol,
  CWidgetSimple,
  CImg
} from '@coreui/react'

const WidgetsAdvantage = () => {
  // render
  return (
    <CRow style={{ padding: "56px 0" }}>
        <CCol sm="6" lg="3">
            <CWidgetSimple header="" text="" className="widget-advantage">
                <CImg
                    src={'img/icons8-star-80.png'}
                    alt="Best exchange"
                />
                <p>Best exchange</p>
            </CWidgetSimple>
        </CCol>
        <CCol sm="6" lg="3">
            <CWidgetSimple header="" text="" className="widget-advantage">
                <CImg
                    src={'img/icons8-flash-on-50.png'}
                    alt="Fast transaction"
                />
                <p>Fast transaction</p>
            </CWidgetSimple>
        </CCol>
        <CCol sm="6" lg="3">
            <CWidgetSimple header="" text="" className="widget-advantage">
                <CImg
                    src={'img/icons8-peso-symbol-50.png'}
                    alt="Lowest fees"
                />
                <p>Lowest fees</p>
            </CWidgetSimple>
        </CCol>
        <CCol sm="6" lg="3">
            <CWidgetSimple header="" text="" className="widget-advantage">
                <CImg
                    src={'img/icons8-bank-building-64.png'}
                    alt="Regulated by SEC"
                />
                <p>Regulated by SEC</p>
            </CWidgetSimple>
        </CCol>
    </CRow>

    )
}

export default WidgetsAdvantage
