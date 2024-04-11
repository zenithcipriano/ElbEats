import React  from 'react';
import Main from './Main.js';
import { BrowserRouter} from 'react-router-dom';  

function App() {
  
  return (
    <BrowserRouter>
      <Main/>
    </BrowserRouter>
  );
}

export default App;