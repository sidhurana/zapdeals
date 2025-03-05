// src/components/Categories.js
import React from "react";
import { NavDropdown } from "react-bootstrap";

const Categories = () => {
  return (
    <NavDropdown title="Categories" id="categories-dropdown">
      <NavDropdown.Item href="#">Electronics</NavDropdown.Item>
      <NavDropdown.Item href="#">Gaming</NavDropdown.Item>
      <NavDropdown.Item href="#">Home & Kitchen</NavDropdown.Item>
      <NavDropdown.Item href="#">Fashion</NavDropdown.Item>
      <NavDropdown.Item href="#">More...</NavDropdown.Item>
    </NavDropdown>
  );
};

export default Categories;

