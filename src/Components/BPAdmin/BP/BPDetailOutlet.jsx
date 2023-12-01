import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { SelectButton } from 'primereact/selectbutton';
import { useDispatch, useSelector } from 'react-redux';
import { addIsShopifyBPTab } from '../../../store/auth0Slice';

const BPDetailOutlet = () => {

    const [value, setValue] = useState("Members");
    const { bpId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const auth0Context = useSelector((store) => store?.auth0Context);
    const dispatch = useDispatch();

    const handleSelectedTab = (tabValue) => {
        switch (tabValue) {
            case "Members": {
                dispatch(addIsShopifyBPTab({ showShopifySystemTab: false }));
                navigate(`/bp/${bpId}/tabs/members`);
                break;
            }
            case "StoreDetails": {
                dispatch(addIsShopifyBPTab({ showShopifySystemTab: true }));
                navigate(`/bp/${bpId}/tabs/store`);
                break;
            }
            case "UatServiceDetails": {
                dispatch(addIsShopifyBPTab({ showShopifySystemTab: false }));
                navigate(`/bp/${bpId}/tabs/uat-service`);
                break;
            }
            case "ProdServiceDetails": {
                dispatch(addIsShopifyBPTab({ showShopifySystemTab: false }));
                navigate(`/bp/${bpId}/tabs/prod-service`);
                break;
            }
            case "SAPDetails": {
                dispatch(addIsShopifyBPTab({ showShopifySystemTab: false }));
                break;
            }
            case "COMSDetails": {
                dispatch(addIsShopifyBPTab({ showShopifySystemTab: false }));
                navigate(`/bp/${bpId}/tabs/coms`);
                break;
            }
            default: {
                dispatch(addIsShopifyBPTab({ showShopifySystemTab: false }));
                setValue("Members");
                navigate(`/bp/${bpId}/tabs/members`);
                break;
            }
        }
    };

    const onTabChange = (value) => {
        setValue(value);
        handleSelectedTab(value);
    };

    const renderItems = () => {
        let tabItems = [];
        tabItems.push({ name: 'Members', value: "Members" });
        tabItems.push({ name: 'Store Details', value: "StoreDetails" });
        if (auth0Context?.currentBusinessPartner?.IsOSCStoreInBothSystem) {
            tabItems.push({ name: 'Service Details (UAT)', value: "UatServiceDetails" });
            tabItems.push({ name: 'Service Details (PROD)', value: "ProdServiceDetails" });
        } else if (auth0Context?.currentBusinessPartner?.IsInOSCProd == "Yes") {
            tabItems.push({ name: 'Service Details (PROD)', value: "ProdServiceDetails" });
        } else if (auth0Context?.currentBusinessPartner?.IsInOSCDev == "Yes") {
            tabItems.push({ name: 'Service Details (UAT)', value: "UatServiceDetails" });
        }
        tabItems.push({ name: 'SAP Details', value: "SAPDetails" });
        tabItems.push({ name: 'COMS Details', value: "COMSDetails" });
        setItems(tabItems);
    };

    useEffect(() => {
        renderItems();
        handleSelectedTab(value);
    }, [])


    return (
        <>
            <div style={{ display: "flex" }}>
                <SelectButton value={value} optionLabel="name" options={items} onChange={(e) => onTabChange(e.value)} />
            </div>
            <Outlet />
        </>
    );
}

export default BPDetailOutlet;
