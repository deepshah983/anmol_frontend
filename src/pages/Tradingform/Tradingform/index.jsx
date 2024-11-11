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
import SelectWarning from "../../../components/Common/SelectWarning";
import TradingTableContainer from "../../../components/Common/TradingTableContainer";
import { success, error } from "../../../components/toast";
// Column
import { Designation, Email, QtyType } from "../../NavigationCol";

const index = (props) => {
  const [navs, setNavs] = useState([]);

 

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
  const [orderTypes, setOrderTypes] = useState([]);
  const [prodType, setProdType] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [navigation, setNav] = useState(null);
  const [showFields, setShowFields] = useState(false);
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = React.useState(true);
  const [importModal, setImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [sharePrice, setSharePrice] = useState(0);
  const [query, setQuery] = useState({
    offset: 0,
    limit: 20,
    page: 0,
    search: "",
    order: "desc",
    sort: "id",
    status: "",
  });

  useEffect(() => {
    getNavigation();
    fetchScripts();
    fetchStrategies();
  }, []);

  const exchangeClasses = {
    'NSE': 'exchange-nse',
    'NFO': 'exchange-nfo'
  };

  const getNavigation = () => {
    request();
  };

 // API request handlers using useCallback to prevent recreation on every render
 const request = useCallback(async (reset_offset = true) => {
  try {
    setLoading(true);
    const url = `/tradingForm?limit=${query.limit}&page_no=${query.page + 1}&search=${query.search}`;
    const response = await getData(url);
    
    if (response?.data?.data) {
      setNavs(response.data.data);
      setTotal(response.data.totalCount);
    }
  } catch (error) {
    console.error('Error fetching trading form data:', error);
  } finally {
    setLoading(false);
  }
}, [query.limit, query.page, query.search]);

const fetchScripts = useCallback(async () => {
  try {
    setLoading(true);
    const url = '/scrips/fetch-instruments';
    const response = await getData(url);
    
    if (response?.data?.data) {
      setScripts(response.data.data.instruments);
      setProdType(response.data.data.tokenData[0]?.orderTypes || []);
      setOrderTypes(response.data.data.tokenData[0]?.products || []);
    }
  } catch (error) {
    console.error('Error fetching scripts:', error);
  } finally {
    setLoading(false);
  }
}, []);

const eBuyClick = (data) => {
  console.log('Selected data:', data);

    buySell(data, "BUY");

};

const eSellClick = (data) => {
  console.log('Selected data:', data);

    buySell(data, "SELL")
};

const eShortClick = (data) => {
  console.log('Selected data:', data);
};

const eCoverClick = (data) => {
  console.log('Selected data:', data);
};


const buySell = (data, transactiontype) => {

  let form_data = {
    "variety":"NORMAL",
    "tradingsymbol":data?.terminalSymbol,
    "symboltoken":"3045",
    "transactiontype":transactiontype,
    "exchange":data?.exchange,
    "ordertype": data?.entryOrder,
    "producttype": data?.prodType,
    "duration":"DAY",
    "price": data?.sharePrice,
    "squareoff":"0",
    "stoploss":"0",
    "quantity":data?.quantity
    };


  postData("tradingForm/buy-sell", form_data)
  .then((response) => {
    if (response.data.error) {
      return error(response.data.message);
    }
    query.page = 0;
    setQuery({ ...query });
    request();
    return success(response.data.message);
  })
  .catch((error) => {
    return error(error);
  });
}

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

const fetchStrategies = useCallback(async () => {
  try {
    setLoading(true);
    const url = '/strategies';
    const response = await getData(url);
    
    if (response?.data?.data) {
      setStrategies(response.data.data);
    }
  } catch (error) {
    console.error('Error fetching strategies:', error);
  } finally {
    setLoading(false);
  }
}, []);

// Initial data fetch
useEffect(() => {
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Use Promise.all to fetch data concurrently
      await Promise.all([
        request(),
        fetchScripts(),
        fetchStrategies()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchInitialData();
}, [request, fetchScripts, fetchStrategies]);

// Update search handler
const handleSearch = useCallback((searchTerm) => {
  setQuery(prev => ({
    ...prev,
    search: searchTerm,
    page: 0 // Reset page when searching
  }));
}, []);


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
    } else {
      setShowFields(false);
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
      quantity: (navigation && navigation.quantity) || "",
      exposure: (navigation && navigation.exposure) || "",
      roundLotSize: (navigation && navigation.roundLotSize) || "",
      prodType: (navigation && navigation.prodType) || "",
      entryOrder: (navigation && navigation.entryOrder) || "",
      exitOrder: (navigation && navigation.exitOrder) || "",
      strategy: (navigation && navigation.strategy) || "",
      portalUserId: (navigation && navigation.portalUserId) || "",
      portalPassword: (navigation && navigation.portalPassword) || "",
      userKey: (navigation && navigation.userKey) || "",
      appKey: (navigation && navigation.appKey) || "",
      price: (navigation && navigation.price) || "",
      triggerPrice: (navigation && navigation.triggerPrice) || "",
      hasExpiry: false,
      hasStrike: false,
      exchange: (navigation && navigation.exchange) || "",
      tickSize: (navigation && navigation.tickSize) || "",
      instrumentType: (navigation && navigation.instrumentType) || "",
      lotSize: (navigation && navigation.lotSize) || "",
    },

    validationSchema: Yup.object().shape({
      terminalSymbol: Yup.string().required("Please Select Terminal Symbol"),
      optionType: Yup.string().required("Please Select Option Type"),
      dynamicExpiry: Yup.string().when('hasExpiry', {
        is: true,
        then: Yup.string().required("Please Select Dynamic Expiry"),
        otherwise: Yup.string().notRequired(),
      }),
      dynamicStrike: Yup.string().when('hasStrike', {
        is: true,
        then: Yup.string().required("Please Select Dynamic Strike"),
        otherwise: Yup.string().notRequired(),
      }),
      qtyType: Yup.string().required("Please select a quantity type"),
      quantity: Yup.number().when("qtyType", {
        is: "sl",
        then: Yup.number().required("Quantity is required").min(1, "Quantity must be positive")
      }),
      exposure: Yup.number().when("qtyType", {
        is: "exposure",
        then: Yup.number().required("Exposure is required").min(1, "Exposure must be positive")
      }),
      roundLotSize: Yup.number().when("qtyType", {
        is: "exposure",
        then: Yup.number().required("Round lot size is required").min(1, "Round lot size must be positive")
      }),
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
 

    }),
    onSubmit: (values) => {
     
      let form = themeConfig.functions.read_form("traingForm");
      let formData = new FormData();
      formData.append("hasExpiry", validation.values.hasExpiry);
      formData.append("hasStrike", validation.values.hasStrike);
      formData.append("exchange", validation.values.exchange);
      formData.append("tickSize", validation.values.tickSize);
      formData.append("instrumentType", validation.values.instrumentType);
      formData.append("lotSize", validation.values.lotSize);
      formData.append("sharePrice", sharePrice);
      Object.keys(form).map((key) => {
        formData.append(key, form[key]);
      });

      if (isEdit) {
        formData.append("id", values.id);
        updateNavigation(values.id, formData);
      } else {

        addNewNavigation(formData);

      }
      setShowFields(false);
     
      validation.resetForm();
      setSharePrice(0);
      setSelectedOption(null)
      toggle();
    },
  });

  const handleReset = () => {
    validation.resetForm();
    setSelectedOption(null);
    setSharePrice(0);
    setShowFields(false);
  
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
    
    console.log(nav);
    
    // Create the selected option object for the Select component
    const selectedSymbolOption = {
      label: nav?.terminalSymbol,
      value: nav?.terminalSymbol,
      exchange: nav?.exchange, // Make sure this is available in nav
      strike: nav?.dynamicStrike,
      instrument_type: nav?.optionType,
      last_price: nav?.last_price,
      lot_size: nav?.lot_size,
      tick_size: nav?.tick_size,
      expiry: nav?.dynamicExpiry
    };
    
    // Set the selected option for the Select component
    setSelectedOption(selectedSymbolOption);
    setSharePrice(nav?.sharePrice)
    setNav({
      id: nav._id,
      terminalSymbol: nav?.terminalSymbol,
      optionType: nav?.optionType,
      dynamicExpiry: nav?.dynamicExpiry,
      dynamicStrike: nav?.dynamicStrike,
      qtyType: nav?.qtyType,
      prodType: nav?.prodType,
      entryOrder: nav?.entryOrder,
      exitOrder: nav?.exitOrder,
      strategy: nav?.strategy,
      portalUserId: nav?.portalUserId,
      portalPassword: nav?.portalPassword,
      userKey: nav?.userKey,
      appKey: nav?.appKey,
      priceBuffer: nav?.priceBuffer,
      priceBufferType: nav?.priceBufferType,
      price: nav?.price,
      triggerPrice: nav?.triggerPrice,
      quantity: nav?.quantity,
      exposure: nav?.exposure,
      roundLotSize: nav?.roundLotSize
    });

    // Update validation values
    validation.setValues({
      ...validation.values,
      terminalSymbol: nav.terminalSymbol,
      optionType: nav.optionType,
      dynamicExpiry: nav.dynamicExpiry,
      dynamicStrike: nav.dynamicStrike,
      qtyType: nav.qtyType,
      ...nav
    });

    setIsEdit(true);
    if (nav.entryOrder === 'SLL') {
      setShowFields(true);
    } else {
      setShowFields(false);
    }
    toggle();
};

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedStrategies(navs.map(strategy => strategy._id));
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

  const handleSymbolChange = (selected) => {
   
    console.log(selected);
    
    setSelectedOption(selected);
    validation.setFieldValue('terminalSymbol', selected ? selected.value : '');
    validation.setFieldValue('optionType', '');
    validation.setFieldValue('dynamicExpiry', '');
    validation.setFieldValue('dynamicStrike', '');
    validation.setFieldValue('hasExpiry', selected && selected.expiry ? true : false);
    validation.setFieldValue('hasStrike', selected && selected.strike ? true : false);

    validation.setFieldValue('exchange', selected?.exchange);
    validation.setFieldValue('tickSize', selected?.tick_size);
    validation.setFieldValue('instrumentType', selected?.instrument_type);
    validation.setFieldValue('lotSize', selected?.lot_size);

    if (selected.exchange === 'NFO') {
      setIsInputDisabled(false); // Enable input if exchange is "NFO"
    } else {
      setIsInputDisabled(true); // Keep input disabled for other exchanges
    }

    const label = selected.value;
    const exchange = selected.exchange;

    getData(`tradeQuote/${exchange}:${label}`)
    .then((response) => {
      if (response.data.error) {
        return error(response.data.message);
      }

      setSharePrice(response.data?.data?.data?.[`${exchange}:${label}`]?.last_price)
    });

  };

  const getOptionTypes = () => {
  
    if (!selectedOption || !selectedOption.instrument_type) return [];
    validation.values.optionType = selectedOption.instrument_type;
    return [selectedOption.instrument_type];
  };

  const getExpiryDates = useCallback(() => {
    // Return empty if no selected option or expiry
    if (!selectedOption?.expiry) return [];
  
    // Function to check if string is already formatted
    const isAlreadyFormatted = (dateString) => {
      const pattern = /^\d{1,2}(st|nd|rd|th)\s+[A-Za-z]+$/;
      return pattern.test(dateString);
    };
  
    // Function to get ordinal suffix
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    // Function to format date
    const formatDate = (dateString) => {
      try {
        const inputDate = new Date(dateString);
        
        // Check if date is valid
        if (!isNaN(inputDate.getTime())) {
          const day = inputDate.getDate();
          const month = inputDate.toLocaleString('default', { month: 'long' });
          return `${day}${getOrdinalSuffix(day)} ${month}`;
        }
        return dateString; // Return original string if date is invalid
      } catch (error) {
        return dateString; // Return original string if parsing fails
      }
    };
  
    // Get the formatted string
    const formattedString = isAlreadyFormatted(selectedOption.expiry)
      ? selectedOption.expiry
      : formatDate(selectedOption.expiry);
      
    // Only update form value if it's different and not already being updated
    if (validation.values.dynamicExpiry !== formattedString && !validation.isSubmitting) {
      // Use requestAnimationFrame to batch the update
      requestAnimationFrame(() => {
        validation.setFieldValue('dynamicExpiry', formattedString);
      });
    }
  
    return [formattedString];
  }, [selectedOption?.expiry, validation.values.dynamicExpiry]); // Only depend on necessary values

  const getStrikes = () => {
    if (!selectedOption || !selectedOption.strike) return [];
    validation.values.dynamicStrike = selectedOption.strike.toString()
    return [selectedOption.strike.toString()];
  };

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
              checked={selectedStrategies.length === navs.length && navs.length !== 0}
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
          return <QtyType {...cellProps} />;
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
  const [warningModal, setWarningModal] = useState(false);
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
    validation.resetForm();
    setSharePrice(0);
    setSelectedOption(null)
    toggle();
  };

  //delete all data
  const selectedDataDelete = () => {
    if(selectedStrategies.length > 0){
    setDeleteAllModal(true);
    }else{
      setWarningModal(true);
    }
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
       <SelectWarning
        show={warningModal}
        onCloseClick={() => setWarningModal(false)}
     />
      <Card>
        <CardBody>
        <TradingTableContainer
        columns={columns}
        data={navs}
        isGlobalFilter={true}
        isAddCustList={true}
        isPagination={false}
        isWatchList={true}
        handleCustomerClick={handleCustomerClicks}
        selectedDataDelete={selectedDataDelete}
        customPageSize={600}
        className="custom-header-css"
        handleExport={handleExport}
        handleImport={handleImportClick}
        eBuyClick={eBuyClick}
        eSellClick={eSellClick}
        eShortClick={eShortClick}
        eCoverClick={eCoverClick}
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
                              exchange: script.exchange,
                              strike: script.strike,
                              instrument_type: script.instrument_type,
                              last_price: script.last_price,
                              lot_size: script.lot_size,
                              tick_size: script.tick_size,
                              expiry: script.expiry
                            }))}
                            onChange={handleSymbolChange}
                            onBlur={validation.handleBlur}
                            value={selectedOption} // Set value based on selected option state
                            isSearchable
                            placeholder="Select Symbol"
                            onInputChange={(inputValue) => searchScripts(inputValue)} // Call search function on input change
                            formatOptionLabel={({ label, exchange }) => {
                              // Get the class based on the exchange value
                              const className = exchangeClasses[exchange];

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
                            <option value="">Select Strategy</option>
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
                           
                            <option value="" disabled>Select Expiry Date</option>
                            {getExpiryDates().map((date) => (
                              <option key={date} value={date}>{date}</option>
                            ))}
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
                            invalid={validation.touched.dynamicStrike && validation.errors.dynamicStrike ? "true" : undefined}
                            disabled={isInputDisabled}
                          >
                            <option value="" disabled>Select Strike</option>
                            {getStrikes().map((strike) => (
                              <option key={strike} value={strike}>{strike}</option>
                            ))}
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
                            invalid={validation.touched.optionType && validation.errors.optionType ? "true" : undefined}
                           
                          >
                            <option value="" disabled>Select Option Type</option>
                              {getOptionTypes().map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                          </Input>
                          {validation.touched.optionType && validation.errors.optionType ? (
                            <FormFeedback type="invalid">
                              {validation.errors.optionType}
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
                            <option value="">Select  Prod Type</option>
                            {prodType.map((strike) => (
                              <option key={strike} value={strike}>{strike}</option>
                            ))}
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
                          <Label className="form-label">Qty Type</Label>
                          <Input
                            type="select"
                            name="qtyType"
                            className="col-md-6 select-script"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.qtyType || ""}
                            invalid={validation.touched.qtyType && validation.errors.qtyType ? "true" : undefined}
                          >
                            <option value="">Select Qty</option>
                            <option value="sl">STOP LOSS</option>
                            <option value="exposure">EXPOSURE</option>
                          </Input>
                          {validation.touched.qtyType && validation.errors.qtyType ? (
                            <FormFeedback type="invalid">
                              {validation.errors.qtyType}
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
                            <option value="" disabled>Select Entry Order</option>
                            <option value="SLL">SLL</option>
                            <option value="MARKET">MARKET</option>
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
                                invalid={validation.touched.exitOrder && validation.errors.exitOrder ? true : false}
                              >
                                <option value="">Select Exit Order</option>
                                <option value="MARKET">MARKET</option>
                                <option value="DELIVERY">Delivery</option>
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
                  
                      {validation.values.qtyType === "sl" && (
                          <div className="add-tread col-md-4">
                            <Label className="form-label">Quantity</Label>
                            <Input
                              type="number"
                              name="quantity"
                              className="col-md-6 select-script"
                              placeholder="Enter Quantity"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.quantity || ""}
                              invalid={validation.touched.quantity && validation.errors.quantity ? true : false}
                            />
                            {validation.touched.quantity && validation.errors.quantity ? (
                              <FormFeedback type="invalid">
                                {validation.errors.quantity}
                              </FormFeedback>
                            ) : null}
                          </div>
                        )}
                        </div>
                        
                        {validation.values.qtyType === "exposure" && (
                          <>
                          <div className="add-tread-beside">
                            <div className="add-tread col-md-4">
                              <Label className="form-label">Exposure</Label>
                              <Input
                                type="number"
                                name="exposure"
                                className="col-md-6 select-script"
                                placeholder="Enter Exposure"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.exposure || ""}
                                invalid={validation.touched.exposure && validation.errors.exposure ? true : false}
                              />
                              {validation.touched.exposure && validation.errors.exposure ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.exposure}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="add-tread col-md-4">
                              <Label className="form-label">Round Lot Size</Label>
                              <Input
                                type="number"
                                name="roundLotSize"
                                className="col-md-6 select-script"
                                placeholder="Enter Round Lot Size"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.roundLotSize || ""}
                                invalid={validation.touched.roundLotSize && validation.errors.roundLotSize ? true : false}
                              />
                              {validation.touched.roundLotSize && validation.errors.roundLotSize ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.roundLotSize}
                                </FormFeedback>
                              ) : null}
                            </div>
                            </div>
                            
                          </>
                        )}
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
