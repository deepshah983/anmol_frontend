import React, { useState } from "react";
//Import Breadcrumb
import Breadcrumbs from "../../../src/components/Common/Breadcrumb";

import {
  Container,
} from "reactstrap";

import { ToastElement } from "../../components/toast"; 
 


const index = () => {
  // Tabs
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  return (
    <>
      <ToastElement />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" titleUrl="" breadcrumbItem="Users" />
          <div className="card">
            <div className="card-body">
              
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default index;
