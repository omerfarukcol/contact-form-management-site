import { React, useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import BringUserInformation from "./BringUserInformation";
import UserDropdown from "./UserDropdown";
import logo from "../logo.png";
import { useTranslation } from "react-i18next";

function NavigationBar() {
  const user = BringUserInformation();
  const { t } = useTranslation();
  return (
    <div className="App">
      <Navbar
        collapseOnSelect
        expand="lg"
        variant="dark"
        style={{ backgroundColor: "rgb(179, 179, 179)" }}
        className="navbar"
      >
        <Navbar.Brand href="/">
          <img src={logo} width="30" height="30" alt="Home"></img>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link href="/messages">{t("messages")}</Nav.Link>
            {user.role === "admin" && (
              <>
                <Nav.Link href="/users">{t("users")}</Nav.Link>
                <Nav.Link href="/reports">{t("reports")}</Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="ml-auto">
            <form className="form-inline">
              <UserDropdown />
            </form>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavigationBar;
