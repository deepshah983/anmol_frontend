import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import * as Yup from "yup";
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

import {
  getData,
  postData,
  updateData,
  deleteData,
} from "../../../components/api";
import DeleteModal from "../../../components/Common/DeleteModal";
import DeleteAllModal from "../../../components/Common/DeleteAllData";
import TradingTableContainer from "../../../components/Common/TradingTableContainer";
import { success, error } from "../../../components/toast";
import HideShowSection from "../../../components/Common/HideShowSection";
import { Strategy } from "../../NavigationCol";
import themeConfig from "../../../configs/themeConfig";

const StrategyManagement = () => {
  const [strategies, setStrategies] = useState([]);
  const [count, setCount] = useState(0);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [strategy, setStrategy] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const [selectedStrategies, setSelectedStrategies] = useState([]);

  useEffect(() => {
    getStrategies();
  }, []);

  const getStrategies = async () => {
    try {
      const response = await getData("/strategies");
      setStrategies(response.data.data);
      setCount(response.data.data.length);
    } catch (err) {
      error("Failed to load strategies");
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (strategy && strategy.id) || "",
      name: (strategy && strategy.name) || "",
      entryTime: (strategy && strategy.entryTime) || "",
      exitTime: (strategy && strategy.exitTime) || "",
      squareOffTime: (strategy && strategy.squareOffTime) || "",
      quantityMultiplier: (strategy?.quantityMultiplier) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Strategy Name"),
      // entryTime: Yup.string().required("Please Enter Entry Time"),
      // exitTime: Yup.string().required("Please Enter Exit Time"),
      // squareOffTime: Yup.string().required("Please Enter Square-off Time"),
      quantityMultiplier: Yup.number().required("Please Enter Quantity Multiplier"),
    }),
    onSubmit: (values) => {
      let form = themeConfig.functions.read_form("createStrategy");
      let formData = new FormData();
      Object.keys(form).map((key) => {
        formData.append(key, form[key]);
      });
    
      if (isEdit) {
        updateStrategy(values.id, formData);
      } else {
        addNewStrategy(formData);
      }
    }
  });

  const addNewStrategy = (form_data) => {
    postData("/strategy", form_data)
      .then((response) => {
        if (response?.data?.error) {
          return error(response?.data?.message);
        }
        getStrategies();
        validation.resetForm();
        toggle();
        return success(response?.data?.message);
      })
      .catch((err) => {
        return error(err?.response?.data?.error);
      });
  };

  const updateStrategy = (id, form_data) => {
    updateData(`/strategy/${id}`, form_data)
      .then((response) => {
        if (response?.data?.error) {
          return error(response?.data?.message);
        }
        getStrategies();
        validation.resetForm();
        toggle();
        return success(response?.data?.message);
      })
      .catch((err) => {
        return error(err?.response?.data?.error);
      });
  };

  const handleStrategyClick = (strategyData) => {
    setStrategy({
      id: strategyData._id,
      name: strategyData.name,
      entryTime: strategyData.entryTime,
      exitTime: strategyData.exitTime,
      squareOffTime: strategyData.squareOffTime,
      quantityMultiplier: strategyData.quantityMultiplier,
    });
    setIsEdit(true);
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

  const handleActionOnSelected = () => {
    const selectedStrategyData = getSelectedStrategies();
    console.log("Selected Strategies:", selectedStrategyData);
    // Perform actions with selectedStrategyData
  };

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
            <Label className="form-check-label" htmlFor="selectAll">
              Select All
            </Label>
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
        Header: "Strategy Name",
        accessor: "name",
        Cell: ({ value }) => <Strategy value={value} />,
      },
      {
        Header: "Entry Time",
        accessor: "entryTime",
        Cell: ({ value }) => <Strategy value={value} />,
      },
      {
        Header: "Exit Time",
        accessor: "exitTime",
        Cell: ({ value }) => <Strategy value={value} />,
      },
      {
        Header: "Square-off Time",
        accessor: "squareOffTime",
        Cell: ({ value }) => <Strategy value={value} />,
      },
      {
        Header: "Quantity Multiplier",
        accessor: "quantityMultiplier",
        Cell: ({ value }) => <Strategy value={value} />,
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div className="d-flex gap-3">
            <Link
              to="#"
              className="text-success"
              onClick={() => handleStrategyClick(row.original)}
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
              <UncontrolledTooltip placement="top" target="edittooltip">
                Edit
              </UncontrolledTooltip>
            </Link>

            <Link
              to="#"
              className="text-danger"
              onClick={() => onClickDelete(row.original)}
            >
              <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
              <UncontrolledTooltip placement="top" target="deletetooltip">
                Delete
              </UncontrolledTooltip>
            </Link>
          </div>
        ),
      },
    ],
    [strategies, selectedStrategies]
  );

  const toggle = () => {
    if (modal) {
      setModal(false);
      setStrategy(null);
    } else {
      setModal(true);
    }
  };

  const onClickDelete = (strategy) => {
    setStrategy(strategy);
    setDeleteModal(true);
  };

  const handleDeleteStrategy = async () => {
    try {
      await deleteData(`/strategy/${strategy._id}`);
      success("Strategy Deleted Successfully");
      getStrategies();
    } catch (err) {
      error("Failed to delete strategy");
    }
    setDeleteModal(false);
  };

  //erse selected data
  const handleDeleteAllData = () => {
 
    if(selectedStrategies.length > 0){
      deleteData(`strategies/selectedDataErase/${selectedStrategies}`)
        .then((response) => {
          if (response.data.error) {
            return error(response.data.message);
          }

          setDeleteAllModal(false);
          getStrategies();
          return success(response.data.message);
        });
      }
  };
//end erse selected data

  const handleCustomerClicks = () => {
    setIsEdit(false);
    toggle();
  };

   //delete all data
   const selectedDataDelete = () => {
    setDeleteAllModal(true);
  }

  return (
    <>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteStrategy}
        onCloseClick={() => setDeleteModal(false)}
      />
       <DeleteAllModal
      show={deleteAllModal}
      onDeleteClick={handleDeleteAllData}
      onCloseClick={() => setDeleteAllModal(false)}
    />
      <div className="">
        <Container fluid>
          <HideShowSection
            title="Total Strategies"
            toggle={false}
            count={count}
          >
            <Button
              color="secondary"
              className="btn btn-secondary me-1 float-end"
              onClick={handleActionOnSelected}
              disabled={selectedStrategies.length === 0}
            >
              Action on Selected ({selectedStrategies.length})
            </Button>
            <Button
              color="primary"
              className="btn btn-primary me-1 float-end"
              onClick={toggle}
            >
              + Add Strategy
            </Button>
          </HideShowSection>

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <TradingTableContainer
                    columns={columns}
                    data={strategies}
                    isGlobalFilter={true}
                    isAddCustList={true}
                    isPagination={true}
                    handleCustomerClick={handleCustomerClicks}
                    selectedDataDelete={selectedDataDelete}
                    customPageSize={20}
                    className="custom-header-css"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          {isEdit ? "Edit Strategy" : "Add Strategy"}
        </ModalHeader>
        <ModalBody>
          <Form
            id="createStrategy"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
            }}
          >
            <Row>
              <Col className="mb-3" md={12}>
                <Label htmlFor="name">Strategy Name</Label>
                <Input
                  name="name"
                  id="name"
                  placeholder="Strategy Name"
                  type="text"
                  value={validation.values.name}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={validation.touched.name && validation.errors.name}
                />
                <FormFeedback>{validation.errors.name}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="entryTime">Entry Time</Label>
                <Input
                  name="entryTime"
                  id="entryTime"
                  type="time"
                  value={validation.values.entryTime}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={validation.touched.entryTime && validation.errors.entryTime}
                />
                <FormFeedback>{validation.errors.entryTime}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="exitTime">Exit Time</Label>
                <Input
                  name="exitTime"
                  id="exitTime"
                  type="time"
                  value={validation.values.exitTime}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={validation.touched.exitTime && validation.errors.exitTime}
                />
                <FormFeedback>{validation.errors.exitTime}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="squareOffTime">Square-off Time</Label>
                <Input
                  name="squareOffTime"
                  id="squareOffTime"
                  type="time"
                  value={validation.values.squareOffTime}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={validation.touched.squareOffTime && validation.errors.squareOffTime}
                />
                <FormFeedback>{validation.errors.squareOffTime}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="quantityMultiplier">Quantity Multiplier</Label>
                <Input
                  name="quantityMultiplier"
                  id="quantityMultiplier"
                  placeholder="Quantity Multiplier"
                  type="number"
                  value={isEdit && validation.values.quantityMultiplier == 0 ? 0 : validation.values.quantityMultiplier || ""}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={validation.touched.quantityMultiplier && validation.errors.quantityMultiplier}
                />
                <FormFeedback>{validation.errors.quantityMultiplier}</FormFeedback>
              </Col>

              <Col className="mb-3">
                <Button color="primary" type="submit">
                  {isEdit ? "Update" : "Submit"}
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

StrategyManagement.propTypes = {
  history: PropTypes.object,
};

export default StrategyManagement;