import { Button, Card, Container, ListGroup } from 'react-bootstrap';
import Slider from 'react-slick';

export function Minter(props) {
  const { nft, refresh, setRefresh, playerData } = props;

  return (
    <Container>
      <h3>Minter</h3>
      <Slider
        dots
        infinite
        slidesToShow={3}
        slidesToScroll={2}
        autoplay
        speed={100}
        autoplaySpeed={5000}
        cssEase="linear"
      >
        {playerData.map((player) => (
          <Card key={player.cid} style={{ width: '18rem' }} text="black">
            <Card.Header />
            <Card.Img variant="top" src={player.image} />
            <Card.Body>
              <Card.Title>{player.name}</Card.Title>
              <Card.Text>{player.description}</Card.Text>
              <ListGroup>
                {Object.keys(player.attributes)
                  .filter((k) => k !== 'authors')
                  .map((k) => (
                    <ListGroup.Item key={`${k}-${player.name}`}>
                      {k}: {player.attributes[k]}
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  if (refresh) return;
                  nft
                    .mint(player.cid)
                    .then(() => {
                      setRefresh(true);
                    })
                    .catch((error) => console.error(error));
                }}
              >
                Mint
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </Slider>
    </Container>
  );
}
