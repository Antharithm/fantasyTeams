import { useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

export function Collection(props) {
  const { account, nft } = props;

  const [collection, setCollection] = useState(undefined);
  if (collection === undefined)
    nft
      .myTokens()
      .then((res) => {
        setCollection(res.map((entry) => parseInt(entry.toString())));
      })
      .catch((e) => {
        console.error(e);
        setCollection([]);
      });

  return (
    <Container>
      <h3>Collection</h3>
      <Row>
        <Col></Col>
      </Row>
    </Container>
  );
}
