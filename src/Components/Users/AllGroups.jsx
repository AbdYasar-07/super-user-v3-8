import React from "react";
import NavTabBody from "../../Utils/NavTabBody";
import NavTabTable from "../../Utils/NavTabTable";

const AllGroups = () => {
  return (
    <div>
      <div className="container">
        <NavTabBody
          showDesc={true}
          description={process.env.REACT_APP_AUTH_ALLGROUPS_DESC}
        />
        <NavTabTable
          columns={["Name", "Description"]}
          showTable={true}
          showDeleteButton={false}
          isUserAllGroups={true}
          scope={"All-Groups"}
        />
      </div>
    </div>
  );
};

export default AllGroups;
