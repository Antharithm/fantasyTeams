import { useState } from 'react';
import { Row, Col, Card, Container, ListGroup } from 'react-bootstrap';

export function Collectible(props) {
  const { data } = props;
  const { id, name, image, description, attributes } = data;

  return (
    <Card
      as={Col}
      style={{ width: '18rem' }}
      text="black"
      xs={12}
      sm={6}
      md={4}
      lg={3}
      xl={2}
      xxl={1}
    >
      <Card.Header>
        <small>#{id}</small>
      </Card.Header>
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <ListGroup>
          {Object.keys(attributes)
            .filter((k) => k !== 'authors')
            .map((k) => (
              <ListGroup.Item key={`${k}-${id}`}>
                {k}: {attributes[k]}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Card.Body>
      <Card.Footer></Card.Footer>
    </Card>
  );
}

export function Collection(props) {
  const { nft, refresh, setRefresh, playerData } = props;

  const [collection, setCollection] = useState(undefined);
  if (collection === undefined || refresh)
    nft
      .myTokens()
      .then(async (res) => {
        let together = [];
        const ids = res.map((entry) => parseInt(entry.toString()));
        const uris = await nft.tokenURIs(ids);
        ids.forEach((id) => {
          let data;
          const cid = uris[ids.indexOf(id)];
          playerData.forEach((player) => {
            if (player.cid === cid) data = player;
          });
          together.push({ id, cid, ...data });
        });
        setCollection(together);
        if (refresh) setRefresh(false);
      })
      .catch((e) => {
        console.error(e);
        setCollection([]);
        if (refresh) setRefresh(false);
      });

  return (
    <Container fluid>
      <h3>Collection</h3>
      <Row>
        {collection &&
          collection.map((data) => <Collectible key={data.id} data={data} />)}
      </Row>
    </Container>
  );
}
