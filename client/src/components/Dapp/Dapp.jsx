import { Container, Row, Col } from 'react-bootstrap';
import { useSigner, useContract } from 'wagmi';
import { Collection } from './Collection';
import { Minter } from './Minter';

export function Dapp(props) {
  const { account } = props;

  const { data: signerOrProvider, isError, isLoading } = useSigner();
  const { abi, address } = require('./data/NonFungiblePlayers.json');
  const nft = useContract({
    signerOrProvider,
    abi,
    address,
  });

  if (isError || isLoading)
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
      </Container>
    );

  return (
    <div>
      <h1>Dapp</h1>
      <hr />
      <Collection account={account} nft={nft} />
      <hr />
      <Minter account={account} nft={nft} />
    </div>
  );
}
