import { Container, Row, Col } from 'react-bootstrap';
import { useSigner, useContract } from 'wagmi';
import { Balance } from './Balance';
import { Collection } from './Collection';
import { Minter } from './Minter';

export function Dapp(props) {
  const { account } = props;

  const { data: signerOrProvider, isError, isLoading } = useSigner();

  const NonFungiblePlayers = require('./data/NonFungiblePlayers.json');
  const nft = useContract({
    signerOrProvider,
    abi: NonFungiblePlayers.abi,
    address: NonFungiblePlayers.address,
  });

  const FantasyPoints = require('./data/FantasyPoints.json');
  const tkn = useContract({
    signerOrProvider,
    abi: FantasyPoints.abi,
    address: FantasyPoints.address,
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
      <Balance account={account} tkn={tkn} />
      <hr />
      <Collection account={account} nft={nft} />
      <hr />
      <Minter account={account} nft={nft} />
    </div>
  );
}
