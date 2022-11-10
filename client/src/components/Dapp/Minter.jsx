import { Button, Card, Container } from 'react-bootstrap';
import Slider from 'react-slick';

const playerData = {
  'Dak Prescott': 'bafkreihc5gbqc6bpapp2usnqibrzbyrnz6rk7h3nri6pzpphgo5bqew2fa',
  'Jalen Hurts': 'bafkreiboztgdkawljrhcavkazt5mpfr3ioahod3cbmkz5tzd6r47h6gyei',
  'Joe Burrow': 'bafkreihcpszctpcikhwlullhy7dmabmjr4s3k6lewskaci7tw7pnhi5ega',
  'Josh Allen': 'bafkreihe3pywde7z2okz6umxmdglat7gtosu7areafldc7ujubylfoj5da',
  'Justin Herbet':
    'bafkreifrxv4djifxrpxcixqq3tub4dl7tcynjtf24b1r35fwpofe7vzgay',
  'Kyler Murray': 'bafkreiaxhbqshewenjw362juz23qtdm6cudkomrb53kblkgesgkrwj6zua',
  'Lamar Jackson':
    'bafkreif42hopdbi42irb3gak4iies25vipfefbuvlkzze2vwvwluzoedam',
  'Patrick Mahomes':
    'bafkreiai3ikq5hedihhtqsaytestvkc7ii5osfioxq5mmobu6p6kltokum',
  'Russell Wilson':
    'bafkreiexotzcpopbdkao244qmmetzf5vkoi4lngsrhasce2k3haflcblgy',
  'Tom Brady': 'bafkreifszoduzh4ys3k5n41vgyhokqdt6azevbfhob63kxspqhrwacmafy',
};

const playerNames = Object.keys(playerData);

function Mintable(props) {
  const { name, uri, nft, refresh, setRefresh } = props;
  return (
    <Card style={{ width: '18rem' }} text="black">
      <Card.Img variant="top" />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{uri}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Button
          onClick={(event) => {
            event.preventDefault();
            if (refresh) return;
            nft
              .mint(uri)
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
  );
}

export function Minter(props) {
  const { nft, refresh, setRefresh } = props;

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
        {playerNames.map((name) => (
          <Mintable
            key={name}
            name={name}
            nft={nft}
            uri={playerData[name]}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        ))}
      </Slider>
    </Container>
  );
}
