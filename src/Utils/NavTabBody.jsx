import React from "react";

function NavTabBody({ showDesc, description }) {
  return (  
    showDesc && (
      <div className="d-flex align-items-center justify-content-around">
        <div>
          <p>{description}</p>
        </div>
      </div>
    )
  );
}

export default NavTabBody;
