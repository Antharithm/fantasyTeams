import { Container, Row, Col } from 'react-bootstrap';

export function Home(props) {
  return (
    <Container>
      <h1>Home</h1>
      <hr />
      <Row>
        <Col>
          <p>C'est ne pas une home page.</p>
        </Col>
      </Row>
    </Container>
  );
}
