import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
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
import { getData, postData, updateData, deleteData } from "../../../components/api";
import themeConfig from "../../../configs/themeConfig";
import DeleteModal from "../../../components/Common/DeleteModal";

//redux
import { useDispatch } from "react-redux";
import TableContainer from "../../../components/Common/TableContainer";

import { success, error } from "../../../components/toast";

// Column
import { Name, Status, Designation, Email } from "../../NavigationCol";
import { map } from 'lodash';

const index = (props) => {
  const [navs, setNavs] = useState([]);
  const [strategy, setStrategy] = useState([]);

  useEffect(() => {
    getNavigation();
  }, []);

  const getNavigation = () => {
    getData("/clients")
      .then((response) => {
        let clients = response?.data?.data?.clients;
        let strategies = response?.data?.data?.strategies;
        
        clients = clients.map(client => {
          // Find the strategy that matches the client's assigned strategy
          const assignedStrategy = strategies.find(strategy => client?.assignedstrategy === strategy?._id);
          
          if (assignedStrategy) {
            // Replace the assigned strategy ID with the strategy name
            client.assignedstrategy = assignedStrategy?.name;
          }
          
          return client;
        });
        
        // After processing, update state with the modified clients and strategies
        
        setNavs(clients);
        setStrategy(strategies);
        
      });
  };
  const [modal, setModal] = useState(false);
  const [modalCheck, setModalCheck] = useState(false);
  const [modalAssignStrategy, setModalAssignStrategy] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [navigation, setNav] = useState(null);

  // validation user form
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: (navigation && navigation.id) || "",
      name: (navigation && navigation.name) || "",
      email: (navigation && navigation.email) || "",
      phone: (navigation && navigation.phone) || "",
      entryBalance: (navigation && navigation.entryBalance) || "",
      status: (navigation && navigation.status) || "",
      // position: (navigation && navigation.position) || "",
      // altText: (navigation && navigation.altText) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter User Name"),
      email: Yup.string().required("Please Enter Email"),
      phone: Yup.string().required("Please Enter Mobile Number"),
      entryBalance: Yup.string().required("Please Enter Entry Balance"),
      status: Yup.string().test('conditional-required', 'Please Select Status', function(value) {
        // If the initial status is 0, don't require a value
        if (navigation?.status == 0 || navigation?.status == '0') {
          return true;
        }
        // Otherwise, require a non-empty value
        return value !== undefined && value !== null && value !== '';
      }),
      //position: Yup.string().required("Please Enter Designation"),
    }),
    onSubmit: (values) => {
      console.log(values);
      
      let form = themeConfig.functions.read_form("createClient");
      let formData = new FormData();
      Object.keys(form).map((key) => {
        formData.append(key, form[key]);
      });
      if (isEdit) {
        formData.append("id", values.id);
        updateUser(values.id, formData);
      } else {

        addUser(formData);

      }
     
    },
  });

  const addUser = (form_data) => {


    postData("/clients", form_data)
      .then((response) => {
        console.log(response);
        
        if (response.data.error) {
          return error(response.data.error);
        }
        getNavigation();
        validation.resetForm();
        toggle();
        return success(response.data.message);
       
      
      })
      .catch((err) => {
        console.log(err?.response?.data?.error);
        return error(err?.response?.data?.error);
      });
  };

  const updateUser = (id, form_data) => {

    updateData(`/clients/${id}`, form_data)
      .then((response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        
        getNavigation();
        validation.resetForm();
        toggle();
        return success(response.data.message);
      })
      .catch((err) => {
        console.log(err?.response?.data?.error);
        return error(err?.response?.data?.error);
      });
  };

   // validation
   const validationAssignStratagy = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    
    initialValues: {
      id: (navigation && navigation.id) || "",
      assignedstrategy: (navigation && navigation.assignedstrategy) || "",

    },
    validationAssignStratagySchema: Yup.object({
      assignedstrategy: Yup.string().required("Please Select Strategy"),
    }),
    onSubmit: (values) => {
      console.log(values);
      
      let form = themeConfig.functions.read_form("assignStrategy");
      console.log(form);
      let formData = new FormData();
      Object.keys(form).map((key) => {
        
        
        formData.append(key, form[key]);
      });

        formData.append("id", values.id);
        updateAssignStrategy(values.id, formData);
     
    },
  });

  const updateAssignStrategy = (id, form_data) => {

    updateData(`/client/assignStrategy/${id}`, form_data)
      .then((response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        
        getNavigation();
        validationAssignStratagy.resetForm();
        toggleAssignStrategy();
        return success(response.data.message);
      })
      .catch((err) => {
        console.log(err?.response?.data?.error);
        return error(err?.response?.data?.error);
      });
  };

  const handleCustomerClick = (arg) => {
    const nav = arg;
  
    const status = nav.status ? nav.status : 0;

    setNav({
      id: nav._id,
      name: nav.name,
      email: nav.email,
      phone: nav.phone,
      position: nav.position,
      entryBalance: nav.entryBalance,
      status: status
    });
   
    setIsEdit(true);
    toggle();
  };

  const assignStrategyClick = (arg) => {
    const nav = arg;
  
    const status = nav.status ? nav.status : 0;
   
    setNav({
      id: nav._id,
      name: nav.name,
      email: nav.email,
      phone: nav.phone,
      position: nav.position,
      entryBalance: nav.entryBalance,
      status: status
    });
   
    setIsEdit(true);
    toggleAssignStrategy();
  };

  const handleCheckingClick = (arg) => {
    const nav = arg;

    setNav({
      id: nav._id,
      name: nav.name,
      status: nav.status,
      email: nav.email,
      phone: nav.phone,
      position: nav.position,
      entryBalance: nav.entryBalance
    });
    setIsEdit(true);
    toggleCheck();
  };

  // Customber Column
  const columns = useMemo(
    () => [
      {
        Header: "Status",
        accessor: "status",
        filterable: true,
        Cell: (cellProps) => {
          return <Status {...cellProps} />;
        },
      },
      {
        Header: "Checking",
        Cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  const customerData = cellProps.row.original;
                  handleCheckingClick(customerData);
                }}
              >
                <i className="mdi mdi-account-check font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Pin Check  
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },

      {
        Header: "Name",
        accessor: "name",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "Email",
        accessor: "email",
        filterable: true,
        Cell: (cellProps) => {
          return <Email {...cellProps} />;
        },
      },
      {
        Header: "Mobile No.",
        accessor: "phone",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Entry Balance",
        accessor: "entryBalance",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Total Balance",
        accessor: "total_balance",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Assign Stratagies",
        accessor: "assignedstrategy",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
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
                className="text-success"
                onClick={() => {
                  
                }}
              >
                <i className="mdi mdi-form-select font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Select Script
                </UncontrolledTooltip>
                <div className="text-success-script">
                  <div    onClick={() => {
                  const customerData = cellProps.row.original;
                  assignStrategyClick(customerData);
                }}>Assign Strategy</div>
                  <div>unassign Strategy</div>
                </div>
              </Link>
              {/* <Link
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
              </Link> */}
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

  const toggleAssignStrategy = () => {
    if (modalAssignStrategy) {
      setModalAssignStrategy(false);
      setNav(null);
    } else {
      setModalAssignStrategy(true);
    }
  };

  //delete customer
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (navigation) => {
    setNav(navigation);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = () => {
    console.log(navigation);
    
    if (navigation && navigation._id) {

      deleteData(`/clients/${navigation._id}`)
        .then((response) => {
          if (response.data.error) {
            return error(response.data.message);
          }

          setDeleteModal(false);
          setNav("");
          getNavigation();
          return success(response.data.message);
        });
    }
  };

  const handleCustomerClicks = () => {
    setIsEdit(false);
    toggle();
  };
  const handleCheckingClicks = () => {
    setIsEdit(false);
    toggleCheck();
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
          <TableContainer
            columns={columns}
            data={navs}
            isGlobalFilter={true}
            isAddCustList={true}
            isPagination={true}
            handleCustomerClick={handleCustomerClicks}
            handleCheckingClick={handleCheckingClicks}
            customPageSize={20}
            className="custom-header-css"
          />

          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} tag="h4">
              {!isEdit ? "Add Client" : "Edit Client"}
            </ModalHeader>
            <ModalBody>
              <Form
                id="createClient"
                onSubmit={(e) => {
                  e.preventDefault();
                 
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col className="col-12">
                    <div className="mb-3">
                      <Label className="form-label">Name<small className="asterisk">*</small></Label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Enter User Name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.name || ""}
                        invalid={
                          validation.touched.name && validation.errors.name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.name && validation.errors.name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.name}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Email<small className="asterisk">*</small></Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email && validation.errors.email
                            ? true
                            : false
                        }
                      />
                      {validation.touched.email && validation.errors.email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.email}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Mobile No.<small className="asterisk">*</small></Label>
                      <Input
                        name="phone"
                        type="number"
                        placeholder="Enter Mobile Number"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values?.phone || ""}
                        invalid={
                          validation.touched?.phone && validation.errors?.phone
                            ? true
                            : false
                        }
                      />
                      {validation.touched?.phone && validation.errors?.phone ? (
                        <FormFeedback type="invalid">
                          {validation.errors?.phone}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Entry Balance<small className="asterisk">*</small></Label>
                      <Input
                        name="entryBalance"
                        type="number"
                        placeholder="Enter Entry Balance"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values?.entryBalance || ""}
                        invalid={
                          validation.touched?.entryBalance && validation.errors?.entryBalance
                            ? true
                            : false
                        }
                      />
                      {validation.touched?.entryBalance && validation.errors?.entryBalance ? (
                        <FormFeedback type="invalid">
                          {validation.errors?.entryBalance}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Status<small className="asterisk">*</small></Label>
                      <Input
                        type="select"
                        name="status"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={isEdit && validation.values.status == 0 ? 0 : validation.values.status || ""}
                        invalid={
                          validation.touched.status && validation.errors.status
                            ? true
                            : false
                        }
                      >
                        <option value="">Select Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </Input>
                      {validation.touched.status && validation.errors.status ? (
                        <FormFeedback type="invalid">
                          {validation.errors.status}
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

          <Modal isOpen={modalCheck} toggle={toggleCheck}>
            <ModalHeader toggle={toggleCheck} tag="h4">
              {!!isEdit ? "My Tread Setting" : "My Tread Setting"}
            </ModalHeader>
            <ModalBody>
              <Form
                id="createTeamMembers"
                onSubmit={(e) => {
                  e.preventDefault();
                 // validation.handleSubmit();
                  //return false;
                }}
              >
                <Row>
                  <Col className="col-12">
                    <div className="mb-3">
                      <Label className="form-label">User ID<small className="asterisk">*</small></Label>
                      
                      <Input
                        name="userId"
                        type="text"
                        placeholder="Select User ID"
                        
                      />
                      {/* {validation.touched.name && validation.errors.name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.name}
                        </FormFeedback>
                      ) : null} */}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Pin<small className="asterisk">*</small></Label>
                      <Input
                        name="pin"
                        type="text"
                        placeholder="Select Pin"
                        
                      />
                      {/* {validation.touched.Email && validation.errors.Email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.Email}
                        </FormFeedback>
                      ) : null} */}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">User Key<small className="asterisk">*</small></Label>
                      <Input
                        name="userKey"
                        type="text"
                        placeholder="Select User Key"
                        
                      />
                      {/* {validation.touched?.Number && validation.errors?.Number ? (
                        <FormFeedback type="invalid">
                          {validation.errors?.Number}
                        </FormFeedback>
                      ) : null} */}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">App key<small className="asterisk">*</small></Label>
                     
                      <Input
                        name="appKey"
                        type="text"
                        placeholder="Select Appkey"
                        
                      />
                      {/* {validation.touched?.Number && validation.errors?.Number ? (
                        <FormFeedback type="invalid">
                          {validation.errors?.Number}
                        </FormFeedback>
                      ) : null} */}
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

           {/* start assign strategy popup */}
          <Modal isOpen={modalAssignStrategy} toggle={toggleAssignStrategy}>
            <ModalHeader toggle={toggleAssignStrategy} tag="h4">
              Assign Stratagy
            </ModalHeader>
            <ModalBody>
              <Form
                id="assignStrategy"
                onSubmit={(e) => {
                  e.preventDefault();
                  validationAssignStratagy.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col className="col-12">
                    <div className="mb-3">
                      <Label className="form-label">Assign Strategy<small className="asterisk">*</small></Label>
                      <Input
                        type="select"
                        name="assignedstrategy"
                        onChange={validationAssignStratagy.handleChange}
                        onBlur={validationAssignStratagy.handleBlur}
                        value={validationAssignStratagy.values.assignedstrategy || ""}
                        invalid={
                          validationAssignStratagy.touched.assignedstrategy && 
                          validationAssignStratagy.errors.assignedstrategy
                        }
                      >
                        <option value="">Select Strategy</option>
                        {strategy.map((strtgy) => (
                          <option key={strtgy._id} value={strtgy._id} name={strtgy.name}>
                            {strtgy.name}
                          </option>
                        ))}
                      </Input>
                      {validationAssignStratagy.touched.assignedstrategy && validationAssignStratagy.errors.assignedstrategy ? (
                        <FormFeedback type="invalid">
                          {validationAssignStratagy.errors.assignedstrategy}
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
            {/* end assign strategy popup */}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};


export default index;
