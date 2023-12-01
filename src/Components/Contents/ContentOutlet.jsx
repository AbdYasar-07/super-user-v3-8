import React, { useState } from "react";
import ContentHeader from "../Contents/ContentHeader";
import ContentBody from "../Contents/ContentBody";
import AddUser from "../Users/AddUser";
import ImportUserModal from "../../Utils/ImportUserModal";
import TableData from "../../Utils/TableData";

const ContentOutlet = () => {
  const [isUserAdded, setIsUserAdded] = useState(false);
  const [isTokenFetched, setIsTokenFteched] = useState(false);
  const [isPasteModelShow, setIsPasteModelShow] = useState(false);
  const [isPasteCancel, setIsPasteCancel] = useState(false);
  const [isTableShow, setIsTableShow] = useState(false);
  const [tableData, setTableData] = useState([]);
  return (
    <div className="container">
      <ContentHeader
        title="Users"
        description="Open a user to add them to a group or assign them to a role"
      />
      <div className="position-relative mt-5 p-0">
        <ContentBody
          isUserAdded={isUserAdded}
          setIsTokenFteched={setIsTokenFteched}
        />
        <div className="position-absolute top-0 end-0 p-0 me-4">
          <AddUser
            buttonLabel="User"
            setIsUserAdded={setIsUserAdded}
            isTokenFetched={isTokenFetched}
            setIsPasteModelShow={setIsPasteModelShow}
            isPasteCancel={isPasteCancel}
            setIsPasteCancel={setIsPasteCancel}
          />
        </div>
        <div>
          <ImportUserModal
            action="Add_User"
            isPasteModelShow={isPasteModelShow}
            setIsPasteCancel={setIsPasteCancel}
            setTableData={setTableData}
            setIsTableShow={setIsTableShow}
          />
        </div>
        <div>
          <TableData
            columnType={"user"}
            data={tableData}
            isTableShow={isTableShow}
            setIsTableShow={setIsTableShow}
            setTableData={setTableData}
            setIsPasteModelShow={setIsPasteModelShow}
            setIsPasteCancel={setIsPasteCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentOutlet;
