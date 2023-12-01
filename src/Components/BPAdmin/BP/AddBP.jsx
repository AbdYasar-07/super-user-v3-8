import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import Axios from "../../../Utils/Axios";
import axios from "axios";
import { useDispatch } from "react-redux";
import { renderComponent } from "../../../store/auth0Slice";
import highFive from "../../../asset/highFive.png";
import "../../Styles/AddBP.css";
import { checkUserExistsInShopify, createCompanyInShopify, createStoreInOSC, isCompanyExistsInShopify, isStoreExistsInOSC } from "../../BusinessLogics/Logics";
import { toast } from "react-toastify";

export default function AddBP({
  setIsPasteModelShow,
  isPasteCancel,
  setIsPasteCancel,
}) {
  const [visible, setVisible] = useState(false);
  const [system, setSystem] = useState("TEST");
  const [bpId, setBpId] = useState("");
  const [bpName, setBpName] = useState("");
  const [isValidBpId, setIsValidBpId] = useState(false);
  const [bpIdMessage, setBpIdMessage] = useState("");
  const [isValidBpName, setIsValidBpName] = useState(false);
  const [bpNameMessage, setBpNameMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const resource = process.env.REACT_APP_AUTH_EXT_RESOURCE;
  const dispatch = useDispatch();

  const handleChange = (e, field) => {
    switch (field) {
      case "id":
        setBpId(e.target.value);
        break;
      case "name":
        setBpName(e.target.value);
        break;
      case "system":
        setSystem(e.target.value);
        break;
      default:
        console.log("no field matches");
    }
  };

  const isFormSubmissionValid = () => {
    if (validateBPID()) {
      return true;
    } else if (validateBpName()) {
      return true;
    }
    return false;
  };

  const validateBPID = () => {
    if (!bpId) {
      setIsValidBpId(false);
      setBpIdMessage("BP ID cannot be empty");
      return false;
    }
    if (bpId && bpId.length !== 10) {
      setIsValidBpId(false);
      setBpIdMessage("BP ID should contain 10 digits");
      return false;
    }
    setIsValidBpId(true);
    return true;
  };

  const handleBlurValidation = () => {
    validateBPID();
    validateBpName();
  };

  const validateBpName = () => {
    if (!bpName) {
      setIsValidBpName(false);
      setBpNameMessage("BP Name cannot be empty");
      return false;
    } else if (bpName.length < 5) {
      setIsValidBpName(false);
      setBpNameMessage("BP Name atleast contains more than 5 characters of description");
      return false;
    }
    setIsValidBpName(true);
    return true;
  };

  const createGroup = async () => {
    let url = `${resource}/groups`;
    const data = {
      name: `BP_${bpId}`,
      description: `${bpName}`,
    };
    const response = await Axios(url, "POST", data, localStorage.getItem("auth_access_token"), false, false);
    if (!axios.isAxiosError(response)) {
      toast.success(`${bpName} has been created in Auth0`, { theme: "colored" });
      return response;
    } else {
      setLoading(false);
      console.error("Error while creating a group ::", response.cause && response.cause.message);
    }
  };

  const isProductionEnvironment = () => {
    return (system == "PROD") ? true : false;
  };

  const createStore = async () => {

    const isExists = await isStoreExistsInOSC(bpId, isProductionEnvironment());
    if (isExists) {
      toast.warning("Store already exists in OSC", { theme: "colored" });
      return;
    }

    const bpInfoObj = { bpId: bpId, name: bpName };
    const result = await createStoreInOSC(bpInfoObj, isProductionEnvironment());
    if (result) {
      toast.success(`${bpName} has been created in OSC`, { theme: "colored" });
      return;
    }

    toast.error(`Error while creating ${bpName} in OSC.`, { theme: "colored" });
  }

  const createCompany = async () => {
    const isExists = await isCompanyExistsInShopify(bpId);
    if (isExists) {
      toast.warning("Company already exists in shopify", { theme: "colored" });
      return;
    }
    const bpInfoObj = { bpId: bpId, name: bpName };
    const result = await createCompanyInShopify(bpInfoObj, isProductionEnvironment());
    if (result) {
      // company created successfully
      return;
    }

    toast.error(`Error while creating ${bpName} in shopify.`, { theme: "colored" });
  };

  const onFormSubmit = async () => {
    if (isFormSubmissionValid()) {
      setLoading(true);
      await createGroup();
      await createStore();
      setLoading(false);
      dispatch(renderComponent({ cmpName: "BPTABLE" }));
      resetForm();
    }
  };

  const resetForm = () => {
    setBpId("");
    setBpName("");
    setBpIdMessage("");
    setBpNameMessage("");
    setIsValidBpId(false);
    setIsValidBpName(false);
    setVisible(false);
    setLoading(false);
  };

  const footerContent = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => resetForm()}
        className="p-button-text ms-2"
        style={{ borderRadius: "7px" }}
      />
      <Button
        label="Add BP"
        loading={loading}
        icon="pi pi-plus"
        className="ms-2"
        onClick={() => onFormSubmit()}
        autoFocus
        style={{ borderRadius: "7px" }}
        disabled={!isValidBpId || !isValidBpName}
      />
      <Button
        label="Add BP's"
        className="ms-2"
        autoFocus
        style={{ borderRadius: "7px" }}
        // disabled={true}
        onClick={() => {
          setVisible(false);
          setIsPasteModelShow(true);
        }}
      />
    </>
  );
  useEffect(() => {
    if (isPasteCancel) {
      setIsPasteModelShow(false);
      setIsPasteCancel(false);
    }
  }, [isPasteCancel]);
  return (
    <div className="card flex justify-content-center">
      <Button
        label="Add BP'(s)"
        icon={PrimeIcons.PLUS}
        onClick={() => setVisible(true)}
        style={{ width: "150px", borderRadius: "7px" }}
      />
      <Dialog
        // header="Add BP"
        header={
          <div className="d-flex align-items-center">
            <h5 className="m-0">Add BP</h5>
            <img
              className="ms-2"
              src={highFive}
              alt="img not found"
              width="38px"
              height="34px"
            />
          </div>
        }
        visible={visible}
        style={{ width: "40vw" }}
        onHide={() => setVisible(false)}
        draggable={false}
        footer={footerContent}
      >
        <div className="mt-4">
          <label htmlFor="bpId" class="col-form-label  mb-1">
            BP ID
          </label>
          <InputText
            id="bpId"
            type="number"
            value={bpId}
            onChange={(e) => {
              handleChange(e, "id");
              validateBPID();
            }}
            onBlur={() => handleBlurValidation()}
          />
          {!isValidBpId && (
            <small id="bpIdHelp" style={{ color: "red" }}>
              {bpIdMessage}
            </small>
          )}
        </div>
        <div className="mt-4 ">
          <label htmlFor="bpName" class="col-form-label mb-1">
            BP Name
          </label>
          <InputText
            id="bpName"
            type="text"
            value={bpName}
            onChange={(e) => {
              handleChange(e, "name");
              validateBpName();
            }}
            onBlur={() => handleBlurValidation()}
          />
          {!isValidBpName && (
            <small id="bpNameHelp" style={{ color: "red" }}>
              {bpNameMessage}
            </small>
          )}
        </div>
        <div className="mt-4">
          <label htmlFor="system" class="col-form-label">
            SYSTEM
          </label>
          <div className=" d-flex align-items-center">
            <div className="d-flex align-items-center me-3">
              <RadioButton
                inputId="PROD"
                name="PROD"
                value="PROD"
                onChange={(e) => handleChange(e, "system")}
                checked={system === "PROD"}
              />
              <label
                htmlFor="PROD"
                className="ps-2 col-form-label"
                style={{ cursor: "pointer" }}
              >
                PROD
              </label>
            </div>
            <div className="d-flex align-items-center me-3">
              <RadioButton
                inputId="TEST"
                name="TEST"
                value="TEST"
                onChange={(e) => handleChange(e, "system")}
                checked={system === "TEST"}
              />
              <label
                htmlFor="TEST"
                className="ps-2 col-form-label"
                style={{ cursor: "pointer" }}
              >
                TEST
              </label>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
