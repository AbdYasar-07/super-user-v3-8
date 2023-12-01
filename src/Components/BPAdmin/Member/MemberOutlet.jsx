import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import NavTabHeader from "../../../Utils/NavTabHeader";
import MemberHeader from "./MemberHeader";
import { useDispatch, useSelector } from "react-redux";
import MultiSelector from "../../../Utils/MultiSelector";
import { Button } from "primereact/button";
import Axios from "../../../Utils/Axios";
import axios from "axios";
import { ToastContainer } from "react-bootstrap";
import { toast } from "react-toastify";
import { addBP } from "../../../store/auth0Slice";

const MemberOutlet = () => {
  const { memberId } = useParams();
  const [bpData, setBpData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isBpAdded, setIsBpAdded] = useState(true);
  const [businessPartner, setBusinessPartner] = useState([]);
  const auth0Context = useSelector((store) => store?.auth0Context);
  const resource = process.env.REACT_APP_AUTH_EXT_RESOURCE;
  const dispatch = useDispatch();

  useEffect(() => {
    checkForBpExists();
    getBusinessPartners();
  }, [])

  const checkForBpExists = () => {
    getGroupsForRenderedUser();
  }


  const getGroupsForRenderedUser = async () => {
    let url = `${resource}/users/${memberId}/groups`;
    const response = await Axios(url, 'GET', null, localStorage.getItem("auth_access_token"), false);
    if (!axios.isAxiosError(response)) {
      filterGroupsByName(response, "BP_");
    } else {
      toast.error("Error while retriving BP", { theme: "colored" });
      console.error("Error ***", response);
    }
  };

  const filterGroupsByName = (response, nameStartsWith) => {
    if (Array.isArray(response) && Array(response).length > 0) {
      const result = response.filter((group) => String(group.name).startsWith(nameStartsWith));
      if (result.length === 0) {
        setIsBpAdded(false);
      } else {
        setIsBpAdded(true);
      }
    }
  }

  const assignBp = async () => {
    if (businessPartner.length === 1) {
      setLoading(true);
      const bp_group = businessPartner[0];
      const url = `${resource}/groups/${bp_group.id}/members`;
      const data = [`${memberId}`]
      const response = await Axios(url, 'PATCH', data, localStorage.getItem("auth_access_token"), false);
      if (!axios.isAxiosError(response)) {
        dispatch(addBP({ addedBusinessPartner: bp_group }));
        toast.info(`${JSON.parse(JSON.stringify(auth0Context.renderingUser)).name} has been added to ${bp_group.bpName}`, { theme: "colored" });
        setLoading(false);
        setBusinessPartner([]);
        setIsBpAdded(true);
        setIsAdded(true);
      } else {
        toast.error(`Error ${response.cause.message}`);
        console.error("Error ***", response);
      }
    }
    return;
  };

  const getBusinessPartners = async () => {
    const bps = await getGroupsInSystem();
    if (bps) {
      const filteredBps = filterByGroupName(bps?.groups, bps?.total, "BP_");
      if (filteredBps) {
        setBpData(filteredBps);
      }
      return;
    }
    setBpData([]);
  }

  const getGroupsInSystem = async () => {
    const url = `${resource}/groups`;
    const response = await Axios(url, 'GET', null, localStorage.getItem("auth_access_token"), false);
    if (!axios.isAxiosError(response))
      return response;

    return null;
  };

  const filterByGroupName = (listOfGroups, total, startsWith) => {
    if (total === 0)
      return;

    const bpGroups = listOfGroups.filter((group) => String(group.name).startsWith(startsWith));
    if (bpGroups.length > 0) {
      const actualBpGroups = bpGroups.map((bpGroup) => {
        return {
          id: bpGroup._id,
          bpName: bpGroup.name,
          bpDescription: bpGroup.description,
          bpMembers: bpGroup.members
        }
      });
      return actualBpGroups;
    }
    return null;
  }

  return (
    <div>
      <MemberHeader userProfile={auth0Context.renderingUser} />
      {!isBpAdded && <div
        className="my-3 d-flex align-items-center"
        style={{ paddingLeft: "10px" }}
      >
        <MultiSelector
          options={bpData}
          placeholderValue="Assign to BP"
          propertyName="bpName"
          customizeTemplate={customizeTemplate}
          getSelectedValue={setBusinessPartner}
          filterByFields={"bpName,bpDescription"}
          isAdded={isAdded}
        />
        {businessPartner?.length > 0 && (
          <Button
            className="rounded ms-3"
            type="button"
            onClick={assignBp}
            loading={loading}
            style={{
              background: "#0d6efd",
              display: "inline-block",
              width: "140px",
              height: "40px",
              lineHeight: "14px",
            }}
          >
            + Assign
          </Button>
        )}
      </div>
      }
      <NavTabHeader
        showTab={true}
        tabsHeaders={["Roles Assigned", "Roles Unassigned"]}
      />
      <ToastContainer />
      <Outlet />
    </div >
  );
};

export default MemberOutlet;

const customizeTemplate = (option) => {
  return (
    <div className="d-flex align-items-center">
      <span
        className="mx-2"
        style={{
          width: "30px",
          height: "30px",
          lineHeight: "30px",
          borderRadius: "50%",
          background: "#9799ec",
          textAlign: "center",
          color: "#fff",
          fontSize: "14px",
        }}
      >
        BP
      </span>
      <div>
        <div>{option?.bpName}</div>
        <div>{option?.bpDescription}</div>
      </div>
    </div>
  );
};
