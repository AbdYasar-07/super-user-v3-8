import { Button } from 'primereact/button';
import React from 'react'
import { ToastContainer } from 'react-toastify';

const SaveTabs = () => {



    return (
        <>
            <ToastContainer />
            <Button label="SAVE" size='small' style={{ width: "180px", margin: "10px", borderRadius: "13px", }} severity='info' raised />
            <Button label='CANCEL' size='small' style={{ width: "180px", margin: "10px", borderRadius: "13px" }} security='info' raised />

        </>
    )
}

export default SaveTabs;
