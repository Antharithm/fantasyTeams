import { useContext, useState } from 'react';
import { Container, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { AppContext } from '../../App';

export function Balance(props) {
  const { account } = useContext(AppContext);
  const { tkn } = props;
  const [fpBalance, setFpBalance] = useState(undefined);

  if (fpBalance === undefined)
    tkn
      .balanceOf(account.address)
      .then((response) => {
        setFpBalance((parseInt(response.toString()) / 10 ** 18).toString());
      })
      .catch((error) => setFpBalance(error.toString()));

  return (
    <Container>
      <h3>Balance</h3>
      <Row>
        <Col>
          <InputGroup>
            <InputGroup.Text>Fantasy Points</InputGroup.Text>
            <InputGroup.Text>{fpBalance}</InputGroup.Text>
            <Button
              onClick={(event) => {
                event.preventDefault();
                tkn
                  .balanceOf(account.address)
                  .then((response) => {
                    setFpBalance(
                      (parseInt(response.toString()) / 10 ** 18).toString()
                    );
                  })
                  .catch((error) => setFpBalance(error.toString()));
              }}
            >
              Refresh
            </Button>
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );
}
