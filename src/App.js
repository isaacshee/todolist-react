import React, {useState, useEffect, Fragment} from "react";
import InputGroup from 'react-bootstrap/InputGroup';
import logo from './logo.svg';
import './App.css';
import CRUD from './CRUD';
import { Form } from "react-bootstrap";

function App() {

  return (
    <div className="App">
      <h1>Todo List REST API Application</h1>
      <CRUD />
    </div>
  );
}

export default App;
