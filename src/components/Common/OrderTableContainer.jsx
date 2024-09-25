import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";

import { Table, Row, Col, Button, Input, Label } from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filters";
import { useFormik } from "formik";
import * as Yup from "yup";
import { height } from "dom7";

    // Ensure the script runs after the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function () {
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const dateDifferenceOutput = document.getElementById('date-difference');

        startDateInput.addEventListener('change', calculateDateDifference);
        endDateInput.addEventListener('change', calculateDateDifference);

        function calculateDateDifference() {
            const startDateValue = startDateInput.value;
            const endDateValue = endDateInput.value;

            if (startDateValue && endDateValue) {
                const startDate = new Date(startDateValue);
                const endDate = new Date(endDateValue);

                if (startDate <= endDate) {
                    const timeDifference = endDate.getTime() - startDate.getTime();
                    const daysDifference = timeDifference / (1000 * 3600 * 24);
                    dateDifferenceOutput.textContent = `${daysDifference} days`;
                } else {
                    dateDifferenceOutput.textContent = 'End date must be after start date';
                }
            } else {
                dateDifferenceOutput.textContent = '';
            }
        }
    });


// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Col sm={4}>
      <div className="search-box me-2 mb-2 d-inline-block">
        <div className="position-relative">
          <label htmlFor="search-bar-0" className="search-label">
            <span id="search-bar-0-label" className="sr-only">
              Search this table
            </span>
            <input
              onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.value);
              }}
              id="search-bar-0"
              type="text"
              className="form-control"
              placeholder={`${count} records...`}
              value={value || ""}
            />
          </label>
          <i className="bx bx-search-alt search-icon"></i>
        </div>
      </div>
    </Col>
  );
}

const TradingTableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isSubNav,
  navName,
  navId,
  isPagination,
  isAddOptions,
  isAddUserList,
  isExport,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  customPageSize,
  className,
  customPageSizeOptions,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        sortBy: [
          {
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };

  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };
  return (
    <Fragment>
      <Row className="mb-3">
        <Col md={customPageSizeOptions ? 2 : 1}>
          {/* <select
            className="form-select"
            value={pageSize}
            onChange={onChangeInSelect}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select> */}
          {isSubNav && (
            <div className="input-group">
              <Label htmlFor="formFileLg" className="form-label">
                Navigation Title
              </Label>
              <Input
                id="inputGroupFile04"
                aria-describedby="inputGroupFileAddon04"
                aria-label="Upload"
                type="text"
                className="form-control form-control"
              />

              <button
                className="btn btn-primary"
                type="button"
                id="inputGroupFileAddon04"
              >
                Edit
              </button>
            </div>
          )}
        </Col>

        {isAddOptions && (
          <Col sm="11">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded  mb-2 me-2"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New Order
              </Button>
            </div>
          </Col>
        )}
        {isExport && (
          <Col sm="11">
            <div className="text-sm-end">
              <Button
                type="button"
                color="primary"
                className="btn-rounded  mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdi-plus me-1" />
                Export
              </Button>
            </div>
          </Col>
        )}
        {isAddUserList && (
          <Col sm="11">
            <div className="text-sm-end">
              <Button
                type="button"
                color="primary"
                className="btn mb-2 me-2"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus-circle-outline me-1" />
                Create New User
              </Button>
            </div>
          </Col>
        )}
        {isAddCustList && (
          <Col sm="12">
            <div className="text-sm-start" >
                <div className="add-orderlog col-md-12">
                  <div class="col-5">
                    <select className="select-script col-5" id="cars" name="cars">
                        <option value="" disabled selected>All Script</option>
                        <option value="TATA POWER">NIFTY</option>
                        <option value="BCG">BANK NIFTY</option>
                        <option value="SIEMENS">SIEMENS</option>
                        <option value="LALPATHLAB">LALPATHLAB</option>
                        <option value="HINDCOPPER">HINDCOPPER</option>
                        <option value="M & M">M & M</option>
                        <option value="COCHIN SHIPYARD">COCHIN SHIPYARD</option>
                    </select>
                    <select className="select-script col-5" id="cars" name="cars">
                        <option value="" disabled selected>All Strategy</option>
                        <option value="TATA POWER">NIFTY</option>
                        <option value="BCG">BANK NIFTY</option>
                        <option value="SIEMENS">SIEMENS</option>
                        <option value="LALPATHLAB">LALPATHLAB</option>
                        <option value="HINDCOPPER">HINDCOPPER</option>
                        <option value="M & M">M & M</option>
                        <option value="COCHIN SHIPYARD">COCHIN SHIPYARD</option>
                    </select>
                    </div>
                    <div class="date-range-container col-5">
                        <input type="date" id="start-date" />
                        <span><b>To</b></span>
                        <input type="date" id="end-date" />
                        <span class="date-difference" id="date-difference"></span>
                    </div>
                    <div class="total-records col-2">
                        <h5>Total Records: 8</h5>
                    </div>
   
                </div>
            </div>
          </Col>
        )}
      </Row>

      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id}>
                    <div {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </div>
                    {/* <Filter column={column} /> */}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className="myTbody">
            {page.length === 0 ? (
              <tr>
              <td colSpan={columns.length} className="text-center">
                <span className="d-inline-flex align-items-center justify-content-center">
                  <i
                    className="mdi mdi-alert-circle-outline"
                    style={{ fontSize: "16px", marginRight: "0.5rem", color: "#b18d57" }}
                  ></i>
                  <span style={{ fontSize: "16px" }}>No records found</span>
                </span>
              </td>
            </tr>
            ) : (
              page.map((row) => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row.cells.map((cell) => (
                        <td
                          key={cell.id}
                          style={{ minWidth: "8rem" }}
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  </Fragment>
                );
              })
            )}
          </tbody>
        </Table>
      </div>
      {isPagination && (
        <Row className="justify-content-md-end justify-content-center align-items-center">
          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {"<<"}
              </Button>
              <Button
                color="primary"
                onClick={previousPage}
                disabled={!canPreviousPage}
              >
                {"<"}
              </Button>
            </div>
          </Col>
          <Col className="col-md-auto d-none d-md-block">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </Col>

          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={nextPage}
                disabled={!canNextPage}
              >
                {">"}
              </Button>
              <Button
                color="primary"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {">>"}
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

TradingTableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TradingTableContainer;

