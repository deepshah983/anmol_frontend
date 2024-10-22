import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import ReactPaginate from "react-paginate";
import Papa from 'papaparse';
import GoldenTradingLoader from '../../../components/Loader';
import Select from 'react-select';
import {
  Card,
  CardBody,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  Input,
  FormFeedback,
  Label,
  Form,
  FormGroup,
  Button,
} from "reactstrap";


//Import Breadcrumb
import { getData, postData, updateData, deleteData } from "../../../components/api";
import themeConfig from "../../../configs/themeConfig";
import DeleteModal from "../../../components/Common/DeleteModal";
import DeleteAllModal from "../../../components/Common/DeleteAllData";
import TradingTableContainer from "../../../components/Common/TradingTableContainer";

import { success, error } from "../../../components/toast";
// Column
import { Designation, Email } from "../../NavigationCol";

const index = (props) => {
  const [navs, setNavs] = useState([]);

  useEffect(() => {
    getNavigation();
    fetchScripts();
    fetchStrategies();
  }, []);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#fff', // Control background color
      borderColor: '#ced4da',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#fff', // Dropdown menu background color
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#f0f0f0' : '#fff',
      color: '#333',
    }),
  };
  const [strategies, setStrategies] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [navigation, setNav] = useState(null);
  const [showFields, setShowFields] = useState(false);
  const [showRadioButtons, setShowRadioButtons] = useState(false);
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = React.useState(true);
  const [importModal, setImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [query, setQuery] = useState({
    offset: 0,
    limit: 20,
    page: 0,
    search: "",
    order: "desc",
    sort: "id",
    status: "",
  });

  const exchangeClasses = {
    'NSE': 'exchange-nse',
    'NFO': 'exchange-nfo'
  };

  const request = (reset_offset = true) => {

    let url = `/tradingForm?limit=${query.limit}&page_no=${query.page + 1}&search=${query.search}`;
    getData(url).then((response) => {

      setNavs(response?.data?.data);
      setTotal(response?.data?.totalCount);
      setLoading(false);
    });


  };

  const getNavigation = () => {
    request();
  };

  /** New function to fetch scripts data*/
  const fetchScripts = () => {
    let url = `/scrips/fetch-instruments`;
    getData(url)
      .then((response) => {
        let instruments = response?.data;
        setScripts(response.data.data.instruments);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching scripts:", error);
      });
  };
  // New search function to fetch data based on input
  const searchScripts = (searchTerm) => {
    if (!searchTerm) {
      // If search term is empty, fetch all scripts
      fetchScripts();
      return;
    }

    let url = `/scrips/fetch-instruments?search=${searchTerm}`; // Adjust the endpoint as needed
    getData(url)
      .then((response) => {
        let instruments = response?.data;

        setScripts(response.data.data.instruments);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error searching scripts:", error);
      });
  };

  /** New function to fetch scripts data*/
  const fetchStrategies = () => {
    let url = `/strategies`;
    getData(url)
      .then((response) => {
        setStrategies(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching scripts:", error);
      });
  };



  /**start export import funtions */
  const handleExport = async () => {
    try {
      // Fetch all data from the server
      const response = await getData("/tradingForm/export");
      if (response.data.error) {
        return error(response.data.message);
      }

      // Prepare the CSV data
      const csvData = response.data.data.map(item => ({
        "Terminal Symbol": item.terminalSymbol,
        "Option Type": item.optionType,
        "Dynamic Expiry": item.dynamicExpiry,
        "Dynamic Strike": item.dynamicStrike,
        "Qty Type": item.qtyType,
        "Prod Type": item.prodType,
        "Entry Order": item.entryOrder,
        "Exit Order": item.exitOrder,
        "Strategy": item.strategy,
        "Price Buffer": item?.priceBuffer,
        "Price Buffer Type": item?.priceBufferType,
        "Trigger Price": item?.triggerPrice,
        "price": item?.price
      }));

      // Generate CSV file
      const csvContent = "data:text/csv;charset=utf-8,"
        + Object.keys(csvData[0]).join(",") + "\n"
        + csvData.map(row => Object.values(row).join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "trading_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      success("Data exported successfully");
    } catch (err) {
      error("Failed to export data");
      console.error(err);
    }
  };


  const handleImportClick = () => {
    setImportModal(true);
  };

  const handleFileChange = (event) => {
    setImportFile(event.target.files[0]);
  };

  const handleImport = () => {
    if (!importFile) {
      error("Please select a file to import");
      return;
    }

    Papa.parse(importFile, {
      complete: async (result) => {
        const importedData = result.data.slice(1).map(row => ({
          terminalSymbol: row['Terminal Symbol'],
          optionType: row['Option Type'],
          dynamicExpiry: row['Dynamic Expiry'],
          dynamicStrike: row['Dynamic Strike'],
          qtyType: row['Qty Type'],
          prodType: row['Prod Type'],
          entryOrder: row['Entry Order'],
          exitOrder: row['Exit Order'],
          strategy: row['Strategy'],
          priceBuffer: row['Price Buffer'],
          priceBufferType: row['Price Buffer Type'],
          triggerPrice: row['Trigger Price'],
          price: row['price']
        }));

        try {
          const response = await postData("tradingForm/import", importedData);
          if (response.data.error) {
            return error(response.data.message);
          }
          success("Data imported successfully");
          setImportModal(false);
          setImportFile(null);
          request(); // Refresh the data after import
        } catch (err) {
          error("Failed to import data");
          console.error(err);
        }
      },
      header: true,
    });
  };

  /**end export import funtions */

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'SLL') {
      setShowFields(true);
      setShowRadioButtons(false);
    } else if (selectedValue === 'market') {
      setShowFields(false);
      setShowRadioButtons(true);
    } else {
      setShowFields(false);
      setShowRadioButtons(false);
    }

    // Call the original handleChange from validation
    validation.handleChange(event);
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: (navigation && navigation.id) || "",
      terminalSymbol: (navigation && navigation.terminalSymbol) || "",
      optionType: (navigation && navigation.optionType) || "",
      dynamicExpiry: (navigation && navigation.dynamicExpiry) || "",
      dynamicStrike: (navigation && navigation.dynamicStrike) || "",
      qtyType: (navigation && navigation.qtyType) || "",
      prodType: (navigation && navigation.prodType) || "",
      entryOrder: (navigation && navigation.entryOrder) || "",
      exitOrder: (navigation && navigation.exitOrder) || "",
      strategy: (navigation && navigation.strategy) || "",
      portalUserId: (navigation && navigation.portalUserId) || "",
      portalPassword: (navigation && navigation.portalPassword) || "",
      userKey: (navigation && navigation.userKey) || "",
      appKey: (navigation && navigation.appKey) || "",
      priceBuffer: (navigation && navigation.priceBuffer) || "",
      priceBufferType: (navigation && navigation.priceBufferType) || "",
      price: (navigation && navigation.price) || "",
      triggerPrice: (navigation && navigation.triggerPrice) || "",
    },

    validationSchema: Yup.object().shape({
      terminalSymbol: Yup.string().required("Please Select Terminal Symbol"),
      optionType: Yup.string().required("Please Select Option Type"),
      dynamicExpiry: Yup.string().required("Please Select Dynamic Expiry"),
      dynamicStrike: Yup.string().required("Please Select Dynamic Strike"),
      qtyType: Yup.string().required("Please Select Qty Type"),
      prodType: Yup.string().required("Please Select Prod Type"),
      entryOrder: Yup.string().required("Please Select Entry Order"),
      exitOrder: Yup.string().required("Please Select Exit Order"),
      strategy: Yup.string().required("Please Select Strategy"),

      price: Yup.string().when('entryOrder', {
        is: 'SLL',
        then: Yup.string().required("Please Enter Price"),
        otherwise: Yup.string(),
      }),
      triggerPrice: Yup.string().when('entryOrder', {
        is: 'SLL',
        then: Yup.string().required("Please Enter Trigger Price"),
        otherwise: Yup.string(),
      }),
      priceBufferType: Yup.string().when('entryOrder', {
        is: 'market',
        then: Yup.string()
          .required("Please Select Price Buffer Type")
          .oneOf(['fixed', 'percent'], "Invalid Price Buffer Type"),
        otherwise: Yup.string(),
      }),

      priceBuffer: Yup.string().when(['entryOrder', 'priceBufferType'], {
        is: (entryOrder, priceBufferType) => entryOrder === 'market',
        then: Yup.string().required("Please Enter Price Buffer"),
        otherwise: Yup.string(),
      }),

    }),
    onSubmit: (values) => {
      let form = themeConfig.functions.read_form("traingForm");
      let formData = new FormData();
      Object.keys(form).map((key) => {
        formData.append(key, form[key]);
      });

      if (isEdit) {
        formData.append("id", values._id);
        updateNavigation(values.id, formData);
      } else {

        addNewNavigation(formData);

      }
      setShowFields(false);
      setShowRadioButtons(false);
      validation.resetForm();

      toggle();
    },
  });

  const handleReset = () => {
    validation.resetForm();
    setShowFields(false);
    setShowRadioButtons(false);
  };
  const addNewNavigation = (form_data) => {


    postData("tradingForm", form_data)
      .then((response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        query.page = 0;
        setQuery({ ...query });
        request();
        return success(response.data.message);
      });
  };

  const updateNavigation = (id, form_data) => {

    updateData(`tradingForm/${id}`, form_data)
      .then((response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        request();
        return success(response.data.message);
      });
  };
  const handleCustomerClick = (arg) => {
    const nav = arg;

    setNav({
      id: nav._id,
      terminalSymbol: nav.terminalSymbol,
      optionType: nav.optionType,
      dynamicExpiry: nav.dynamicExpiry,
      dynamicStrike: nav.dynamicStrike,
      qtyType: nav.qtyType,
      prodType: nav.prodType,
      entryOrder: nav.entryOrder,
      exitOrder: nav.exitOrder,
      strategy: nav.strategy,
      portalUserId: nav.portalUserId,
      portalPassword: nav.portalPassword,
      userKey: nav.userKey,
      appKey: nav.appKey,
      priceBuffer: nav.priceBuffer,
      priceBufferType: nav.priceBufferType,
      price: nav.price,
      triggerPrice: nav.triggerPrice
    });

    // Update validation values
    validation.setValues({
      ...validation.values,
      ...nav
    });

    setIsEdit(true);
    if (nav.entryOrder === 'SLL') {
      setShowFields(true);
      setShowRadioButtons(false);
    } else if (nav.entryOrder === 'market') {
      setShowFields(false);
      setShowRadioButtons(true);
    } else {
      setShowFields(false);
      setShowRadioButtons(false);
    }
    toggle();
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedStrategies(strategies.map(strategy => strategy._id));
    } else {
      setSelectedStrategies([]);
    }
  };

  const handleSelectStrategy = (strategyId) => {
    setSelectedStrategies(prevSelected =>
      prevSelected.includes(strategyId)
        ? prevSelected.filter(id => id !== strategyId)
        : [...prevSelected, strategyId]
    );
  };

  const getSelectedStrategies = useCallback(() => {
    return strategies.filter(strategy => selectedStrategies.includes(strategy._id));
  }, [strategies, selectedStrategies]);


  // Customber Column
  const columns = useMemo(
    () => [
      {
        Header: (
          <div className="form-check">
            <Input
              type="checkbox"
              className="form-check-input"
              id="selectAll"
              onChange={handleSelectAllChange}
              checked={selectedStrategies.length === strategies.length && strategies.length !== 0}
            />
          </div>
        ),
        accessor: 'selection',
        Cell: ({ row }) => (
          <div className="form-check">
            <Input
              type="checkbox"
              className="form-check-input"
              id={`check-${row.original._id}`}
              onChange={() => handleSelectStrategy(row.original._id)}
              checked={selectedStrategies.includes(row.original._id)}
            />
          </div>
        ),
      },
      {
        Header: "TerminalSymbol",
        accessor: "terminalSymbol",
        filterable: true,
        Cell: (cellProps) => {
          return <Email {...cellProps} />;
        },
      },
      {
        Header: "Option Type",
        accessor: "optionType",
        filterable: true,
        Cell: (cellProps) => {
          return <Email {...cellProps} />;
        },
      },
      {
        Header: "Dynamic Expiry",
        accessor: "dynamicExpiry",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Dynamic Strike",
        accessor: "dynamicStrike",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Qty Type",
        accessor: "qtyType",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Prod Type",
        accessor: "prodType",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Entry Order",
        accessor: "entryOrder",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Exit Order",
        accessor: "exitOrder",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Strategy",
        accessor: "strategy",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  const customerData = cellProps.row.original;
                  handleCustomerClick(customerData);
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                {/* <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip> */}
              </Link>
              <Link
                to="#"
                className="text-danger"
                onClick={() => {
                  const customerData = cellProps.row.original;
                  onClickDelete(customerData);
                }}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                {/* <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip> */}
              </Link>
            </div>
          );
        },
      },
    ],
    [strategies, selectedStrategies]
  );

  const toggle = () => {
    if (modal) {
      setModal(false);
      setNav(null);
    } else {
      setModal(true);
    }
  };

  //delete customer
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const onClickDelete = (navigation) => {

    setNav(navigation);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = () => {

    if (navigation && navigation._id) {

      deleteData(`tradingForm/${navigation._id}`)
        .then((response) => {
          if (response.data.error) {
            return error(response.data.message);
          }

          setDeleteModal(false);

          request();
          return success(response.data.message);
        });
    }
  };

  const handleDeleteAllData = () => {

    if (selectedStrategies.length > 0) {
      deleteData(`tradingForm/selectedDataErase/${selectedStrategies}`)
        .then((response) => {
          if (response.data.error) {
            return error(response.data.message);
          }

          setDeleteAllModal(false);
          query.page = 0;
          setQuery(query);
          request();
          return success(response.data.message);
        });
    }
  };



  const handleCustomerClicks = () => {

    setIsEdit(false);
    setShowFields(false);
    setShowRadioButtons(false);
    validation.resetForm();
    toggle();
  };

  //delete all data
  const selectedDataDelete = () => {
    setDeleteAllModal(true);
  }

  const handlePagination = (page) => {

    query.offset = page.selected * query.limit;
    query.page = page.selected;
    setQuery(query);
    request(false);
  };
  const CustomPagination = () => {
    const limit = [10, 25, 50, 100];
    const updateLimit = (e) => {
      query.limit = parseInt(e.target.value);
      query.page = 0;
      setQuery({ ...query });
      request();
    };

    if (loading) {
      return <GoldenTradingLoader />;
    }
    return (
      <div className="mt-2">
        <div className="container position-absolute">
          <div className="row">
            {/* <div className="col-sm-1">
              <select
                className="form-select form-select-sm"
                onChange={updateLimit}
                value={query.limit}
              >
                {limit.map((value) => (
                  <option value={value} key={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="col-sm-4">Total: {total}</div>
          </div>
        </div>
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          forcePage={Math.floor(query.offset / query.limit)}
          onPageChange={(page) => handlePagination(page)}
          pageCount={Math.ceil(total / query.limit)}
          breakLabel={"..."}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          activeClassName="active"
          pageClassName="page-item"
          breakClassName="page-item"
          nextLinkClassName="page-link"
          pageLinkClassName="page-link"
          breakLinkClassName="page-link"
          previousLinkClassName="page-link"
          nextClassName="page-item next-item"
          previousClassName="page-item prev-item"
          containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1"
        />
      </div>
    );
  };
  return (

    <React.Fragment>
      <Modal isOpen={importModal} toggle={() => setImportModal(false)}>
        <ModalHeader toggle={() => setImportModal(false)}>Import CSV</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="csvFile">Select CSV file</Label>
              <Input type="file" name="csvFile" id="csvFile" onChange={handleFileChange} />
            </FormGroup>
            <div
              style={{ textAlign: "right" }}
            >
              <Button color="primary" onClick={handleImport}>
                Import
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCustomer}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteAllModal
        show={deleteAllModal}
        onDeleteClick={handleDeleteAllData}
        onCloseClick={() => setDeleteAllModal(false)}
      />
      <Card>
        <CardBody>

          {/* <TradingTableContainer
            columns={columns}
            data={navs}
            isGlobalFilter={true}
            isAddCustList={true}
            isPagination={false}
            handleCustomerClick={handleCustomerClicks}
            selectedDataDelete={selectedDataDelete}
            customPageSize={600}
            className="custom-header-css"
          /> */}

          <TradingTableContainer
            columns={columns}
            data={navs}
            isGlobalFilter={true}
            isAddCustList={true}
            isPagination={false}
            handleCustomerClick={handleCustomerClicks}
            selectedDataDelete={selectedDataDelete}
            customPageSize={600}
            className="custom-header-css"
            handleExport={handleExport}
            handleImport={handleImportClick}
          />
          <CustomPagination />
          <Modal className="TreadModal" isOpen={modal} toggle={toggle} >
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit ? "Add/Edit Tread" : "Add/Edit Tread"}
            </ModalHeader>
            <ModalBody>
              <Form
                id="traingForm"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col className="col-12">
                    <div className="add-treads">
                      <div className="add-tread-beside">
                        <div className="add-tread col-md-8">
                          <Label className="form-label ">Terminal Symbol</Label>

                          <Select
                            name="terminalSymbol"
                            classNamePrefix="custom-react-select"
                            styles={customStyles}
                            options={scripts.map((script) => ({
                              label: script.terminalSymbol,
                              value: script.terminalSymbol,
                              exchange: script.exchange, // Replace with actual data source for the small text
                            }))}
                            onChange={(selectedOption) => {
                              console.log('Selected option:', selectedOption);
                              setSelectedOption(selectedOption); // Update selected option state
                              validation.setFieldValue('terminalSymbol', selectedOption ? selectedOption.value : '');

                              if (selectedOption.exchange === 'NFO') {
                                setIsInputDisabled(false); // Enable input if exchange is "NFO"
                              } else {
                                setIsInputDisabled(true); // Keep input disabled for other exchanges
                              }
                            }}
                            onBlur={validation.handleBlur}
                            value={selectedOption} // Set value based on selected option state
                            isSearchable
                            placeholder="Select Symbol"
                            onInputChange={(inputValue) => searchScripts(inputValue)} // Call search function on input change
                            formatOptionLabel={({ label, exchange }) => {
                              // Get the class based on the exchange value
                              const className = exchangeClasses[exchange] || defaultClass;

                              return (
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
                                  <span >{label}</span>
                                  <small className={className}>
                                    {exchange}
                                  </small>
                                </div>
                              );
                            }}
                          />
                          {validation.touched.terminalSymbol && validation.errors.terminalSymbol ? (
                            <FormFeedback type="invalid">
                              {validation.errors.terminalSymbol}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="add-tread col-md-4">
                          <Label className="form-label">Strategy</Label>
                          <Input
                            type="select"
                            name="strategy"
                            className="col-md-6 select-script"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.strategy || ""}
                            invalid={
                              validation.touched.strategy && validation.errors.strategy
                                ? true
                                : false
                            }
                          >
                            <option value="" disabled selected>Select Strategy</option>
                            {strategies.length > 0 &&
                              strategies.map((strategy) => (
                                <option key={strategy.name} value={strategy.name}>
                                  {strategy.name} {/* Adjust the property to display in dropdown */}
                                </option>
                              ))
                            }
                          </Input>
                          {validation.touched.strategy && validation.errors.strategy ? (
                            <FormFeedback type="invalid">
                              {validation.errors.strategy}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </div>
                      <div className="add-tread-beside">
                        <div className="add-tread col-md-3">
                          <Label className="form-label md-1">Dynamic Expiry</Label>
                          <Input
                            type="select"
                            name="dynamicExpiry"
                            className="select-script"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.dynamicExpiry || ""}
                            invalid={
                              validation.touched.dynamicExpiry && validation.errors.dynamicExpiry
                                ? true
                                : false
                            }
                            disabled={isInputDisabled}
                          >
                            <option value="" disabled selected>Select Expiry</option>
                            <option value="5th September">5th September</option>
                            <option value="12th September">12th September</option>
                            <option value="19th September">19th September</option>
                            <option value="26th September">26th September</option>
                            <option value="3rd October">3rd October</option>
                            <option value="10th October">10th October</option>
                            <option value="17th October">17th October</option>
                            <option value="24th October">24th October</option>
                            <option value="31st October">31st October</option>
                          </Input>
                          {validation.touched.dynamicExpiry && validation.errors.dynamicExpiry ? (
                            <FormFeedback type="invalid">
                              {validation.errors.dynamicExpiry}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="add-tread col-md-3">
                          <Label className="form-label">Dynamic Strike</Label>

                          <Input
                            type="select"
                            name="dynamicStrike"
                            className="col-md-6 select-script"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.dynamicStrike || ""}
                            invalid={
                              validation.touched.dynamicStrike && validation.errors.dynamicStrike
                                ? true
                                : false
                            }
                            disabled={isInputDisabled}
                          >
                            <option value="" disabled selected>Select Strike</option>
                            <option value="Intraday">25100</option>
                            <option value="Delivery">25200</option>
                          </Input>
                          {validation.touched.dynamicStrike && validation.errors.dynamicStrike ? (
                            <FormFeedback type="invalid">
                              {validation.errors.dynamicStrike}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="add-tread col-md-3">
                          <Label className="form-label">Option Type</Label>
                          <Input
                            type="select"
                            name="optionType"
                            className="select-script"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.optionType || ""}
                            invalid={
                              validation.touched.optionType && validation.errors.optionType
                                ? true
                                : false
                            }
                            disabled={isInputDisabled}
                          >
                            <option value="" disabled selected>Select Option</option>
                            <option value="CE">CE</option>
                            <option value="PE">PE</option>
                          </Input>
                          {validation.touched.optionType && validation.errors.optionType ? (
                            <FormFeedback type="invalid">
                              {validation.errors.optionType}
                            </FormFeedback>
                          ) : null}

                        </div>
                        <div className="add-tread col-md-3">
                          <Label className="form-label">Qty Type</Label>
                          <Input
                            type="select"
                            name="qtyType"
                            className="col-md-6 select-script"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.qtyType || ""}
                            invalid={
                              validation.touched.qtyType && validation.errors.qtyType
                                ? true
                                : false
                            }

                          >
                            <option value="" disabled selected>Select Qty</option>
                            <option value="Intraday">FIXED</option>
                            <option value="Delivery">EXPLORER</option>
                          </Input>
                          {validation.touched.qtyType && validation.errors.qtyType ? (
                            <FormFeedback type="invalid">
                              {validation.errors.qtyType}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </div>
                      <div className="add-tread-beside">
                        <div className="add-tread col-md-4">

                          <Label className="form-label">ProdType</Label>
                          <Input
                            type="select"
                            name="prodType"
                            className="col-md-6 select-script"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.prodType || ""}
                            invalid={
                              validation.touched.prodType && validation.errors.prodType
                                ? true
                                : false
                            }
                          >
                            <option value="" disabled selected>Select  Prod Type</option>
                            <option value="Intraday">MIS</option>
                            <option value="Delivery">Delivery</option>
                          </Input>
                          {validation.touched.prodType && validation.errors.prodType ? (
                            <FormFeedback type="invalid">
                              {validation.errors.prodType}
                            </FormFeedback>
                          ) : null}

                        </div>
                        <div className="add-tread col-md-4">
                          <Label className="form-label">Entry Order</Label>
                          <Input
                            type="select"
                            name="entryOrder"
                            className="col-md-6 select-script"
                            onChange={handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.entryOrder || ""}
                            invalid={validation.touched.entryOrder && validation.errors.entryOrder ? true : false}
                          >
                            <option value="" disabled>Select Prod Type</option>
                            <option value="SLL">SLL</option>
                            <option value="market">MARKET</option>
                            <option value="option2">Option 2</option>
                          </Input>
                          {validation.touched.entryOrder && validation.errors.entryOrder ? (
                            <FormFeedback type="invalid">
                              {validation.errors.entryOrder}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="add-tread col-md-4">
                          <Label className="form-label">Exit Order</Label>
                          <Input
                            type="select"
                            name="exitOrder"
                            className="col-md-6 select-script"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.exitOrder || ""}
                            invalid={
                              validation.touched.exitOrder && validation.errors.exitOrder
                                ? true
                                : false
                            }
                          >
                            <option value="" disabled selected>Select Exit Order</option>
                            <option value="Intraday">MARKET</option>
                            <option value="Delivery">Delivery</option>
                          </Input>
                          {validation.touched.exitOrder && validation.errors.exitOrder ? (
                            <FormFeedback type="invalid">
                              {validation.errors.exitOrder}
                            </FormFeedback>
                          ) : null}
                        </div>

                      </div>
                      <div className="add-tread-beside">
                        <div className="add-tread  col-md-12">
                          {showFields && (
                            <div>
                              <div className="for-sll">
                                <div className="add-tread col-md-6">
                                  <label htmlFor="field1">Price</label>
                                  <Input
                                    name="price"
                                    type="number"
                                    className="select-script"
                                    id="field1"
                                    placeholder="Enter Price"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values?.price || ""}
                                    invalid={
                                      validation.touched?.price && validation.errors?.price
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched?.price && validation.errors?.price ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors?.price}
                                    </FormFeedback>
                                  ) : null}
                                </div>

                                <div className="add-tread col-md-6">
                                  <label htmlFor="field2">Trigger Price</label>

                                  <Input
                                    name="triggerPrice"
                                    type="number"
                                    className="select-script"
                                    id="field2"
                                    placeholder="Enter Trigger Price"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values?.triggerPrice || ""}
                                    invalid={
                                      validation.touched?.triggerPrice && validation.errors?.triggerPrice
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched?.triggerPrice && validation.errors?.triggerPrice ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors?.triggerPrice}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      </div>
                      <div className="add-tread-beside">
                        <div className="add-tread  col-md-12">
                          {showRadioButtons && (
                            <div className="for-sll">
                              <div className="add-tread col-md-6">
                                <label htmlFor="field5">Price Buffer Type</label>
                                <div className="add-tread price-buffer col-md-12">
                                  <label className="price-buffer">
                                    <input
                                      type="radio"
                                      name="priceBufferType"
                                      value="fixed"
                                      checked={validation.values.priceBufferType === "fixed"}
                                      onBlur={validation.handleBlur}
                                      onChange={validation.handleChange}
                                      invalid={
                                        validation.touched?.priceBufferType && validation.errors?.priceBufferType
                                          ? true
                                          : false
                                      }
                                    />
                                    Fixed
                                  </label>
                                  <label className="price-buffer">
                                    <input
                                      type="radio"
                                      name="priceBufferType"
                                      value="percent"
                                      checked={validation.values.priceBufferType === "percent"}
                                      onBlur={validation.handleBlur}
                                      onChange={validation.handleChange}
                                      invalid={
                                        validation.touched?.priceBufferType && validation.errors?.priceBufferType
                                          ? true
                                          : false
                                      }
                                    />
                                    Percent
                                  </label>
                                  {validation.touched.priceBufferType && validation.errors.priceBufferType ? (
                                    <div>{validation.errors.priceBufferType}</div>
                                  ) : null}
                                </div>
                              </div>
                              <div className="add-tread col-md-6">
                                <label htmlFor="priceBuffer">Price Buffer</label>
                                <Input
                                  name="priceBuffer"
                                  type="number"
                                  className="select-script"
                                  id="priceBuffer"
                                  placeholder="Enter Price Buffer"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values?.priceBuffer || ""}
                                  invalid={
                                    validation.touched?.priceBuffer && validation.errors?.priceBuffer
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched?.priceBuffer && validation.errors?.priceBuffer ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors?.priceBuffer}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {!isEdit &&
                        <button
                          type="button"
                          className="btn btn-danger save-customer mx-2"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                      }
                      <button
                        type="submit"
                        className="btn btn-success save-customer"
                      >
                        Save
                      </button>

                    </div>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};


export default index;
