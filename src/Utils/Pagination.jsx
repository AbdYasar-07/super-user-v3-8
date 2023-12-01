import React from "react";
import "../Components/Styles/Paginator.css";
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <>
      <ul className="pagination justify-content-end">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link footerNavButton"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &laquo;
          </button>
        </li>
        {Array.from({ length: totalPages }).map((_, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
          >
            <button
              className="page-link footerNavButton "
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link footerNavButton"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </>
  );
};

export default Pagination;
