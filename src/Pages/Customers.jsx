import React, { useRef, useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import CustomersTable from "../Components/CustomerDataTable";
import { useNavigate } from "react-router-dom";



function Customers() {
  const navigate = useNavigate();

 

  return (
    <div>
      <Navbar heading="Gestion de la clientèle" />
      <CustomersTable />
     
    </div>
  );
}

export default Customers;