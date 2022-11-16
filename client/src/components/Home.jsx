import { Container, Row, Col } from 'react-bootstrap';

export function Home(props) {
  return (
    <Container>
      <h1>Welcome to Fantasy Teams!</h1>
      <hr />
      <Row>
        <Col>
          <p>Web3 Fantasy Football! This is the central place to mint and stake your NFL players to earn points tokens. Connect your wallet to begin!!</p>
        </Col>
      </Row>
    </Container>
  );
}
