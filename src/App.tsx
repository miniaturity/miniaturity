import './App.css';
import Squares from './components/Squares';
import Main from './components/routes/Main';
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <>
      <Squares 
        speed={0.5} 
        squareSize={40}
        direction='diagonal' 
        borderColor='#2e2323'
        hoverFillColor='#2b2222ff'
      />
      <BrowserRouter>
        <Routes>
          <Route index element={<Main />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
