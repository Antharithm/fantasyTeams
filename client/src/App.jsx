import { useState, createContext } from 'react';
import { useAccount, useNetwork, useSigner } from 'wagmi';

import { NavigationBar } from './components/NavigationBar';
import { Home } from './components/Home';
import { Dapp } from './components/Dapp/Dapp';
import { About } from './components/About';

export const AppContext = createContext(null);

function App(props) {
  const [page, setPage] = useState('Home');
  const account = useAccount();
  const network = useNetwork();
  const signer = useSigner();

  return (
    <div className="App">
      <NavigationBar name={props.name} page={{ set: setPage, get: page }} />
      {page === 'Home' && <Home />}
      {page === 'About' && <About />}

      <AppContext.Provider
        value={{ account, network, signerOrProvider: signer.data }}
      >
        {page === 'Dapp' && <Dapp />}
      </AppContext.Provider>
    </div>
  );
}

export default App;
