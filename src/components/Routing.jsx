import React from "react";
import { Outlet, Route, Routes } from "react-router";
import App from "../App";
import Home from "./Home";
import Header from "./Header";
import Register from "./Register";
import Login from "./login";
import Doctorreg from "./Doctorreg";
import Finddoctor from "./Finddoctor";
import About from "./About";
import AdminLayout from "../Admin/AdminLayout";
import Dashboard from "../Admin/Dashboard";
import EditDoctor from "../Admin/EditDoctor";
import ViewDoctor from "../Admin/ViewDoctor";
import Doctorpanel from "../Doctor/Doctorpanel";
import ViewPatient from "../Admin/ViewPatient";
import EditPatient from "../Admin/EditPatient";

import Footer from "./Footer";
import Myprofile from "./Myprofile";

import DrProfile from "../Doctor/DrProfile";

// import Doctor from './Doctor'

const Routing = () => {
  return (
    <>
    <Routes>
      
      <Route path="/" element={<App />}>
        <Route element={<><Header /><Outlet/><Footer/></>}>
          <Route index element={<Home />}></Route>
          <Route path="finddoctor" element={<Finddoctor />}></Route>
          <Route path="About" element={<About />}></Route>
          <Route path="profile" element={<Myprofile/>}/>
        </Route>
        

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="doctor/edit/:id" element={<EditDoctor />} />
          <Route path="view" element={<ViewDoctor />} />
          <Route path="patient" element={<ViewPatient/>}/>
          <Route path="patient/edit/:id" element={<EditPatient/>}/>
        </Route>

        <Route path="doctor" element={<Doctorpanel />}>
          <Route index element={<DrProfile/>}/>
        </Route>



        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="doctorreg" element={<Doctorreg />} />
      </Route>

      {/* <Route path="*" element={<PageNotFound/>}/> */}
    </Routes>
    
     </>
  );
};

export default Routing;
