import "./App.css";

import {useBlockNumber} from 'wagmi'

function App() {

  const blockData = useBlockNumber();

  return (
    <div className="App">
      <header className="App-header">
        {blockData.data}
        Carbonizer
      </header>
    </div>
  );
}

export default App;
