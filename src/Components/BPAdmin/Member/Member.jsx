import React, { useEffect, useState } from "react";
import ContentHeader from "../../Contents/ContentHeader";
import AddUser from "../../Users/AddUser";
import MemberTable from "./MemberTable";
import "../../Styles/Member.css";
import ImportUserModal from "../../../Utils/ImportUserModal";
import TableData from "../../../Utils/TableData";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import Axios from "../../../Utils/Axios";
import { useDispatch } from "react-redux";

const Member = () => {
  const [isUserAdded, setIsUserAdded] = useState(false);
  const [isTokenFetched, setIsTokenFteched] = useState(false);
  const [isPasteModelShow, setIsPasteModelShow] = useState(false);
  const [isPasteCancel, setIsPasteCancel] = useState(false);
  const [isTableShow, setIsTableShow] = useState(false);
  const [tableData, setTableData] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const fetchAccessToken = async () => {
    const token_response = await getAccessTokenSilently();
    if (token_response) {
      localStorage.setItem("access_token", token_response);
      const response = await fetchAuthorizationToken();
      if (response)
        localStorage.setItem("auth_access_token", response.access_token);
    } else {
      toast("Login required", { type: "error", position: "top-center" });
      console.error("Error ::", token_response);
    }
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
      return authorizationResponse;
    }
  };

  useEffect(() => {
    if (
      !localStorage.getItem("access_token") &&
      !localStorage.getItem("auth_access_token")
    ) {
      fetchAccessToken();
    }
  }, []);


  return (
    <div className="container">
      <ContentHeader
        title="Maintain Members"
        description=""
        customStyle={"fs-3 text-secondary"}
      />
      <div className="position-relative">
        <div>
          <MemberTable />
        </div>
        <div className="position-absolute end-0 p-0 customizePosition" style={{ marginRight: "80px" }}>
          <AddUser
            buttonLabel="Member"
            setIsUserAdded={setIsUserAdded}
            isTokenFetched={isTokenFetched}
            setIsPasteModelShow={setIsPasteModelShow}
            isPasteCancel={isPasteCancel}
            setIsPasteCancel={setIsPasteCancel}
          />

        </div>

        <div>
          <ImportUserModal
            action="Add_User"
            isPasteModelShow={isPasteModelShow}
            setIsPasteCancel={setIsPasteCancel}
            setTableData={setTableData}
            setIsTableShow={setIsTableShow}
          />
        </div>
        <div>
          <TableData
            columnType={"user"}
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
  );
};

export default Member;
