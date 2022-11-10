import { useState } from 'react';
import { Row, Col, Card, Container, ListGroup } from 'react-bootstrap';

export function Collectible(props) {
  const { id, uri } = props;
  const title = `NAME`;
  return (
    <Card as={Col} style={{ width: '18rem' }} text="black">
      <Card.Header>#{id}</Card.Header>
      <Card.Img variant="top" />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <ListGroup>
          <ListGroup.Item>ID: {id}</ListGroup.Item>
        </ListGroup>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <small>{uri}</small>
      </Card.Footer>
    </Card>
  );
}

export function Collection(props) {
  const { nft, refresh, setRefresh } = props;

  const [collection, setCollection] = useState(undefined);
  if (collection === undefined || refresh)
    nft
      .myTokens()
      .then(async (res) => {
        let together = [];
        const ids = res.map((entry) => parseInt(entry.toString()));
        const uris = await nft.tokenURIs(ids);
        ids.forEach((id) => together.push({ id, uri: uris[ids.indexOf(id)] }));
        setCollection(together);
        if (refresh) setRefresh(false);
      })
      .catch((e) => {
        console.error(e);
        setCollection([]);
        if (refresh) setRefresh(false);
      });

  return (
    <Container>
      <h3>Collection</h3>
      <Row>
        {collection &&
          collection.map((item) => (
            <Collectible key={item.id} id={item.id} uri={item.uri} />
          ))}
      </Row>
    </Container>
  );
}
