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
import OrderTableContainer from "../../../components/Common/OrderTableContainer";

import { success, error } from "../../../components/toast";

// Column
import { Image, Name, ID, Type, Symbol, OrderType, TrigPrice, Price, Qty, Instrument, Strategy, Source, Mode, Message, ReceivedAt, Designation, Email } from "../../NavigationCol";
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
        Header: "Action",
        accessor: "action",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "ID",
        accessor: "id",
        filterable: true,
        Cell: (cellProps) => {
          return <ID {...cellProps} />;
        },
      },
      {
        Header: "Type",
        accessor: "type",
        filterable: true,
        Cell: (cellProps) => {
          return <Type {...cellProps} />;
        },
      },
      {
        Header: "Symbol",
        accessor: "symbol",
        filterable: true,
        Cell: (cellProps) => {
          return <Symbol {...cellProps} />;
        },
      },
      {
        Header: "OrderType",
        accessor: "orderType",
        filterable: true,
        Cell: (cellProps) => {
          return <OrderType {...cellProps} />;
        },
      },
      {
        Header: "TrigPrice",
        accessor: "trigPrice",
        filterable: true,
        Cell: (cellProps) => {
          return <TrigPrice {...cellProps} />;
        },
      },
      {
        Header: "Price",
        accessor: "price",
        filterable: true,
        Cell: (cellProps) => {
          return <Price {...cellProps} />;
        },
      },
      {
        Header: "Qty",
        accessor: "qty",
        filterable: true,
        Cell: (cellProps) => {
          return <Qty {...cellProps} />;
        },
      },
      {
        Header: "Instrument",
        accessor: "instrument",
        filterable: true,
        Cell: (cellProps) => {
          return <Instrument {...cellProps} />;
        },
      },
      {
        Header: "Strategy",
        accessor: "strategy",
        filterable: true,
        Cell: (cellProps) => {
          return <Strategy {...cellProps} />;
        },
      },
      {
        Header: "Source",
        accessor: "source",
        filterable: true,
        Cell: (cellProps) => {
          return <Source {...cellProps} />;
        },
      },
      {
        Header: "Mode",
        accessor: "mode",
        filterable: true,
        Cell: (cellProps) => {
          return <Mode {...cellProps} />;
        },
      },
      {
        Header: "Message",
        accessor: "message",
        filterable: true,
        Cell: (cellProps) => {
          return <Message {...cellProps} />;
        },
      },
      {
        Header: "ReceivedAt",
        accessor: "receivedAt",
        filterable: true,
        Cell: (cellProps) => {
          return <ReceivedAt {...cellProps} />;
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
          <OrderTableContainer
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
                      <select className="col-md-6 select-script" id="cars" name="cars">
                        <option value="" disabled selected>Select  Prod Type</option>
                        <option value="Intraday">SLL</option>
                        <option value="Delivery">Delivery</option>
                      </select>
                    </div>
                    <div className="add-tread col-md-4">
                      <Label className="form-label">Exit Order</Label>
                      <select className="col-md-6 select-script" id="cars" name="cars">
                        <option value="" disabled selected>Select  Prod Type</option>
                        <option value="Intraday">Market</option>
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
