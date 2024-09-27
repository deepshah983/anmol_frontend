import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
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
  }, []);

  const getNavigation = () => {
    getData("tradingForm")
      .then((response) => {
        setNavs(response.data.data);
      });
  };
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [navigation, setNav] = useState(null);
  const [showFields, setShowFields] = useState(false);
  const [showRadioButtons, setShowRadioButtons] = useState(false);

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
      target: (navigation && navigation.target) || "",
      stopLoss: (navigation && navigation.stopLoss) || "",
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
      target: Yup.string().when('entryOrder', {
        is: 'SLL',
        then: Yup.string().required("Please Enter Target"),
        otherwise: Yup.string(),
      }),
      stopLoss: Yup.string().when('entryOrder', {
        is: 'SLL',
        then: Yup.string().required("Please Enter Stop Loss"),
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
        is: (entryOrder, priceBufferType) => entryOrder === 'market' && priceBufferType === 'fixed',
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
        getNavigation();
        return success(response.data.message);
      });
  };

  const updateNavigation = (id, form_data) => {
    
    updateData(`tradingForm/${id}`, form_data)
      .then((response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        getNavigation();
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
      triggerPrice: nav.triggerPrice,
      target: nav.target,
      stopLoss: nav.stopLoss
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

  // Customber Column
  const columns = useMemo(
    () => [
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
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
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
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
    ],
    []
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
          getNavigation();
          return success(response.data.message);
        });
    }
  };

  const handleDeleteAllData = () => {
  
    const idArray = navs.map(item => item._id);
     
    
      let obj = {
        idArray: idArray
      }

      deleteData(`tradingForm/allDataErase/${idArray}`)
        .then((response) => {
          if (response.data.error) {
            return error(response.data.message);
          }

          setDeleteAllModal(false);
          getNavigation();
          return success(response.data.message);
        });
  };

  

  const handleCustomerClicks = () => {

    setIsEdit(false);
    setShowFields(false);
      setShowRadioButtons(false);
      validation.resetForm();
    toggle();
  };

  //delete all data
  const allDataDelete = () => {
    setDeleteAllModal(true);
  }
  return (
    <React.Fragment>
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
          <TradingTableContainer
            columns={columns}
            data={navs}
            isGlobalFilter={true}
            isAddCustList={true}
            isPagination={true}
            handleCustomerClick={handleCustomerClicks}
            allDataDelete={allDataDelete}
            customPageSize={20}
            className="custom-header-css"
          />

          <Modal className="TreadModal" isOpen={modal} toggle={toggle}>
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
                        <div className="add-tread col-md-5">
                          <Label className="form-label ">Terminal Symbol</Label>
                          <Input
                              type="select"
                              name="terminalSymbol"
                              className="select-script"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.terminalSymbol || ""}
                              invalid={
                                validation.touched.terminalSymbol && validation.errors.terminalSymbol
                                  ? true
                                  : false
                              }
                            >
                            <option value="" disabled selected>Select Symbol</option>
                            <option value="TATA POWER">NIFTY</option>
                            <option value="BCG">BANK NIFTY</option>
                            <option value="SIEMENS">SIEMENS</option>
                            <option value="LALPATHLAB">LALPATHLAB</option>
                            <option value="HINDCOPPER">HINDCOPPER</option>
                            <option value="M & M">M & M</option>
                            <option value="COCHIN SHIPYARD">COCHIN SHIPYARD</option>
                            </Input>
                      {validation.touched.terminalSymbol && validation.errors.terminalSymbol ? (
                        <FormFeedback type="invalid">
                          {validation.errors.terminalSymbol}
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
                            >
                            <option value="" disabled selected>Select Expiry Date</option>
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
                          <option value="Delivery">Delivery</option>
                          </Input>
                      {validation.touched.qtyType && validation.errors.qtyType ? (
                        <FormFeedback type="invalid">
                          {validation.errors.qtyType}
                        </FormFeedback>
                      ) : null}
                      </div>
                      <div className="add-tread col-md-3">
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
                    </div>
                    <div className="add-tread-beside">
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
                          <option value="" disabled selected>Select</option>
                          <option value="Intraday">MIS</option>
                          <option value="Delivery">Delivery</option>
                        </Input>
                      {validation.touched.strategy && validation.errors.strategy ? (
                        <FormFeedback type="invalid">
                          {validation.errors.strategy}
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

                              <div className="for-sll">
                              <div className="add-tread col-md-4">
                                  <label htmlFor="field3">Target</label>
                                  <Input
                                      name="target"
                                      type="number"
                                      className="select-script"
                                      id="field3"
                                      placeholder="Enter Target"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values?.target || ""}
                                      invalid={
                                        validation.touched?.target && validation.errors?.target
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched?.target && validation.errors?.target ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors?.target}
                                      </FormFeedback>
                                    ) : null}
                                </div>
                                <div className="add-tread col-md-4">
                                  <label htmlFor="field4">StopLoss</label>
                                  <Input
                                      name="stopLoss"
                                      type="number"
                                      className="select-script"
                                      id="field3"
                                      placeholder="Enter Stop Loss"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values?.stopLoss || ""}
                                      invalid={
                                        validation.touched?.stopLoss && validation.errors?.stopLoss
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched?.stopLoss && validation.errors?.stopLoss ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors?.stopLoss}
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

          {/* Conditionally render Price Buffer input field when "Fixed" is selected */}
          {validation.values.priceBufferType === 'fixed' && (
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
          )}
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
