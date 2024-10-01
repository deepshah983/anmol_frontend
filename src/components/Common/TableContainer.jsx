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

const TableContainer = ({
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
          <Col sm="12">
          <div className="text-sm-start">
            <Button
              type="button"
              color="success"
              className="btn-rounded mb-2 me-2"
              onClick={handleCustomerClick}
            >
              <i className="mdi mdis-plus " />
            </Button>
          </div>
        </Col>
        )}
        {isAddCustList && (
          <Col sm="12">
            <div className="text-sm-start">
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdis-plus " />
              </Button>
              
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
                          style={{ minWidth: "3rem" }}
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
      {isPagination && page.length > 10 && (
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

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;
