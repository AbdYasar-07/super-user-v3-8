import React, { useEffect, useState } from 'react';
// import "../Components/Styles/ToggleSelection.css"
import { useDispatch, useSelector } from 'react-redux';
import Axios from "../Utils/Axios";
import { ToastContainer, toast } from 'react-toastify';
import { renderingCurrentUser } from '../store/auth0Slice';
import { useParams } from 'react-router';
import { Button } from 'primereact/button';



const ToggleSelection = () => {

    const resource = process.env.REACT_APP_AUTH_MANAGEMENT_AUDIENCE;
    const resourceUrlForManagementToken = process.env.REACT_APP_MANAGEMENT_API;
    const options = ['BLOCK USER', 'UNBLOCK USER'];
    const [blockLoader, setBlockLoader] = useState(false);
    const [verifyLoader, setVerifyLoader] = useState(false);
    const { userId, memberId } = useParams();
    const renderedUser = useSelector((store) => Object.keys(store?.auth0Context?.renderingUser).length > 0 ? store?.auth0Context?.renderingUser : null);
    const [value, setValue] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        if (JSON.parse(JSON.stringify(renderedUser))?.blocked) {
            setValue(options[1]);
        } else {
            setValue(options[0]);
        }

    }, []);


    const getAuthToken = async () => {
        let body = {
            client_id: process.env.REACT_APP_AUTH_MANAGEMENT_CLIENT_ID,
            client_secret: process.env.REACT_APP_AUTH_MANAGEMENT_CLIENT_SECRET,
            audience: process.env.REACT_APP_AUTH_MANAGEMENT_AUDIENCE,
            grant_type: process.env.REACT_APP_AUTH_GRANT_TYPE,
        };
        return await Axios(
            `${resourceUrlForManagementToken}`,
            "POST",
            body,
            null
        )
            .then((managementToken) => {
                return managementToken;
            })
            .catch((error) => {
                return `Error ::", ${error}`;
            });
    };

    const handleToggleState = async (value) => {
        setBlockLoader(true);
        switch (value) {
            case "BLOCK USER":
                if (userId)
                    await blockUserHelper(userId, true);
                else if (memberId)
                    await blockUserHelper(memberId, true);
                setValue(options[1]);
                break;
            case "UNBLOCK USER":
                if (userId)
                    await blockUserHelper(userId, false);
                else if (memberId)
                    await blockUserHelper(memberId, false);
                setValue(options[0]);
                break;
            default:
                break;
        }
    }

    const blockUser = async (userId, access_token, status) => {
        if (!userId)
            return;

        const url = `${resource}users/${userId}`;
        const method = 'PATCH';
        const body = { "blocked": status }

        await axiosCallOut(url, method, body, access_token, true);
    }

    const axiosCallOut = async (url, method, body, accessToken, isForBlock) => {
        await Axios(url, method, body, accessToken, true)
            .then((response) => {
                let obj = Object.assign({}, response);
                if (isForBlock && obj?.user_id) {
                    toast.info(`User ${JSON.parse(JSON.stringify(renderedUser)).email} has been ${body["blocked"] === true ? 'blocked' : 'unblocked'}`, { theme: "colored" });
                } else if (!isForBlock && obj?.user_id) {
                    toast.info(`User ${JSON.parse(JSON.stringify(renderedUser)).email} has been verified sucessfully.`, { theme: "colored" });
                } else if (obj?.message.includes("failed")) {
                    toast.error(`${obj?.response.data.message}`, { theme: "colored" });
                }
                dispatch(renderingCurrentUser({ currentUser: response }));
            })
            .catch((error) => {
                console.error(`Error while updating user ${isForBlock === true ? "block" : "email verification"} status`, error);
            })
            .finally(() => {
                if (isForBlock) {
                    setBlockLoader(false);
                } else {
                    setVerifyLoader(false);
                }
            })

    }

    const blockUserHelper = async (userId, status) => {
        await getAuthToken().then(async (managementResponse) => {
            await blockUser(userId, managementResponse.access_token, status);
        })
    }

    const verifyUserEmailHelper = async (userId) => {
        await getAuthToken().then(async (managementResponse) => {
            await verifyUserEmail(userId, managementResponse.access_token);
        })
    }

    const blockButtonServeity = () => {
        return (value === options[0]) ? "danger" : "info";
    }

    const verifyUserEmail = async (userId, access_token) => {
        setVerifyLoader(true);
        const url = `${resource}users/${userId}`;
        const method = 'PATCH';
        const body = { "email": JSON.parse(JSON.stringify(renderedUser)).email, "email_verified": true, connection: process.env.REACT_APP_CONCEPTION_DATABASE }
        await axiosCallOut(url, method, body, access_token, false);
    }



    return (
        <>
            <ToastContainer />
            <Button label="VERIFY EMAIL" size='small' style={{ width: "180px", margin: "10px", borderRadius: "13px", }} severity='primary' raised loading={verifyLoader} disabled={JSON.parse(JSON.stringify(renderedUser))?.email_verified} onClick={(e) => verifyUserEmailHelper((userId) ? userId : memberId)} />
            <Button label={value} size='small' severity={blockButtonServeity()} style={{ width: "180px", margin: "10px", borderRadius: "13px" }} raised loading={blockLoader} onClick={(e) => handleToggleState(e.target.innerText)} />

            {/* <div className='selectToggle'>
                <SelectButton value={value} onChange={(e) => handleToggleState(e.value)} options={options} checked />
            </div> */}
        </>
    );
}

export default ToggleSelection;
