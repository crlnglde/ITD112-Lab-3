import React from "react";

import Header from "../src/components/header";
import Footer from "../src/components/footer";
import Chh from "../src/components/visualization";

import Dashboard from "../src/components/dash";

function App() {
  return (
    <div className="App">
      <Header />
      <Dashboard/>

      <Chh/>

      <Footer />
    </div>
  );
}

export default App;
