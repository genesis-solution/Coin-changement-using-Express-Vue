import React, { useRef } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useSelector, useDispatch } from 'react-redux'

const PopupController = () => {
  const dispatch = useDispatch()
  const ref = useRef()
  const isPopup = useSelector(state => state.popupForCurrency)

  const closeModal = () => {
    dispatch({type: 'set', popupForCurrency: false})
  };

  return (
    <Popup ref={ref} open={isPopup} closeOnDocumentClick onClose={closeModal} offsetX="100" offsetY="200">
        <div>
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae magni
          omnis delectus nemo, maxime molestiae dolorem numquam mollitia,
          voluptate ea, accusamus excepturi deleniti ratione sapiente!
          Laudantium, aperiam doloribus. Odit, aut.
        </div>
    </Popup>
  )
};

export default PopupController;