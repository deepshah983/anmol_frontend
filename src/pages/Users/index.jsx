import React from "react";
//Import Breadcrumb
import Breadcrumbs from "../../../src/components/Common/Breadcrumb";
import {
  Container,
} from "reactstrap";

import Users from "./User/index";
import { ToastElement } from "../../components/toast";

const index = () => {

  return (
    <>
      <ToastElement />
      <div className="page-content user-page">
        <Container fluid>
          <Breadcrumbs title="Dashboard" titleUrl="/dashboard" breadcrumbItem="Users" />
          
            <Users />
            
        </Container>
      </div>
    </>
  );
};

export default index;
