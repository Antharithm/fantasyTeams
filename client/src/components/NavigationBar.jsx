import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function NavigationBar(props) {
  const { page, name } = props;
  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand
            href=""
            onClick={(event) => {
              event.preventDefault();
              page.set('Home');
            }}
          >
            {name}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link
                href=""
                onClick={(event) => {
                  event.preventDefault();
                  page.set('Dapp');
                }}
              >
                Dapp
              </Nav.Link>
              <NavDropdown title="Info" id="basic-nav-dropdown">
                <NavDropdown.Item
                  href=""
                  onClick={(event) => {
                    event.preventDefault();
                    page.set('About');
                  }}
                >
                  About
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          <ConnectButton />
        </Container>
      </Navbar>

      <hr />
      <br />
    </div>
  );
}
