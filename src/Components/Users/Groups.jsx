import React, { useEffect, useState } from "react";
import NavTabBody from "../../Utils/NavTabBody";
import NavTabBodyButton from "../../Utils/NavTabBodyButton";
import NavTabTable from "../../Utils/NavTabTable";
import { useSelector } from "react-redux";

const Groups = () => {
  const [isAdded, setIsAdded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const currentSelectedUser = useSelector((store) => store.auth0Context.renderingUser);
  const userName = JSON.parse(JSON.stringify(currentSelectedUser)).name;

  useEffect(() => {
    setIsDeleted(false);
  }, [isDeleted]);

  return (
    <div className="container">
      <div className="d-flex justify-content-between mt-4 mb-4">
        <NavTabBody
          showDesc={true}
          description={process.env.REACT_APP_AUTH_GROUPS_DESC}
        />
        <NavTabBodyButton
          showButton={true}
          buttonLabel={"ADD USER TO GROUPS"}
          isAdded={isAdded}
          setIsAdded={setIsAdded}
          isRoles={false}
          scopes={"groups"}
          dialogBoxHeader={`Add ${userName} to one or more groups`}
        />
      </div>
      <NavTabTable
        columns={["Name", "Description", "Remove"]}
        showTable={true}
        isAdded={isAdded}
        setIsAdded={setIsAdded}
        showDeleteButton={true}
        scope={"Group"}
        isDeleted={isDeleted}
        setIsDeleted={setIsDeleted}
        isUserAllGroups={false}
        isRoles={false}
      />
    </div>
  );
};

export default Groups;
