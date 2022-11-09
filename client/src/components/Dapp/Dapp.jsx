import { Container, Row, Col } from 'react-bootstrap';
import { useSigner } from 'wagmi';

export function Dapp(props) {
  const { data: signer, isError, isLoading } = useSigner();

  return (
    <Container>
      <h1>Dapp</h1>
      {isLoading && (
        <Row>
          <Col>
            <p>Loading...</p>
          </Col>
        </Row>
      )}
      {isError && (
        <Row>
          <Col>
            <p>Error fetching signer...</p>
          </Col>
        </Row>
      )}
      {!isError && !isLoading && signer && (
        <Row>
          <Col>
            <p>My account!</p>
          </Col>
        </Row>
      )}
    </Container>
  );
}
