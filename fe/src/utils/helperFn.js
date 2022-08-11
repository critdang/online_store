
import { toast, ToastContainer } from 'react-toastify';

export const toastAlertSuccess = (text) => {
  toast.success(text, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

export const toastAlertFail = (text) => {
  toast.error(text, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

export default {toastAlertSuccess,toastAlertFail}