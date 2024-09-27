import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  Input,
  FormFeedback,
  Label,
  Form,
  Button,
} from "reactstrap";

//Import Breadcrumb
import { postData } from "../../../components/api";
import themeConfig from "../../../configs/themeConfig";
import DeleteModal from "../../../components/Common/DeleteModal";
import thumb from "../../../assets/images/friends.svg";

//redux
import { useSelector, useDispatch } from "react-redux";
import TradingTableContainer from "../../../components/Common/TradingTableContainer";

import { success, error } from "../../../components/toast";

// Column
import { Image, Name, Designation, Email } from "../../NavigationCol";
import HideShowSection from "../../../components/Common/HideShowSection";

const index = (props) => {
  const dispatch = useDispatch();
  const [navs, setNavs] = useState([]);
  const [count, setCount] = useState(0);
  const [addImagePrimary, setAddImagePrimary] = useState(thumb);
  useEffect(() => {
    getNavigation();
  }, []);

  const getNavigation = () => {
    postData("aboutus/getTeamMembers")
      .then((response) => {

        const myArray = response.data.data;
        const count = myArray.length;
        setNavs(response.data.data);
        setCount(count);
      });
  };
  const [modal, setModal] = useState(false);
  const [modalCheck, setModalCheck] = useState(false);
  const [navList, setNavList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [navigation, setNav] = useState(null);

  const [showFields, setShowFields] = useState(false);
  const [showRadioButtons, setShowRadioButtons] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState('');
  const [limitShowFields, setLimitShowFields] = useState(false);

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'sLL') {
      setShowFields(true);
      setShowRadioButtons(false);
    } else if (selectedValue === 'market') {
      setShowFields(false);
      setShowRadioButtons(true);
    } else {
      setShowFields(false);
      setShowRadioButtons(false);
    }
  };

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value); // Update the selected radio value
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: (navigation && navigation.id) || "",
      terminalSymbol: (navigation && navigation.terminalSymbol) || "",
      chartSymbol: (navigation && navigation.chartSymbol) || "",
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
      radioOption: (navigation && navigation.radioOption) || "",
      price: (navigation && navigation.price) || "",
      triggerPrice: (navigation && navigation.triggerPrice) || "",
      target: (navigation && navigation.target) || "",
      stopLoss: (navigation && navigation.stopLoss) || "",
    },
    validationSchema: Yup.object({
      terminalSymbol: Yup.string().required("Please Select Terminal Symbol"),
      chartSymbol: Yup.string().required("Please Select Chart Symbol"),
      optionType: Yup.string().required("Please Select Option Type"),
      dynamicExpiry: Yup.string().required("Please Select Dynamic Expiry"),
      dynamicStrike: Yup.string().required("Please Select Dynamic Strike"),
      qtyType: Yup.string().required("Please Select Qty Type"),
      prodType: Yup.string().required("Please Select Prod Type"),
      entryOrder: Yup.string().required("Please Select Entry Order"),
      exitOrder: Yup.string().required("Please Select Exit Order"),
      strategy: Yup.string().required("Please Select Strategy"),
      portalUserId: Yup.string().required("Please Select Portal UserId"),
      portalPassword: Yup.string().required("Please Select Portal Password"),
      userKey: Yup.string().required("Please Select User Key"),
      appKey: Yup.string().required("Please Select App Key"),
      priceBuffer: Yup.string().required("Please Select Price Buffer"),
      radioOption: Yup.string().required("Please Select Radio Option"),
      price: Yup.string().required("Please Enter Price"),
      triggerPrice: Yup.string().required("Please Enter Trigger Price"),
      target: Yup.string().required("Please Enter Target"),
      stopLoss: Yup.string().required("Please Enter Stop Loss"),
    }),
    onSubmit: (values) => {
      let form = themeConfig.functions.read_form("traingForm");
      let formData = new FormData();
      Object.keys(form).map((key) => {
        formData.append(key, form[key]);
      });
      if (isEdit) {
        formData.append("id", values.id);
        updateNavigation(formData);
      } else {

        addNewNavigation(formData);

      }
      validation.resetForm();
      setAddImagePrimary(thumb);
      toggle();
    },
  });

  const addNewNavigation = (form_data) => {


    postData("aboutus/traingForm", form_data)
      .then((response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        setNavs(response.data.data);
        return success(response.data.message);
      });
  };

  const updateNavigation = (form_data) => {

    postData("aboutus/editTeamMembers", form_data)
      .then((response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        setNavs(response.data.data);
        return success(response.data.message);
      });
  };
  const handleCustomerClick = (arg) => {
    const nav = arg;

    setNav({
      id: nav.id,
      name: nav.name,
      position: nav.position,
      image: nav.image,
      altText: nav.altText
    });
    setAddImagePrimary(nav.image);
    setIsEdit(true);
    toggle();
  };

  const handleCheckingClick = (arg) => {
    const nav = arg;

    setNav({
      id: nav.id,
      name: nav.name,
      position: nav.position,
      image: nav.image,
      altText: nav.altText
    });
    setAddImagePrimary(nav.image);
    setIsEdit(true);
    toggleCheck();
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
        Header: "Instrument",
        accessor: "instrument",
        filterable: true,
        Cell: (cellProps) => {
          return <Email {...cellProps} />;
        },
      },
      {
        Header: "Entry",
        accessor: "entry",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Exit",
        accessor: "exit",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Qty",
        accessor: "qty",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "ProdType",
        accessor: "prodType",
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

  const toggleCheck = () => {
    if (modalCheck) {
      setModalCheck(false);
      setNav(null);
    } else {
      setModalCheck(true);
    }
  };

  //delete customer
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (navigation) => {
    setNav(navigation);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = () => {
    if (navigation && navigation.id) {

      let data = {
        id: navigation.id,
      };

      postData("aboutus/deleteTeamMembers", data)
        .then((response) => {
          if (response.data.error) {
            return error(response.data.message);
          }

          setDeleteModal(false);
          setNav("");
          setNavs(response.data.data);
          return success(response.data.message);
        });
    }
  };

  const handleCustomerClicks = () => {
    setNavList("");
    setAddImagePrimary(thumb);
    setIsEdit(false);
    toggle();
  };
  const handleCheckingClicks = () => {
    setNavList("");
    setAddImagePrimary(thumb);
    setIsEdit(false);
    toggleCheck();
  };
  const [form, setForm] = useState(null);
  const onChangeAddPrimary = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    reader.onload = () => {
      setAddImagePrimary(reader.result);
    };
    reader.readAsDataURL(files[0]);
    setForm({ ...form, icon: e.target.files });
  };

  const handleDelPri = (e) => {
    e.preventDefault();
    document.getElementById("editCatImagePrimary").value = "";
    setAddImagePrimary(thumb);
  };



  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCustomer}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Card>
        <CardBody>
          <TradingTableContainer
            columns={columns}
            data={navs}
            cnt={count}
            isGlobalFilter={true}
            isAddCustList={true}
            isPagination={true}
            handleCustomerClick={handleCustomerClicks}
            handleCheckingClick={handleCheckingClicks}
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
                        <div className="add-tread col-md-8">
                          <Label className="form-label ">Terminal Symbol</Label>
                          <Input
                              type="select"
                              name="terminalSymbol"
                              className="select-script"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={isEdit && validation.values.terminalSymbol == 0 ? 0 : validation.values.terminalSymbol || ""}
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
                      
                        <div className="add-tread col-md-4">
                          <Label className="form-label">Option Type</Label>
                          <Input
                              type="select"
                              name="optionType"
                              className="select-script"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={isEdit && validation.values.optionType == 0 ? 0 : validation.values.optionType || ""}
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
                              value={isEdit && validation.values.dynamicExpiry == 0 ? 0 : validation.values.dynamicExpiry || ""}
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
                              value={isEdit && validation.values.dynamicStrike == 0 ? 0 : validation.values.dynamicStrike || ""}
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
                              value={isEdit && validation.values.qtyType == 0 ? 0 : validation.values.qtyType || ""}
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
                      <div className="add-tread col-md-3">
                        <Label className="form-label">ProdType</Label>
                        <Input
                              type="select"
                              name="prodType"
                              className="col-md-6 select-script"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={isEdit && validation.values.prodType == 0 ? 0 : validation.values.prodType || ""}
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
                              onChange={validation.handleChange}
                              onChange={handleSelectionChange}
                              onBlur={validation.handleBlur}
                              value={isEdit && validation.values.entryOrder == 0 ? 0 : validation.values.entryOrder || ""}
                              invalid={
                                validation.touched.entryOrder && validation.errors.entryOrder
                                  ? true
                                  : false
                              }
                            >
                          <option value="" disabled selected>Select  Prod Type</option>
                          <option value="sLL">SLL</option>
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
                              value={isEdit && validation.values.exitOrder == 0 ? 0 : validation.values.exitOrder || ""}
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
                              value={isEdit && validation.values.strategy == 0 ? 0 : validation.values.strategy || ""}
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
                  name="radioOption"
                  value="fixed"
                  onChange={handleRadioChange}
                />
                Fixed
              </label>
              <label className="price-buffer">
                <input
                  type="radio"
                  name="radioOption"
                  value="percent"
                  onChange={handleRadioChange}
                />
                Percent
              </label>
            </div>
          </div>

          {/* Conditionally render Price Buffer input field when "Fixed" is selected */}
          {selectedRadio === 'fixed' && (
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
                      <button
                        type="submit"
                        className="btn btn-danger save-customer mx-2"
                      >
                        Reset
                      </button>
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

          <Modal isOpen={modalCheck} toggle={toggleCheck}>
            <ModalHeader toggle={toggleCheck} tag="h4">
              {!!isEdit ? "My Tread Setting" : "My Tread Setting"}
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
                    <div className="mb-3 form-controls">
                      <Label className="form-label">Portel User ID<small className="asterisk">*</small></Label>
                      
                      <Input
                              type="select"
                              name="portalUserId"
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={isEdit && validation.values.portalUserId == 0 ? 0 : validation.values.portalUserId || ""}
                              invalid={
                                validation.touched.portalUserId && validation.errors.portalUserId
                                  ? true
                                  : false
                              }
                            >
                        <option option value="" disabled selected>Select User ID</option>
                        <option value="name">name 1</option>
                        <option value="name">name 2</option>
                        <option value="name">name 3</option>
                        <option value="name">name 4</option>
                        <option value="name">name 5</option>
                        <option value="name">name 6</option>
                        <option value="name">name 7</option>
                      </Input>
                      {validation.touched.portalUserId && validation.errors.portalUserId ? (
                        <FormFeedback type="invalid">
                          {validation.errors.portalUserId}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3 form-controls">
                      <Label className="form-label">Portel Password<small className="asterisk">*</small></Label>
                      <Input
                              type="select"
                              name="portalPassword"
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={isEdit && validation.values.portalPassword == 0 ? 0 : validation.values.portalPassword || ""}
                              invalid={
                                validation.touched.portalPassword && validation.errors.portalPassword
                                  ? true
                                  : false
                              }
                            >
                      <option option value="" disabled selected>Select Password</option>
                        <option value="name">name 1</option>
                        <option value="name">name 2</option>
                        <option value="name">name 3</option>
                        <option value="name">name 4</option>
                        <option value="name">name 5</option>
                        <option value="name">name 6</option>
                        <option value="name">name 7</option>
                      </Input>
                      {validation.touched.portalPassword && validation.errors.portalPassword ? (
                        <FormFeedback type="invalid">
                          {validation.errors.portalPassword}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3 form-controls">
                      <Label className="form-label">User Key<small className="asterisk">*</small></Label>
                      <Input
                              type="select"
                              name="userKey"
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={isEdit && validation.values.userKey == 0 ? 0 : validation.values.userKey || ""}
                              invalid={
                                validation.touched.userKey && validation.errors.userKey
                                  ? true
                                  : false
                              }
                            >
                        <option option value="" disabled selected>Select User Key</option>
                        <option value="name">name 1</option>
                        <option value="name">name 2</option>
                        <option value="name">name 3</option>
                        <option value="name">name 4</option>
                        <option value="name">name 5</option>
                        <option value="name">name 6</option>
                        <option value="name">name 7</option>
                      </Input>
                      {validation.touched?.userKey && validation.errors?.userKey ? (
                        <FormFeedback type="invalid">
                          {validation.errors?.userKey}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3 form-controls">
                      <Label className="form-label">Appkey<small className="asterisk">*</small></Label>
                      <Input
                              type="select"
                              name="appKey"
                              className="form-control"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={isEdit && validation.values.appKey == 0 ? 0 : validation.values.appKey || ""}
                              invalid={
                                validation.touched.appKey && validation.errors.appKey
                                  ? true
                                  : false
                              }
                            > 
                        <option option value="" disabled selected>Select Appkey</option>
                        <option value="name">name 1</option>
                        <option value="name">name 2</option>
                        <option value="name">name 3</option>
                        <option value="name">name 4</option>
                        <option value="name">name 5</option>
                        <option value="name">name 6</option>
                        <option value="name">name 7</option>
                      </Input>
                      {validation.touched?.appKey && validation.errors?.appKey ? (
                        <FormFeedback type="invalid">
                          {validation.errors?.appKey}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
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
