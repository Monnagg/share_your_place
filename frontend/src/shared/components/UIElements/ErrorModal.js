import React,{useEffect} from 'react';
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
//  import Modal from './Modal';
// import Button from '../FormElements/Button';

const ErrorModal = props => {
  

  useEffect(()=>{
    if(!!props.error){
      confirmDialog({
        message: props.error,
        header: 'An Error Occurred!',
        icon: 'pi pi-info-circle',
        defaultFocus: 'reject',
        
    });
    }
   
},[props.error])
  

 return <ConfirmDialog/>
};

// const ErrorModal = props => {
//   return (
//     <Modal
//       onCancel={props.onClear}
//       header="An Error Occurred!"
//       show={!!props.error}
//       footer={<Button onClick={props.onClear}>Okay</Button>}
//     >
//       <p>{props.error}</p>
//     </Modal>
//   );
// };

export default ErrorModal;

