import React from "react";
import Bg from "./assets/bg.png";
import Capture from "./Views/capture"

import "./App.css";

function App() {
  return (
    <div className="App">
      <img src={Bg} alt="background" />
      <div className="testArea">
        <div className="content">
          <Capture />
        </div>
      </div>
    </div>
  );
}

export default App;
