import { useState } from "react";
import "./App.css";

function App() {
  const [number, setNumber] = useState(1);

  function clickHandler() {
    setNumber(number + 1);
    console.log(number);
    setNumber(number + 1);
    console.log(number);
    setNumber(number + 1);
    console.log(number);
  }

  // console.log(number);

  return <button onClick={clickHandler}> {number} </button>;
}

export default App;
