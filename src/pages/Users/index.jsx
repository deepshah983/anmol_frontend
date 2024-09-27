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
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" titleUrl="" breadcrumbItem="Client" />
          <div className="card">
            <div className="card-body">
            <Users />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default index;
