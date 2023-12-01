import React from "react";

const ContentHeader = ({ title, description, customStyle }) => {
  return (
    <div className="container text-start col-6 ms-0 mt-3">
      <h1 className={`fw-normal ${customStyle}`}>{title}</h1>
      <h5 className="fw-light mt-3" style={{ color: "rgb(114 114 114)" }}>
        {description}
      </h5>
    </div>
  );
};

export default ContentHeader;


