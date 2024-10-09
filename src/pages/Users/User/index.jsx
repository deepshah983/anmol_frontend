import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import Select from 'react-select';
import ReactPaginate from "react-paginate";
import GoldenTradingLoader from '../../../components/Loader';
import {
  Card,
  CardBody,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  FormFeedback,
  Label,
  Form,
  Button
} from "reactstrap";

import { useLocation } from "react-router-dom";
//Import Breadcrumb
import { getData, postData, updateData, deleteData } from "../../../components/api";
import themeConfig from "../../../configs/themeConfig";
import DeleteModal from "../../../components/Common/DeleteModal";

//redux
import TableContainer from "../../../components/Common/TableContainer";

import { success, error } from "../../../components/toast";

// Column
import { Name, Status, Designation, Email } from "../../NavigationCol";

const userOptions = [
  {
    label: 'All Users',
    value: 'all'
  },
  {
    label: 'Active',
    value: 1
  },
  {
    label: 'Inactive',
    value: 0
  }
]

const Users = (props) => {

  const {state} = useLocation()

  const [navs, setNavs] = useState([]);
  const [strategy, setStrategy] = useState([]);
  const [tags, setTags] = useState([])
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = useState({
    offset: 0,
    limit: 20,
    page: 0,
    search: "",
    order: "desc",
    sort: "id",
    status: "",
  });
  const [selectedUser, setSelectedUser] = useState('all')

    const request = (reset_offset = true) => {
     
    // if (reset_offset) {
    //   query.offset = 0;
    //   setQuery(query);
    // }

    let url = `/clients?limit=${query.limit}&page_no=${query.page + 1}&search=${query.search}`;
    getData(url).then((response) => {
      let clients = response?.data?.data?.clients;
        let strategies = response?.data?.data?.strategies;
        let userStrategy = response?.data?.data?.userStrategy;
        let treadSetting = response?.data?.data?.clients?.treadSetting;
        
        clients = clients.map(client => {
          let assignedStrategy = '';
          userStrategy.map(strategy => {
            // Replace the assigned strategy ID with the strategy name
            if(client._id == strategy.parent_id){
            client.selectedStrategy = strategy.assigned_stratagies;
            strategy.assigned_stratagies.map(row => {
              if(assignedStrategy == '')
              assignedStrategy = row?.label;
            else
            assignedStrategy = assignedStrategy+', '+row?.label;
          })
        }
          })
          client.assignedstrategy = assignedStrategy;
          return client;
        
        });
         
        strategies = strategies.map(row => {
          row.label = row.name;
          row.value = row._id;

          return row;
        });
        // After processing, update state with the modified clients and strategies
      setNavs(clients);
      setStrategy(strategies);
      setTotal(response?.data?.totalClients);

      setLoading(false)  
      
    });


  };
  useEffect(() => {
    request();
  }, []);

  // Set the user filter
  useEffect(() => {
    if (state?.userStatus) {
      const isActive = state?.userStatus === 'active' ? 1 : 0
      setSelectedUser(isActive);
    }
  },[state])


  const [modal, setModal] = useState(false);
  const [modalCheck, setModalCheck] = useState(false);
  const [modalAssignStrategy, setModalAssignStrategy] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [navigation, setNav] = useState(null);
  const [navigationTreadSetting, setNavTreadSetting] = useState(null);

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
      availableCash: (navigation && navigation.availableCash) || "",
      status: (navigation && navigation.status) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Please Enter User Name")
        .min(4, "Name must be at least 4 characters"),
      email: Yup.string()
        .required("Please Enter Email")
        .email("Please enter a valid email address"),
      phone: Yup.string()
        .required("Please Enter Mobile Number")
        .matches(/^\d+$/, "Phone number must contain only digits")
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must not exceed 15 digits"),
      entryBalance: Yup.number()
        .required("Please Enter Entry Balance")
        .min(0, "Entry Balance must be at least 0"),
      status: Yup.string().test('conditional-required', 'Please Select Status', function(value) {
        // If the initial status is 0, don't require a value
        if (navigation?.status === 0 || navigation?.status === '0') {
          return true;
        }
        return value !== undefined && value !== null && value !== '';
      }),
    }),
    onSubmit: (values) => {
      
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
        
        if (response.data.error) {
          return error(response.data.error);
        }
        query.page = 0;
        setQuery({ ...query });
        request();
        validation.resetForm();
        toggle();
        return success(response.data.message);
       
      
      })
      .catch((err) => {
        return error(err?.response?.data?.error);
      });
  };

  const updateUser = (id, form_data) => {

    updateData(`/clients/${id}`, form_data)
      .then((response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        
        // query.page = 0;
        // setQuery({ ...query });
        request();
        validation.resetForm();
        toggle();
        return success(response.data.message);
      })
      .catch((err) => {
        return error(err?.response?.data?.error);
      });
  };

  //validation Tread Setting
  const validationTreadSetting = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: (navigation && navigation.id) || "",
      userId: (navigation && navigation.userId) || "",
      pin: (navigation && navigation.pin) || "",
      userKey: (navigation && navigation.userKey) || "",
      appKey: (navigation && navigation.appKey) || "",
    },
    validationSchema: Yup.object({
      userId: Yup.string().required("Please Enter User Id"),
      pin: Yup.string().required("Please Enter Pin"),
      userKey: Yup.string().required("Please Enter userKey"),
      appKey: Yup.string().required("Please Enter appKey"),
    }),
    onSubmit: (values) => {
      
      let form = themeConfig.functions.read_form("treadSetting");
      let formData = new FormData();
      Object.keys(form).map((key) => {
        formData.append(key, form[key]);
      });
      
        formData.append("parent_id", values.id);
        TreadSetting(values.id, formData);
    },
  });
  //end validation Tread Setting

  //function of tread setting
  const TreadSetting = (id, form_data) => {

    postData(`/clients/tread-setting/${id}`, form_data)
      .then((response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        
        // query.page = 0;
        // setQuery({ ...query });
        request();
        validationTreadSetting.resetForm();
        toggleCheck();
        return success(response.data.message);
      })
      .catch((err) => {
        return error(err?.response?.data?.error);
      });
  };
  //end

   // validation
   const validationAssignStratagy = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    
    initialValues: {
      id: (navigation && navigation.id) || "",
      assignedstrategy: (navigation && navigation.assignedstrategy) || "",

    },
    onSubmit: (values) => {
    
      const transformedArray = tags.map((item) => ({
        strategy_id: item._id, // If item.blog_id exists, use it; otherwise, use item.id
        label: item.label,
        value: item.value,
        parent_id: values.id, // Add the desired parent_id value here
      }));
  
      let tagsData = {
        tags: transformedArray,
        parent_id: values.id
      }

      updateAssignStrategy(tagsData);
     
    },
  });

  const updateAssignStrategy = (form_data) => {

    postData(`/client/assignStrategy`, form_data)
      .then((response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        
        // query.page = 0;
        // setQuery({ ...query });
        request();
        validationAssignStratagy.resetForm();
        toggleAssignStrategy();
        return success(response.data.message);
      })
      .catch((err) => {
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
      availableCash: nav.availableCash,
      status: status
    });
   
    setIsEdit(true);
    toggle();
  };


    const assignStrategyClick = (arg) => {
      const nav = arg;
      
      let assignStrategyNav = '';
  
      strategy.map((row) => {
       if(row.name == nav.assignedstrategy){
          assignStrategyNav = row._id;
       }
      })
  
      setNav({
        id: nav._id,
        assignedstrategy: assignStrategyNav,
      });
     setTags(nav.selectedStrategy)
      setIsEdit(true);
      toggleAssignStrategy();
    };


  const handleCheckingClick = (arg) => {
    const nav = arg;
    
    setNav({
      id: nav._id,
      userId: nav?.treadSetting?.userId,
      pin: nav?.treadSetting?.pin,
      userKey: nav?.treadSetting?.userKey,
      appKey: nav?.treadSetting?.appKey,
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
        accessor: "availableCash",
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
              </Link>
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  
                }}
              >
                <i className="mdi mdi-form-select font-size-18" id="edittooltip" />
                <div className="text-success-script">
                  <div    onClick={() => {
                  const customerData = cellProps.row.original;
                  assignStrategyClick(customerData);
                }}>Manage Strategy</div>
                </div>
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



  const handleDeleteCustomer = () => {
    
    if (navigation && navigation._id) {

      deleteData(`/clients/${navigation._id}`)
        .then((response) => {
          if (response.data.error) {
            return error(response.data.message);
          }

          setDeleteModal(false);
          setNav("");
          // query.page = 0;
          // setQuery({ ...query });
          request();
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

  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "#023950",
      // match with the menu
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      // Overwrittes the different states of border
      borderColor: state.isFocused ? "yellow" : "green",
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        // Overwrittes the different states of border
        borderColor: state.isFocused ? "red" : "blue"
      }
    }),
    menu: base => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0
    }),
    menuList: base => ({
      ...base,
      // kill the white space on first and last option
      padding: 0
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
   
      return {
        ...styles,
        backgroundColor: isFocused ? "#999999" : "white",
        color: "#333333"
      };
    }
  };

  const handlePagination = (page) => {
    
    query.offset = page.selected * query.limit;
    query.page = page.selected ;
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
            <div className="col-sm-1">Total: {total}</div>
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

  const changeUserOption = (value) => {
    setSelectedUser(value);
  }

  function filterUserByStatus(users){
    return [...users].filter(user => selectedUser === 'all' ? user : user.status?.toString() === selectedUser?.toString());
  }

  console.log("selectedUser: ", selectedUser)
  console.log("selectedUser type: ", typeof selectedUser)

  // console.log("navs: ", navs)

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
            data={filterUserByStatus(navs)}
            isGlobalFilter={true}
            isAddUserList={true}
            isPagination={false}
            handleCustomerClick={handleCustomerClicks}
            handleCheckingClick={handleCheckingClicks}
            customPageSize={600}
            className="custom-header-css"
            options={userOptions}
            selectedOption={selectedUser}
            changeOption={changeUserOption}
          />
        
          <CustomPagination />
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} tag="h4">
              {!isEdit ? "Add User" : "Edit User"}
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
                id="treadSetting"
                onSubmit={(e) => {
                  e.preventDefault();
                 validationTreadSetting.handleSubmit();
                  return false;
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
                        onChange={validationTreadSetting.handleChange}
                        onBlur={validationTreadSetting.handleBlur}
                        value={validationTreadSetting.values?.userId || ""}
                        invalid={
                          validationTreadSetting.touched?.userId && validationTreadSetting.errors?.userId
                            ? true
                            : false
                        }
                      />
                      {validationTreadSetting.touched.userId && validationTreadSetting.errors.userId ? (
                        <FormFeedback type="invalid">
                          {validationTreadSetting.errors.userId}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Pin<small className="asterisk">*</small></Label>
                      <Input
                        name="pin"
                        type="text"
                        placeholder="Select Pin"
                        onChange={validationTreadSetting.handleChange}
                        onBlur={validationTreadSetting.handleBlur}
                        value={validationTreadSetting.values?.pin || ""}
                        invalid={
                          validationTreadSetting.touched?.pin && validationTreadSetting.errors?.pin
                            ? true
                            : false
                        }
                      />
                      {validationTreadSetting.touched.pin && validationTreadSetting.errors.pin ? (
                        <FormFeedback type="invalid">
                          {validationTreadSetting.errors.pin}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">User Key<small className="asterisk">*</small></Label>
                      <Input
                        name="userKey"
                        type="text"
                        placeholder="Select User Key"
                        onChange={validationTreadSetting.handleChange}
                        onBlur={validationTreadSetting.handleBlur}
                        value={validationTreadSetting.values?.userKey || ""}
                        invalid={
                          validationTreadSetting.touched?.userKey && validationTreadSetting.errors?.userKey
                            ? true
                            : false
                        }
                      />
                      {validationTreadSetting.touched?.userKey && validationTreadSetting.errors?.userKey ? (
                        <FormFeedback type="invalid">
                          {validationTreadSetting.errors?.userKey}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">App key<small className="asterisk">*</small></Label>
                     
                      <Input
                        name="appKey"
                        type="text"
                        placeholder="Select Appkey"
                        onChange={validationTreadSetting.handleChange}
                        onBlur={validationTreadSetting.handleBlur}
                        value={validationTreadSetting.values?.appKey || ""}
                        invalid={
                          validationTreadSetting.touched?.appKey && validationTreadSetting.errors?.appKey
                            ? true
                            : false
                        }
                      />
                      {validationTreadSetting.touched?.appKey && validationTreadSetting.errors?.appKey ? (
                        <FormFeedback type="invalid">
                          {validationTreadSetting.errors?.appKey}
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

           {/* start assign strategy popup */}
          <Modal isOpen={modalAssignStrategy} toggle={toggleAssignStrategy}>
            <ModalHeader toggle={toggleAssignStrategy} tag="h4">
              Stratagy
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
                <div className="col-xl-12 mt-1">
                  <div className="form-group">
                    {(strategy !== null) ? (
                      <Select
                      styles={customStyles}
                        isClearable={false}
                        isMulti
                        options={strategy}
                        value={tags}
                        name="strategy"
                        className='react-select'
                        classNamePrefix='select'
                        isDisabled={false}
                        onChange={e => {
                          setTags(e)
                        }}
                      />
                    ) : <></>}
                    
                  </div>
                </div>
              </div>
              </Col>
              </Row>
                <Row>
                  <Col>
                  <div className="d-flex justify-content-end">
                  <Button color="success" type="submit">
                    Save
                  </Button>
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


export default Users;
