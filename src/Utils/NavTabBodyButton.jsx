import React from "react";
import AppModal from "./AppModal";

const NavTabBodyButton = ({
  showButton,
  buttonLabel,
  isAdded,
  setIsAdded,
  isRoles,
  scopes,
  dialogBoxHeader,
  isDeleted,
}) => {
  return (
    showButton && (
      <div>
        <AppModal
          buttonLabel={buttonLabel}
          showButton={true}
          dialogBoxHeader={dialogBoxHeader}
          tableRow={["Name", "Description"]}
          scopes={scopes}
          isAdded={isAdded}
          setIsAdded={setIsAdded}
          isRoles={isRoles}
          isDeleted={isDeleted}
        />
      </div>
    )
  );
};

export default NavTabBodyButton;
