import React, { useState } from "react";
//Import Breadcrumb
import Breadcrumbs from "../../../src/components/Common/Breadcrumb";
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";

import Testimonial from "./Testimonial/index"

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
          <Breadcrumbs breadcrumbItem="Global" />
          <div className="card">
            <div className="card-body">
              <Nav tabs className="nav-tabs-custom nav-justified ">
                <NavItem style={{maxWidth:"15rem"}} >
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      active: customActiveTab === "1",
                    })}
                    onClick={() => {
                      toggleCustom("1");
                    }}
                  >
                    Testimonial
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
          </div>

          <TabContent activeTab={customActiveTab} className="text-muted">
            <TabPane tabId="1">
              <Testimonial />
            </TabPane>
          </TabContent>
        </Container>
      </div>
    </>
  );
};

export default index;
