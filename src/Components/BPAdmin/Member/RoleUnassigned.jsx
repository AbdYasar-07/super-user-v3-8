import React from "react";
import NavTabBody from "../../../Utils/NavTabBody";
import NavTabTable from "../../../Utils/NavTabTable";

const RoleUnassigned = () => {
  return (
    <div>
      {" "}
      <div>
        <div className="container">
          <NavTabBody
            showDesc={true}
            description={process.env.REACT_APP_AUTH_ALLROLES_DESC}
          />
          <NavTabTable
            columns={["Name", "Application", "Description"]}
            showTable={true}
            scope={"Roles"}
            showDeleteButton={false}
            isUserAllGroups={false}
            isRoles={true}
            isUserAllRoles={true}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleUnassigned;
