import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'

const NavbarTop = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()
  console.log('Navbar user: ', user)
  const handleClick = (e) => {
    logout()
  }

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to={'/'}
        >
          <span className="material-symbols-outlined">emoji_transportation</span>
          Vehicle Expresso
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to={'/searchparks'}
            >
              <span className="material-symbols-outlined">Search</span>Search
              Parks
            </Nav.Link>
            <NavDropdown
              title="Services"
              id="basic-nav-dropdown"
            >
              {user && user.id < 100 && (
                <NavDropdown.Item
                  as={Link}
                  to={'/addparkadmin'}
                >
                  <span className="material-symbols-outlined">nature</span>Add Park
                </NavDropdown.Item>
              )}
              {user && user.id < 100 && <NavDropdown.Divider />}
              {user && (
                <NavDropdown.Item
                  as={Link}
                  to={'/addvehicle'}
                >
                  <span className="material-symbols-outlined">add_to_queue</span>Add
                  Vehicle
                </NavDropdown.Item>
              )}
              {user && <NavDropdown.Divider />}

              {user && user.parkAdmin > 0 && (
                <NavDropdown.Item
                  as={Link}
                  to={'/vehicleentryexit'}
                >
                  <span className="material-symbols-outlined">upload</span>Vehicle
                  Entry Exit
                </NavDropdown.Item>
              )}
              {user && user.parkAdmin > 0 && (
                <NavDropdown.Item
                  as={Link}
                  to={'/addrentinfo'}
                >
                  <span className="material-symbols-outlined">
                    security_update_good
                  </span>
                  Add Rent Info
                </NavDropdown.Item>
              )}
              {user && user.parkAdmin > 0 && <NavDropdown.Divider />}
              <NavDropdown.Item
                as={Link}
                to={'/vehiclecare'}
              >
                Vehicle Care
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to={'/pickupvanservice'}
              >
                Pickup Van Service
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to={'/rentingcars'}
              >
                Renting Cars
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to={'/carinsurancerenewal'}
              >
                Car Insurance Renewal
              </NavDropdown.Item>
              {user && <NavDropdown.Divider />}
              {user && (
                <NavDropdown.Item href="#action/3.4">
                  <span className="material-symbols-outlined">mail</span>
                  {user.email}
                </NavDropdown.Item>
              )}
            </NavDropdown>
            {user && <Nav.Link onClick={handleClick}>Logout</Nav.Link>}
            {!user && (
              <Nav.Link
                as={Link}
                to={'/login'}
              >
                Login
              </Nav.Link>
            )}
            {!user && (
              <Nav.Link
                as={Link}
                to={'/signup'}
              >
                Signup
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarTop
