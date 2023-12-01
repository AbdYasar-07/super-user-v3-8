import React, { useState, useEffect } from "react";
import Search from "../../../Utils/Search";
import { useNavigate } from "react-router-dom";
import DataGridTable from "../../../Utils/DataGridTable";
import Axios from "../../../Utils/Axios";
import {
  addManagementAccessToken,
  renderComponent,
  renderingCurrentUser,
} from "../../../store/auth0Slice";
import { useDispatch, useSelector } from "react-redux";
import AppSpinner from "../../../Utils/AppSpinner";
import { checkUserExistsInOSC, getAllSystemGroupsFromAuth0 } from "../../BusinessLogics/Logics";
import RefreshButton from "../../../Utils/RefreshButton";

const MemberTable = () => {
  const [filterRecord, setFilteredRecord] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [loading, setLoad] = useState(false);
  const [memberData, setMemberData] = useState([]);
  const [actualMembers, setActualMembers] = useState([]);
  const [allGroups, setAllGroups] = useState([]);

  const [serverPaginate, setServerPagnitae] = useState({
    start: 0,
    length: 0,
    total: -1,
    processedRecords: 0,
    users: [],
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth0Context = useSelector((state) => state.auth0Context);
  const resource = process.env.REACT_APP_AUTH_MANAGEMENT_AUDIENCE;
  const endpoint = process.env.REACT_APP_MANAGEMENT_API;
  const authorizationExtUrl = process.env.REACT_APP_AUTH_EXT_RESOURCE;

  const getCurrentData = (currentData) => {
    const filteredRecord = actualMembers.filter((member) => {
      return member.user_id === currentData.id;
    });
    dispatch(renderingCurrentUser({ currentUser: filteredRecord[0] }));
    navigate(`/members/${currentData.id}/roles/assigned`);
  };

  useEffect(() => {
    fetchMembersList();
  }, []);

  useEffect(() => {
    if (auth0Context?.refreshUnRelatedComponent?.target === "MEMBER") {
      getMembersList(false);
      dispatch(renderComponent({ cmpName: "" }));
    }
  }, [auth0Context?.refreshUnRelatedComponent?.render])
  const fetchMembersList = async () => {
    if (auth0Context?.refreshUnRelatedComponent?.target === "") {
      await getMembersList(true);
    }
  }
  const fetchManagementToken = async () => {
    const body = {
      grant_type: process.env.REACT_APP_AUTH_GRANT_TYPE,
      client_id: process.env.REACT_APP_M2M_CLIENT_ID,
      client_secret: process.env.REACT_APP_M2M_CLIENT_SECRET,
      audience: process.env.REACT_APP_AUDIENCE,
    };
    return await Axios(endpoint, "POST", body, null, true).then((response) => {
      dispatch(
        addManagementAccessToken({
          managementAccessToken: response.access_token,
        })
      );
      return response;
    });
  };

  const getMembersList = async (isBpFirst) => {
    setLoad(true);
    let managementResponse = null;
    if (!auth0Context?.managementAccessToken && auth0Context?.managementAccessToken?.length === 0) {
      managementResponse = await fetchManagementToken();
    }
    let response = await fetchAuth0Users(
      100,
      "conception",
      (managementResponse?.access_token) ? managementResponse?.access_token : auth0Context?.managementAccessToken,
      serverPaginate
    );
    const groupsResponse = await getAllAuth0Groups(response);
    if (Array.isArray(response.users) && Array.isArray(groupsResponse)) {
      filterUsersByDatabase(response.users, "conception", groupsResponse, isBpFirst);
      setAllGroups(groupsResponse);
    }
    setLoad(false);
  };

  const getAllAuth0Groups = async () => {
    let url = `${authorizationExtUrl}/groups`;
    const response = await getAllSystemGroupsFromAuth0(url, localStorage.getItem("auth_access_token"));
    if (response) {
      const filteredResponse = response?.groups?.filter((group) => String(group?.name).includes("BP_")).map((group) => {
        return {
          groupId: group?._id,
          groupName: group?.name,
          groupDescription: group?.description
        };
      });
      return filteredResponse;
    }
  }

  const filterUsersBy = (bpFirst, filteredUsers, filteredUsersNotInBp) => {
    if (bpFirst) {
      return [...filteredUsers, ...filteredUsersNotInBp];
    } else {
      return [...filteredUsersNotInBp, ...filteredUsers];
    }
  }

  const filterUsersByDatabase = (users, databaseName, groupsResponse, isBpFirst) => {
    if (users.length === 0) return;

    // criteria 1 : filter for Conception database
    const filteredByConceptionDatabase = users.filter((user) => {
      if (hasSingleIdentityWithConnectionName(user, databaseName)) return user;
    });

    // criteria 2 : filter for BP_
    const filteredUsers = filteredByConceptionDatabase.filter((user) =>
      user?.app_metadata?.authorization?.groups?.some((group) =>
        group.startsWith("BP_")
      )
    );

    // criteria 3 : filter for non BP_ 
    const filteredUsersNotInBp = filteredByConceptionDatabase.filter((user) =>
      !user?.app_metadata?.authorization?.groups?.some((group) =>
        group.startsWith("BP_")
      )
    );

    let clubedUsers = filterUsersBy(isBpFirst, filteredUsers, filteredUsersNotInBp);

    if (Array.isArray(clubedUsers)) {
      setActualMembers(clubedUsers);
      const members = clubedUsers.map((filteredUser) => {
        let indexOfBpGroup = -1;
        filteredUser?.app_metadata?.authorization?.groups?.forEach(
          (group, index) => {
            if (String(group).startsWith("BP_")) {
              indexOfBpGroup = index;
            }
          }
        );
        return {
          id: filteredUser.user_id,
          Name: filteredUser.name,
          Email: filteredUser.email,
          LastLogin: formatTimestamp(filteredUser.last_login),
          Logins: filteredUser.logins_count,
          BPID: (filteredUser?.app_metadata?.authorization?.groups[indexOfBpGroup] && filteredUser?.app_metadata?.authorization?.groups[indexOfBpGroup].substring(3).length == 10) ? filteredUser?.app_metadata?.authorization?.groups[indexOfBpGroup].substring(3) : "Unassigned",
          BPName: (groupsResponse?.filter((group) => group?.groupName === filteredUser?.app_metadata?.authorization?.groups[indexOfBpGroup])[0]) ? groupsResponse?.filter((group) => group?.groupName === filteredUser?.app_metadata?.authorization?.groups[indexOfBpGroup])[0]?.groupDescription : "-"
        };
      });
      setFilteredRecord(members);
      setMemberData(members);
    }
  };

  function hasSingleIdentityWithConnectionName(user, connectionName) {
    if (
      user &&
      user.identities &&
      Array.isArray(user.identities) &&
      user.identities.length === 1
    ) {
      return user.identities[0].connection === connectionName;
    }

    return false;
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return "Never";
    }
    const date = new Date(timestamp);
    const now = new Date();

    const diffInMilliseconds = Math.abs(now - date);
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  /**
   * @description : It is an recursive function so pass the argument properly
   * @author Abdul Yashar
   */
  const fetchAuth0Users = async (perPage, database, managementAccessToken, serverPaginate) => {
    if (serverPaginate.processedRecords === serverPaginate.total) {
      return serverPaginate;
    }

    let url = `${resource}users?per_page=${perPage}&include_totals=true&connection=${database}&search_engine=v3&page=${serverPaginate.start}`;
    const response = await Axios(url, "get", null, managementAccessToken, false);

    const updatedServerPaginate =
    {
      start: serverPaginate.start + 1,
      length: response.length,
      total: response.total,
      processedRecords: serverPaginate.processedRecords + response.length,
      users: [...serverPaginate?.users, ...response?.users],
    };

    setServerPagnitae(updatedServerPaginate);

    // recursive call
    return await fetchAuth0Users(
      perPage,
      database,
      managementAccessToken,
      updatedServerPaginate
    );
  };

  return (
    <>
      <div className="py-4">
        {!loading && <Search
          records={memberData}
          setRecords={setFilteredRecord}
          isSearchActived={setIsSearchActive}
          setLoadSpinner={setLoad}
          data={memberData}
        />}
        <div className="position-absolute end-0 p-0  customizePosition">
          <RefreshButton isRefresh={loading} onClick={fetchMembersList} />
        </div>
      </div>
      {!loading && (
        <DataGridTable
          data={filterRecord}
          rowHeader={[
            "Name",
            "Email",
            "Last Login",
            "Logins",
            "BP ID",
            "BP Name"
          ]}
          getCurrentData={getCurrentData}
          loading={loading}
          emptyMessage={"No Members Found."}
        />
      )}
      {loading && <AppSpinner />}
    </>
  );
};
export default MemberTable;


