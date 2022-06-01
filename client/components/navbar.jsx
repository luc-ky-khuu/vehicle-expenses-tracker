import React from 'react';
import { Container, Offcanvas, Navbar, Nav } from 'react-bootstrap';
class Navigation extends React.Component {

  render() {
    let title = 'My Garage';
    if (this.props.route === 'vehicle-records') {
      title = 'Vehicle Records';
    }
    let menuItem = 'Sign-In';
    if (this.props.user) {
      menuItem = 'garage';
    }
    return (
      <Navbar className='bg-component-blue navbar-dark sticky-top py-0' expand={'lg'} collapseOnSelect='true'>
        <Container className='justify-content-start'>
          <Navbar.Brand className='work-sans d-none d-lg-block fs-1'>Vehicle Expenses Tracker</Navbar.Brand>
          <Navbar.Toggle aria-controls='menu' />
          <Navbar.Offcanvas
            id='menu'
            aria-labelledby='menuList'
            placement='start'
            className='h-100'
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className='work-sans' id='menuList'>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className='flex-grow-1 pe-3'>
                <Nav.Link className='open-sans text-reset text-capitalize text-decoration-none border-bottom w-50' href={`#${menuItem}`}>{menuItem}</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          <Navbar.Brand className='work-sans d-lg-none ms-3 fs-1'>{title}</Navbar.Brand>
        </Container>
      </Navbar>
    );
  }
}
export default Navigation;
