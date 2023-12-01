import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Axios from "../../../Utils/Axios";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addAuthorizationCode } from "../../../store/auth0Slice";
import ContentHeader from "../../Contents/ContentHeader";
import ImportUserModal from "../../../Utils/ImportUserModal";
import TableData from "../../../Utils/TableData";
import BPtabel from "./BPtabel";
import AppSpinner from "../../../Utils/AppSpinner";
import axios from "axios";
import AddBP from "./AddBP";
const BP = () => {
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const [isPasteModelShow, setIsPasteModelShow] = useState(false);
  const [isPasteCancel, setIsPasteCancel] = useState(false);
  const [isTableShow, setIsTableShow] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const fetchAccessToken = async () => {
    await getAccessTokenSilently()
      .then(async (response) => {
        localStorage.setItem("access_token", response);
        return await fetchAuthorizationToken().then(() => {
          return true;
        });
      })
      .catch((error) => {
        toast("Login required", { type: "error", position: "top-center" });
        console.error("Error while fetching token", error);
        setIsLoading(false);
      });
  };
  const fetchAuthorizationToken = async () => {
    const body = {
      grant_type: process.env.REACT_APP_AUTH_GRANT_TYPE,
      client_id: process.env.REACT_APP_M2M_CLIENT_ID,
      client_secret: process.env.REACT_APP_M2M_CLIENT_SECRET,
      audience: process.env.REACT_APP_M2M_AUDIENCE,
    };
    if (
      localStorage.getItem("access_token") &&
      localStorage.getItem("access_token").toString().length > 0
    ) {
      const authorizationResponse = await Axios(
        "https://dev-34chvqyi4i2beker.jp.auth0.com/oauth/token",
        "POST",
        body,
        null
      );
      if (!axios.isAxiosError(authorizationResponse)) {
        localStorage.setItem(
          "auth_access_token",
          authorizationResponse.access_token
        );
        dispatch(
          addAuthorizationCode({ code: authorizationResponse.access_token })
        );
      } else {
        console.error(
          "Error while fetching authorization token ::",
          authorizationResponse
        );
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      !localStorage.getItem("access_token") &&
      !localStorage.getItem("auth_access_token")
    ) {
      fetchAccessToken();
      setIsLoading(true);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      {loading ? (
        <AppSpinner />
      ) : (
        <div className="container">
          <ContentHeader
            title="Business Partners"
            description="Open a BP to amend their details or manage its assigned Members"
            customStyle={""}
          />
          <div className="position-relative">
            <div>
              <BPtabel />
            </div>
            <div className="position-absolute end-0 p-0 me-4 customizePosition">
              <AddBP
                setIsPasteModelShow={setIsPasteModelShow}
                isPasteCancel={isPasteCancel}
                setIsPasteCancel={setIsPasteCancel}
              />
            </div>
            <div>
              <ImportUserModal
                action="Add_BP"
                isPasteModelShow={isPasteModelShow}
                setIsPasteCancel={setIsPasteCancel}
                setTableData={setTableData}
                setIsTableShow={setIsTableShow}
              />
            </div>
            <div>
              <TableData
                tableHeader="Import BP's"
                columnType={"bpColumn"}
                data={tableData}
                isTableShow={isTableShow}
                setIsTableShow={setIsTableShow}
                setTableData={setTableData}
                setIsPasteModelShow={setIsPasteModelShow}
                setIsPasteCancel={setIsPasteCancel}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BP;
