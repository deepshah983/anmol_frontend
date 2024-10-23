import React, { useState } from "react";
//Import Breadcrumb
import Breadcrumbs from "../../../src/components/Common/Breadcrumb";
import withRouter from "../../components/Common/withRouter";
import OrderLog from "./OrderLog-inner/index";

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
      <div className="page-content orderLog">
        <Container fluid>
          <Breadcrumbs title="Dashboard" titleUrl="" breadcrumbItem="Order Log" />
                <OrderLog />
        </Container>
      </div>
    </>
  );
};

export default index;
