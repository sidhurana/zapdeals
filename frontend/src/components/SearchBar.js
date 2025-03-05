// src/components/SearchBar.js
import React, { useState } from "react";
import { Form, FormControl } from "react-bootstrap";

const SearchBar = ({ setSearchTerm }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setSearchTerm(e.target.value);
  };

  return (
    <Form className="d-flex">
      <FormControl
        type="search"
        placeholder="Search deals..."
        className="me-2"
        value={query}
        onChange={handleSearch}
      />
    </Form>
  );
};

export default SearchBar;

