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
      name: (navigation && navigation.name) || "",
      position: (navigation && navigation.position) || "",
      altText: (navigation && navigation.altText) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
      position: Yup.string().required("Please Enter Designation"),
    }),
    onSubmit: (values) => {
      let form = themeConfig.functions.read_form("createTeamMembers");
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


    postData("aboutus/createTeamMembers", form_data)
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
        Header: "ChartSymbol",
        accessor: "chartSymbol",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
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
        Header: "TSL",
        accessor: "tsl",
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
                id="createTeamMembers"
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
                          <select className="select-script" id="cars" name="cars">
                            <option value="" disabled selected>Select Symbol</option>
                            <option value="TATA POWER">NIFTY</option>
                            <option value="BCG">BANK NIFTY</option>
                            <option value="SIEMENS">SIEMENS</option>
                            <option value="LALPATHLAB">LALPATHLAB</option>
                            <option value="HINDCOPPER">HINDCOPPER</option>
                            <option value="M & M">M & M</option>
                            <option value="COCHIN SHIPYARD">COCHIN SHIPYARD</option>
                          </select>
                        </div>
                        <div className="add-tread col-md-5">
                          <Label className="form-label">Chart Symbol</Label>
                          <select className="select-script" id="cars" name="cars">
                            <option value="" disabled selected>Select Chart Symbol</option>
                            <option value="TATA POWER">NIFTY</option>
                            <option value="BCG">BANK NIFTY</option>
                            <option value="SIEMENS">SIEMENS</option>
                            <option value="LALPATHLAB">LALPATHLAB</option>
                            <option value="HINDCOPPER">HINDCOPPER</option>
                            <option value="M & M">M & M</option>
                            <option value="COCHIN SHIPYARD">COCHIN SHIPYARD</option>
                          </select>
                        </div>
                        <div className="add-tread col-md-2">
                          <Label className="form-label">Option Type</Label>
                          <select className="select-script" id="cars" name="cars">
                            <option value="" disabled selected>Select Option</option>
                            <option value="">CE</option>
                            <option value="">PE</option>
                          </select>
                        </div>
                      </div>
                      <div className="add-tread-beside">
                        <div className="add-tread col-md-3">
                          <Label className="form-label md-1">Dynamic Expiry</Label>
                          <select className="select-script" id="cars" name="cars">
                            <option value="" disabled selected>Select Expiry Date</option>
                            <option value="">5th September</option>
                            <option value="">12th September</option>
                            <option value="">19th September</option>
                            <option value="">26th September</option>
                            <option value="">3rd October</option>
                            <option value="">10th October</option>
                            <option value="">17th October</option>
                            <option value="">24th October</option>
                            <option value="">31st October</option>
                          </select>
                      </div>
                      <div className="add-tread col-md-3">
                        <Label className="form-label">Dynamic Strike</Label>
                        <select className="col-md-6 select-script" id="cars" name="cars">
                          <option value="" disabled selected>Select Strike</option>
                          <option value="Intraday">25100</option>
                          <option value="Delivery">25200</option>
                        </select>
                      </div>
                      <div className="add-tread col-md-3">
                        <Label className="form-label">Qty Type</Label>
                        <select className="col-md-6 select-script" id="cars" name="cars">
                          <option value="" disabled selected>Select Qty</option>
                          <option value="Intraday">FIXED</option>
                          <option value="Delivery">Delivery</option>
                        </select>
                      </div>
                      <div className="add-tread col-md-3">
                        <Label className="form-label">ProdType</Label>
                        <select className="col-md-6 select-script" id="cars" name="cars">
                          <option value="" disabled selected>Select  Prod Type</option>
                          <option value="Intraday">MIS</option>
                          <option value="Delivery">Delivery</option>
                        </select>
                      </div>
                    </div>
                    <div className="add-tread-beside">
                      <div className="add-tread col-md-4">
                        <Label className="form-label">Entry Order</Label>
                        <select className="col-md-6 select-script" id="options" name="options" onChange={handleSelectionChange}>
                          <option value="" disabled selected>Select  Prod Type</option>
                          <option value="sLL">SLL</option>
                          <option value="market">MARKET</option>
                          <option value="option2">Option 2</option>
                        </select>
                      </div>
                      <div className="add-tread col-md-4">
                        <Label className="form-label">Exit Order</Label>
                        <select className="col-md-6 select-script" id="cars" name="cars">
                          <option value="" disabled selected>Select Exit Order</option>
                          <option value="Intraday">MARKET</option>
                          <option value="Delivery">Delivery</option>
                        </select>
                      </div>
                      <div className="add-tread col-md-4">
                        <Label className="form-label">Strategy</Label>
                        <select className="col-md-6 select-script" id="cars" name="cars">
                          <option value="" disabled selected>Select</option>
                          <option value="Intraday">MIS</option>
                          <option value="Delivery">Delivery</option>
                        </select>
                      </div>
                    </div>
                    <div className="add-tread-beside">
                      <div className="add-tread  col-md-12">
                        {showFields && (
                            <div>
                              <div className="for-sll">
                                <div className="add-tread col-md-6">
                                  <label htmlFor="field1">Price</label>
                                  <input className="select-script" type="number" id="field1" placeholder="Price" name="field1" />
                                </div>

                                <div className="add-tread col-md-6">
                                  <label htmlFor="field2">Trigger Price</label>
                                  <input className="select-script" type="number" id="field2" placeholder="Trigger Price" name="field2" />
                                </div>
                              </div>

                              <div className="for-sll">
                              <div className="add-tread col-md-4">
                                  <label htmlFor="field3">Target</label>
                                  <input type="number" id="field3" name="field3" />
                                </div>
                                <div className="add-tread col-md-4">
                                  <label htmlFor="field4">StopLoss</label>
                                  <input type="number" id="field4" name="field4" />
                                </div>

                                <div className="add-tread col-md-4">
                                  <label htmlFor="field5">TSL(Pts)</label>
                                  <input type="number" id="field5" name="field5" />
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
              <input
                className="select-script"
                type="number"
                id="priceBuffer"
                placeholder="Enter Price Buffer"
                name="priceBuffer"
              />
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
                id="createTeamMembers"
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
                      <select name="name" id="" className="form-control">
                        <option option value="" disabled selected>Select User ID</option>
                        <option value="name">name 1</option>
                        <option value="name">name 2</option>
                        <option value="name">name 3</option>
                        <option value="name">name 4</option>
                        <option value="name">name 5</option>
                        <option value="name">name 6</option>
                        <option value="name">name 7</option>
                      </select>
                      {validation.touched.name && validation.errors.name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.name}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3 form-controls">
                      <Label className="form-label">Portel Password<small className="asterisk">*</small></Label>
                      <select name="name" id="" className="form-control">
                      <option option value="" disabled selected>Select Password</option>
                        <option value="name">name 1</option>
                        <option value="name">name 2</option>
                        <option value="name">name 3</option>
                        <option value="name">name 4</option>
                        <option value="name">name 5</option>
                        <option value="name">name 6</option>
                        <option value="name">name 7</option>
                      </select>
                      {validation.touched.Email && validation.errors.Email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.Email}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3 form-controls">
                      <Label className="form-label">User Key<small className="asterisk">*</small></Label>
                      <select name="name" id="" className="form-control">
                        <option option value="" disabled selected>Select User Key</option>
                        <option value="name">name 1</option>
                        <option value="name">name 2</option>
                        <option value="name">name 3</option>
                        <option value="name">name 4</option>
                        <option value="name">name 5</option>
                        <option value="name">name 6</option>
                        <option value="name">name 7</option>
                      </select>
                      {validation.touched?.Number && validation.errors?.Number ? (
                        <FormFeedback type="invalid">
                          {validation.errors?.Number}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3 form-controls">
                      <Label className="form-label">Appkey<small className="asterisk">*</small></Label>
                      <select name="name" id="" className="form-control"> 
                        <option option value="" disabled selected>Select Appkey</option>
                        <option value="name">name 1</option>
                        <option value="name">name 2</option>
                        <option value="name">name 3</option>
                        <option value="name">name 4</option>
                        <option value="name">name 5</option>
                        <option value="name">name 6</option>
                        <option value="name">name 7</option>
                      </select>
                      {validation.touched?.Number && validation.errors?.Number ? (
                        <FormFeedback type="invalid">
                          {validation.errors?.Number}
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
