import React from "react";
import { FaSearch } from "react-icons/fa";

/**
 *
 * @param {[]} setRecords - to store the filtered records from the given data
 * @param {[]} records - pass the data where you want to filter from basically the context of the data
 * @param {boolean} setLoadSpinner - In case of heavy data volume you can pass the spinner for the component to load while searching records for
 * @description - This will check for the records irrespective of the all keys. will return the matched records
 * @returns list of searched records in the form of array of objects || will retrun an empty list or collection []
 * @author k.Abdul Yashar
 */

const Search = ({
  setRecords,
  records,
  setLoadSpinner,
  data,
  isSearchActived,
  lastTrackofPage,
}) => {
  const handleSearch = (value) => {
    if (value) {
      setLoadSpinner(true);
      // eslint-disable-next-line array-callback-return
      const searchedRecords = data?.filter((record) => {
        for (const key in record) {
          if (
            record[key] &&
            String(record[key]).toLowerCase().includes(value.toLowerCase())
          ) {
            return record;
          }
        }
      });

      setRecords(searchedRecords);
      value.length !== 0 ? isSearchActived(true) : isSearchActived(false);
      setLoadSpinner(false);
      return;
    }

    setRecords(data);
  };

  return (
    <div className="container ms-auto mt-3">
      <div className="input-group mb-3 w-25">
        <input
          type="text"
          style={{
            font: "1.15rem/1.85rem var(--bs-font-sans-serif)",
            fontWeight: "400",
            color: "rgb(114, 114, 114)",
          }}
          className="form-control p-1 px-3 border-1"
          placeholder="Search here...."
          aria-describedby="basic-addon2"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="input-group-append">
          <button className="btn btn-primary p-2 px-3" type="button" dis>
            <i>
              <FaSearch />
            </i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
