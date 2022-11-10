import { useState } from 'react';
// import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSigner, useContract } from 'wagmi';
import { Balance } from './Balance';
import { Collection } from './Collection';
import { Minter } from './Minter';

// async function response(cid) {
//   return await fetch(`https://${cid}.ipfs.4everland.io/`, {
//     headers: {
//       method: 'GET',
//       mode: 'cors',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     },
//   });
// }

// async function allRequests(cids) {
//   let data = [];
//   for await (const cid of cids) {
//     await new Promise((r) => setTimeout(r, 1000));
//     try {
//       const obj = await (await response(cid)).json();
//       data.push({ cid, ...obj });
//     } catch (err) {}
//   }
//   return data;
// }

const data = [
  {
    cid: 'bafkreihc5gbqc6bpapp2usnqibrzbyrnz6rk7h3nri6pzpphgo5bqew2fa',
    name: 'Dak Prescott',
    description: 'Quarterback for the Dallas Cowboys',
    image:
      'https://ipfs.io/ipfs/bafkreiaj6rcmrgcxberj5qrvlg2gb74qabbz45lp4k4iubwvlbs7gc7ik4?filename=18055_dak_prescott.png',
    attributes: {
      Position: 'QB',
      PlayerID: '18055',
      authors: ['0xaddress...'],
    },
  },
  {
    cid: 'bafkreiboztgdkawljrhcavkazt5mpfr3ioahod3cbmkz5tzd6r47h6gyei',
    name: '',
    description: '',
    image: '',
    attributes: {
      Position: '',
      PlayerID: '',
      authors: ['0xaddress...'],
    },
  },
  {
    cid: 'bafkreihcpszctpcikhwlullhy7dmabmjr4s3k6lewskaci7tw7pnhi5ega',
    name: '',
    description: '',
    image: '',
    attributes: {
      Position: '',
      PlayerID: '',
      authors: ['0xaddress...'],
    },
  },
  {
    cid: 'bafkreihe3pywde7z2okz6umxmdglat7gtosu7areafldc7ujubylfoj5da',
    name: '',
    description: '',
    image: '',
    attributes: {
      Position: '',
      PlayerID: '',
      authors: ['0xaddress...'],
    },
  },
  {
    cid: 'bafkreifrxv4djifxrpxcixqq3tub4dl7tcynjtf24b1r35fwpofe7vzgay',
    name: '',
    description: '',
    image: '',
    attributes: {
      Position: '',
      PlayerID: '',
      authors: ['0xaddress...'],
    },
  },
  {
    cid: 'bafkreiaxhbqshewenjw362juz23qtdm6cudkomrb53kblkgesgkrwj6zua',
    name: '',
    description: '',
    image: '',
    attributes: {
      Position: '',
      PlayerID: '',
      authors: ['0xaddress...'],
    },
  },
  {
    cid: 'bafkreif42hopdbi42irb3gak4iies25vipfefbuvlkzze2vwvwluzoedam',
    name: '',
    description: '',
    image: '',
    attributes: {
      Position: '',
      PlayerID: '',
      authors: ['0xaddress...'],
    },
  },
  {
    cid: 'bafkreiexotzcpopbdkao244qmmetzf5vkoi4lngsrhasce2k3haflcblgy',
    name: '',
    description: '',
    image: '',
    attributes: {
      Position: '',
      PlayerID: '',
      authors: ['0xaddress...'],
    },
  },
  {
    cid: 'bafkreifszoduzh4ys3k5n41vgyhokqdt6azevbfhob63kxspqhrwacmafy',
    name: '',
    description: '',
    image: '',
    attributes: {
      Position: '',
      PlayerID: '',
      authors: ['0xaddress...'],
    },
  },
];

export function Dapp(props) {
  const { account } = props;
  const [refresh, setRefresh] = useState(false);
  const [playerData /*, setPlayerData*/] = useState(data); // undefined
  // useEffect(() => {setPlayerData(data)}, [playerData]);

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
      <hr />

      <Balance account={account} tkn={tkn} />

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
