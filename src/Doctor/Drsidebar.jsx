import React from 'react'
import { Nav, NavLink, Offcanvas } from 'react-bootstrap'
import { FaHome } from 'react-icons/fa'

const Drsidebar = ({show,setShow}) => {
      const links =  [
        {url:'/doctor' ,text:'Dashboard' , icon:<FaHome/>},
        // {url:'/doctor/patient' ,text:'View Patients' , icon:<FaUser/>},
        // {url:'/admin/view' ,text:'View Doctors' , icon:<FaUserMd/>},
        // {url:'/admin/edit' ,text:'Edit Doctor' , icon:<FaPenFancy/>},
        // {url:'/admin/users' ,text:'Manage Orders' , icon:<FaThList/>},
        // {url:'/admin/orders' ,text:'Manage Users' , icon:<FaUser/>},
      ]
  return (
    <>
        <div className="d-none d-md-flex flex-column text-white p-3 " 
            style={{ width: "250px" , backgroundColor:'darkblue' }}>
            <h4 className="text-center text-white">Doctor Panel</h4><hr style={{color:"white"}}/>
            <Nav className="flex-column">
                {links.map((link,index)=>
                <Nav.Link as={NavLink} key={index} to={link.url} className="text-white mb-4">
                    <span className='me-1'> {link.icon}</span> {link.text}
                </Nav.Link>
                )}
            </Nav>
        </div>

      <Offcanvas show={show} onHide={()=>setShow(false)} className="bg-dark text-white">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Doctor Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
          {links.map((link,index)=>
             <Nav.Link as={NavLink} key={index} to={link.url} className="text-white mb-4">
             <span className='me-2'> {link.icon}</span> {link.text}
           </Nav.Link>
          )} </Nav>
        </Offcanvas.Body>
        </Offcanvas>
    </>
  )
}

export default Drsidebar
