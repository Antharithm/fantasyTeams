import { useState, useContext } from 'react';
// import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSigner, useContract } from 'wagmi';
import { AppContext } from '../../App';
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
      authors: ['0x9E1BB5b7A091b124Ad19E8E72E4b5f12fD2adBd2'],
    },
  },
  {
    cid: 'bafkreiboztgdkawljrhcavkazt5mpfr3ioahod3cbmkz5tzd6r47h6qyei',
    name: 'Jalen Hurts',
    description: "Quarterback for Philadelphia Eagles. He's a 5 star man",
    image:
      'https://ipfs.io/ipfs/bafkreifl62gtvt6pbdlurvlgim5jppnlv3czjnbttbgxs3obxj6qjlky2y?filename=21831_jalen_hurts.png',
    attributes: {
      Position: 'QB',
      PlayerID: '21831',
      authors: ['0x9E1BB5b7A091b124Ad19E8E72E4b5f12fD2adBd2'],
    },
  },
  {
    cid: 'bafkreihcpszctpcikhwlullhy7dmabmjr4s3k6lewskaci7tw7pnhi5ega',
    name: 'Joe Burrow',
    description: 'Quarterback for the Cincinnati Bengals',
    image:
      'https://ipfs.io/ipfs/bafybeifbnz5wfhe5onlmefhucxyxz3ref4kxkab3fxfqrzs3m2ztvp3hlq?filename=21693_joe_burrow.png',
    attributes: {
      Position: 'QB',
      PlayerID: '21693',
      authors: ['0x9E1BB5b7A091b124Ad19E8E72E4b5f12fD2adBd2'],
    },
  },
  {
    cid: 'bafkreihe3pywde7z2okz6umxmdglat7gtosu7areafldc7ujubylfoj5da',
    name: 'Josh Allen',
    description: 'Quarterback for the Buffalo Bills',
    image:
      'https://ipfs.io/ipfs/bafkreigsl6p7age4axzadtege4uooryazz5iy3pvf7gwa2yfs3s2zqz7bi?filename=19801_josh_allen.png',
    attributes: {
      Position: 'QB',
      PlayerID: '19801',
      authors: ['0x9E1BB5b7A091b124Ad19E8E72E4b5f12fD2adBd2'],
    },
  },
  {
    cid: 'bafkreiexotzcpopbdkqo244qmmetzf5vkoj4lnqsrhqsce2k3hqflcblqy',
    name: 'Russell Wilson',
    description: 'Quarterback for the Denver Broncos',
    image:
      'https://ipfs.io/ipfs/bafybeihude7z57i6abtmoaof2tuvlg7krbopxee3ydeqyrfcw3g7ejwbwy?filename=14536_russell_wilson.png',
    attributes: {
      Position: 'QB',
      PlayerID: '14536',
      authors: ['0x9E1BB5b7A091b124Ad19E8E72E4b5f12fD2adBd2'],
    },
  },
  {
    cid: 'bafkreifrxv4djifxrpxcixqq3tub4dl7tcynjtf24blr35fwpofe7vzgay',
    name: 'Justin Herbert',
    description: 'Quarterback for the Los Angeles Chargers',
    image:
      'https://ipfs.io/ipfs/bafkreihslkk6jnuip3heb5tbqerbjxkh435wfohfh26y6g54i27wvdmv4i?filename=21681_justin_herbert.png',
    attributes: {
      Position: 'QB',
      PlayerID: '21681',
      authors: ['0x9E1BB5b7A091b124Ad19E8E72E4b5f12fD2adBd2'],
    },
  },
  {
    cid: 'bafkreiaxhbqshewenjw362juz23qtdm6cudkomrb53kblkgesgkrwj6zua',
    name: 'Kyler Murray',
    description: 'Quarterback for the Arizona Cardinals',
    image:
      'https://ipfs.io/ipfs/bafybeiea6dphyzb7d22boievkexuefxecymdgmclnnv35sdhsjihnqkwei?filename=20889_kyler_murray.png',
    attributes: {
      Position: 'QB',
      PlayerID: '20889',
      authors: ['0x9E1BB5b7A091b124Ad19E8E72E4b5f12fD2adBd2'],
    },
  },
  {
    cid: 'bafkreif42hopdbi42irb3qgk4jies25vipfefbuvlkzze2vwvwluzoedqm',
    name: 'Lamar Jackson',
    description: 'Quarterback for the Baltimore Ravens',
    image:
      'https://ipfs.io/ipfs/bafkreibnbgklsakwxyyqdq62hxkqcidi6fmi4hwwkw5h7grgtrqm3tqude?filename=19781_lamar_jackson.png',
    attributes: {
      Position: 'QB',
      PlayerID: '19781',
      authors: ['0x9E1BB5b7A091b124Ad19E8E72E4b5f12fD2adBd2'],
    },
  },
  {
    cid: 'bafkreifszoduzh4ys3k5n4lvqyhokqdt6azevbfhob63kxspghrwacmgfy',
    name: 'Tom Brady',
    description: 'Quarterback for the Tampa Bay Buccaneers',
    image:
      'https://ipfs.io/ipfs/bafkreibs6brnx4uk3oqdyrzzelbeoxb4iezxcpwo6zmpgqnoehw3xepxjm?filename=4314_tom_brady.png',
    attributes: {
      Position: 'QB',
      PlayerID: '4314',
      authors: ['0x9E1BB5b7A091b124Ad19E8E72E4b5f12fD2adBd2'],
    },
  },
];

export function Dapp() {
  const { network, account } = useContext(AppContext);
  const [refresh, setRefresh] = useState(false);
  const [playerData /*, setPlayerData*/] = useState(data); // undefined
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
      <hr />

      <Balance tkn={tkn} />

      {network.chain.network === 'localhost' && (
        <div>
          <hr />
          <Button
            onClick={(e) => {
              e.preventDefault();
              fetch('http://127.0.0.1:8545/', {
                method: 'POST',
                mode: 'cors',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  id: 0,
                  method: 'hardhat_setBalance',
                  params: [account.address, '0x999999999999999999999999999'],
                }),
              })
                .then(async (res) => {
                  const data = await res.json();
                  console.log(data);
                })
                .catch((e) => console.error(e.toString()));
            }}
          >
            Need Gas?
          </Button>
        </div>
      )}

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
