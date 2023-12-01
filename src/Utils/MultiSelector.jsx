import React, { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import "../Components/Styles/MultiSelector.css";
const MultiSelector = ({
  options,
  placeholderValue,
  propertyName,
  customizeTemplate,
  getSelectedValue,
  filterByFields,
  isAdded
}) => {
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    if (isAdded) {
      setSelectedValue(null);
    }
  }, [isAdded]);

  return (
    <div className="card flex justify-content-center col-lg-3">
      <MultiSelect
        selectionLimit={1}
        showSelectAll={false}
        value={selectedValue}
        filter
        filterBy={filterByFields}
        options={options}
        onChange={(e) => {
          setSelectedValue(e.value);
          getSelectedValue(e.value);
        }}
        optionLabel={propertyName}
        placeholder={placeholderValue || "Place holder"}
        itemTemplate={customizeTemplate}
        className="w-full md:w-20rem"
        display="chip"
      />
    </div>
  );
};

export default MultiSelector;
