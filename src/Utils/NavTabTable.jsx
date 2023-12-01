import React, { useEffect, useState } from "react";
import Axios from "./Axios";
import { useParams } from "react-router";
import AppSpinner from "./AppSpinner";
import { FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { error } from "jquery";
import { toMapApplicationNames } from "../Components/BusinessLogics/Logics";

const NavTabTable = ({
  showTable,
  columns,
  isAdded,
  setIsAdded,
  showDeleteButton,
  scope,
  isDeleted,
  setIsDeleted,
  isUserAllGroups,
  isUserAllRoles,
  isRoles,
}) => {
  const [userGroups, setUserGroups] = useState([]);
  const { userId, memberId } = useParams();
  const resource = process.env.REACT_APP_AUTH_EXT_RESOURCE;
  const [loadSpinner, setLoadSpinner] = useState(false);
  const [userAllGroups, setUserAllGroups] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [userAllRoles, setUserAllRoles] = useState([]);

  const loaction = useLocation();
  const [tableValue, setTableValue] = useState(false);

  const getUserGroups = async (accessToken, userId) => {
    await Axios(
      resource + `/users/${userId ? userId : memberId}/groups`,
      "GET",
      null,
      accessToken
    )
      .then((groups) => {
        setUserGroups(groups);
        setIsAdded(false);
      })
      .catch((error) => {
        console.error("Error while fetching user groups :::", error);
      })
      .finally(() => {
        setLoadSpinner(false);
      });
  };

  const getUserAllGroups = async (accessToken, userId) => {
    await Axios(
      resource + `/users/${userId ? userId : memberId}/groups/calculate`,
      "GET",
      null,
      accessToken
    )
      .then((response) => {
        setUserAllGroups(response);
      })
      .catch((error) => {
        console.error(
          "Error while getting user's calculated all groups :::",
          error
        );
      })
      .finally(() => setLoadSpinner(false));
  };

  const fetchCurrentUserRoles = async () => {
    return await Axios(
      resource + `/users/${userId ? userId : memberId}/roles`,
      "GET",
      null,
      localStorage.getItem("auth_access_token")
    );
  };

  const fetchUserRoles = async () => {
    await fetchCurrentUserRoles()
      .then(async (userRoles) => {
        await getClientsInfo().then((clientsInfo) => {
          if (toMapApplicationNames(userRoles, clientsInfo).length > 0) {
            let roles = toMapApplicationNames(userRoles, clientsInfo);
            if (memberId) {
              const filteredRoles = roles.filter((role) =>
                String(role.name).startsWith("PSP_BP")
              );
              setUserRoles(filteredRoles);
            } else {
              setUserRoles(roles);
            }
          }
        });
        setLoadSpinner(false);
      })
      .catch((error) => {
        setLoadSpinner(false);
        console.log(error);
      });
  };

  const getUserAllRoles = async (accessToken, userId) => {
    var response = null;
    if (memberId) {
      response = await Axios(
        resource + `/roles`,
        "GET",
        null,
        localStorage.getItem("auth_access_token")
      );
    } else {
      response = await Axios(
        resource + `/users/${userId ? userId : memberId}/roles/calculate`,
        "GET",
        null,
        accessToken
      );
    }
    await getClientsInfo()
      .then(async (clientsInfo) => {
        if (memberId) {
          let totalRoles = toMapApplicationNames(response.roles, clientsInfo);
          let filteredAllRoles = totalRoles.filter((role) =>
            String(role.name).startsWith("PSP_BP")
          );
          const userRolesResponse = await fetchCurrentUserRoles();
          const remRoles = filteredAllRoles.filter(
            (item) =>
              !userRolesResponse
                .filter((role) => String(role.name).startsWith("PSP_BP"))
                .some((obj) => obj._id === item._id)
          );
          setUserAllRoles(remRoles);
        } else {
          setUserAllRoles(toMapApplicationNames(response, clientsInfo));
        }
        setLoadSpinner(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadSpinner(false);
      });
  };

  const getManagementToken = async () => {
    let managementApi = process.env.REACT_APP_MANAGEMENT_API;
    let data = {
      client_id: process.env.REACT_APP_AUTH_MANAGEMENT_CLIENT_ID,
      client_secret: process.env.REACT_APP_AUTH_MANAGEMENT_CLIENT_SECRET,
      audience: process.env.REACT_APP_AUTH_MANAGEMENT_AUDIENCE,
      grant_type: "client_credentials",
    };

    return await Axios(managementApi, "POST", data, null, true)
      .then((response) => {
        return response?.access_token;
      })
      .catch((error) => {
        console.error("error ::", error);
      });
  };

  const getClientsInfo = async () => {
    return await getManagementToken().then(async (tkn) => {
      return await Axios(
        process.env.REACT_APP_AUTH_GET_CLIENT_INFO,
        "GET",
        null,
        tkn,
        true
      )
        .then((response) => {
          if (response && response?.clients?.length > 0) {
            return response?.clients;
          }
        })
        .catch((error) => console.log(error));
    });
  };

  const remove = async (id, scope) => {
    setLoadSpinner(true);
    const resource = process.env.REACT_APP_AUTH_EXT_RESOURCE;
    switch (scope?.toLowerCase()) {
      case "group": {
        await Axios(
          resource + `/groups/${id}/members`,
          "DELETE",
          [`${userId ? userId : memberId}`],
          localStorage.getItem("auth_access_token")
        )
          .then((response) => {
            setIsDeleted(true);
          })
          .catch((error) => {
            console.error(
              `Error while removing user from a ${scope} :::`,
              error
            );
          });
        break;
      }
      case "assigned-roles":
      case "roles": {
        await Axios(
          resource + `/users/${userId ? userId : memberId}/roles`,
          "DELETE",
          [`${id}`],
          localStorage.getItem("auth_access_token")
        )
          .then((response) => {
            setIsDeleted(true);
          })
          .catch((error) => {
            console.error(
              `Error while removing user from a ${scope} :::`,
              error
            );
          });
        break;
      }
      default: {
        console.log("Default case worked...");
        setLoadSpinner(false);
      }
    }
  };

  useEffect(() => {
    setLoadSpinner(true);
    if (!isRoles && !isUserAllGroups) {
      const callUserGroups = async () => {
        await getUserGroups(
          localStorage.getItem("auth_access_token") || "",
          userId ? userId : memberId
        );
      };

      callUserGroups();
    }
    if (!isRoles && isUserAllGroups) {
      getUserAllGroups(
        localStorage.getItem("auth_access_token") || "",
        userId ? userId : memberId
      );
    }

    if (isRoles) {
      if (!isUserAllRoles) {
        fetchUserRoles();
      }
      if (isUserAllRoles) {
        getUserAllRoles(
          localStorage.getItem("auth_access_token") || "",
          userId ? userId : memberId
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdded, isDeleted]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (loaction.pathname.endsWith("allroles")) scope = "All-Roles";
    else if (loaction.pathname.endsWith("unassigned"))
      scope = "Unassigned-Roles";
    else if (loaction.pathname.endsWith("assigned")) scope = "Assigned-Roles";

    switch (scope) {
      case "Group":
        userGroups.length === 0 ? setTableValue(true) : setTableValue(false);
        break;
      case "All-Groups":
        userAllGroups.length === 0 ? setTableValue(true) : setTableValue(false);
        break;
      case "Roles":
      case "Assigned-Roles":
        userRoles.length === 0 ? setTableValue(true) : setTableValue(false);
        break;
      case "All-Roles":
      case "Unassigned-Roles":
        userAllRoles.length === 0 ? setTableValue(true) : setTableValue(false);
        break;
      default:
        console.log("None of the scope hasn't been matched");
    }
  }, [userGroups, userAllGroups, userRoles, userAllRoles]);
  return (
    <>
      {loadSpinner && <AppSpinner />}
      {!loadSpinner && showTable && (
        <div>
          <table class="table">
            <thead>
              <tr>
                {columns.map((column, index) => {
                  return (
                    <th scope="col" key={index + 1}>
                      {column}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {!isRoles &&
                userGroups &&
                userGroups?.map((group, index) => {
                  return (
                    <tr key={group._id} title={group.name}>
                      <td id={group._id}>{group.name}</td>
                      <td key={index} id={group._id}>
                        {group.description}
                      </td>
                      {showDeleteButton && (
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => remove(group._id, scope)}
                          >
                            <FaTimes />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              {!isRoles &&
                userAllGroups &&
                userAllGroups?.map((group) => {
                  return (
                    <tr key={group._id} title={group.name}>
                      <td id={group._id}>{group.name}</td>
                      <td id={group._id} title={group.description}>
                        {group.description}
                      </td>
                      {showDeleteButton && (
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => remove(group._id, scope)}
                          >
                            <FaTimes />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              {isRoles &&
                userRoles &&
                userRoles?.map((role) => {
                  return (
                    <tr key={role._id} title={role.name}>
                      <td title={role.name}>{role.name}</td>
                      <td title={role.applicatioName}>
                        {role.applicationName}
                      </td>
                      <td title={role.description}>{role.description}</td>
                      {showDeleteButton && (
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => remove(role._id, scope)}
                          >
                            <FaTimes />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              {isRoles &&
                userAllRoles &&
                userAllRoles.map((role) => {
                  return (
                    <tr key={role._id} title={role.name}>
                      <td title={role.name} id={role._id}>
                        {role.name}
                      </td>
                      <td
                        title={role.applicationName}
                        id={role.applicationName}
                      >
                        {role.applicationName}
                      </td>
                      <td id={role._id} title={role.description}>
                        {role.description}
                      </td>
                      {showDeleteButton && (
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => remove(role._id, scope)}
                          >
                            <FaTimes />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
      {!loadSpinner && tableValue && (
        <p className="text-center fw-bold fs-6">
          No {scope.toLowerCase()} were found
        </p>
      )}
    </>
  );
};

export default NavTabTable;
