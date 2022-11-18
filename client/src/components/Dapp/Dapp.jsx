import { useState, useContext } from 'react';
// import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSigner, useContract } from 'wagmi';
import { AppContext } from '../../App';
import { Balance } from './Balance';
import { Collection } from './Collection';
import GetGas from './GetGas';
import { Minter } from './Minter';

import { mockData } from './ipfs';

export function Dapp() {
  const { network } = useContext(AppContext);
  const [refresh, setRefresh] = useState(false);
  const [playerData /*, setPlayerData*/] = useState(mockData);
  // useEffect(() => {setPlayerData(data)}, [playerData]);

  const { data: signerOrProvider, isError, isLoading } = useSigner();

  const NonFungiblePlayers = require(`./data/${network.chain.network}/NonFungiblePlayers.json`);
  const nft = useContract({
    signerOrProvider,
    abi: NonFungiblePlayers.abi,
    address: NonFungiblePlayers.address,
  });

  const FantasyPoints = require(`./data/${network.chain.network}/FantasyPoints.json`);
  const tkn = useContract({
    signerOrProvider,
    abi: FantasyPoints.abi,
    address: FantasyPoints.address,
  });

  if (isError || isLoading || !playerData)
    return (
      <Container>
        <h1>Dapp</h1>
        <hr />
        {(isLoading || !playerData) && (
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
    <Container>
      <h1>Dapp</h1>

      {['hardhat', 'localhost'].includes(network.chain.network) && <GetGas />}

      <hr />
      <Balance tkn={tkn} />
      <hr />
      <Minter
        nft={nft}
        playerData={playerData}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <hr />
      <Collection
        nft={nft}
        playerData={playerData}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </Container>
  );
}
