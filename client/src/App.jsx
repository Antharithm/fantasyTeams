import { useState } from 'react';
import { useAccount } from 'wagmi';

import { NavigationBar } from './components/NavigationBar';
import { Home } from './components/Home';
import { Dapp } from './components/Dapp/Dapp';
import { About } from './components/About';

function App(props) {
  const [page, setPage] = useState('Home');
  const account = useAccount();

  return (
    <div className="App">
      <NavigationBar name={props.name} page={{ set: setPage, get: page }} />
      {page === 'Home' && <Home />}
      {page === 'Dapp' && <Dapp account={account} />}
      {page === 'About' && <About />}
    </div>
  );
}

export default App;
