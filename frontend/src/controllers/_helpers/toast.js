import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from 'glamor';

toast.configure()

// toast.POSITION.BOTTOM_LEFT
export function successNotification(message, time) {
    toast.success(message, {
        className: css({
            fontSize: '60px',
        }), 
        autoClose: time})
}

export function errorNotification(message, time) {
    toast.error(message, {autoClose: time})
}

export function warningNotification(message, time) {
    toast.warning(message, {autoClose: time})
}

export function infoNotification(message, time) {
    toast.info(message, {autoClose: time})
}