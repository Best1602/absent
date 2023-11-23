import { useState } from "react";

import SignIn from "./page/SignIn";
import { BrowserRouter } from "react-router-dom";
import Absent from "./page/Absent";
import Caledar from "./component/Calendar";
import Narbar from "./component/Narbar";
import SignUp from "./page/SignUp";
import Routes from "./routes/routes";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter basename="/Similan-Absent">
        <Routes />
        {/* <Narbar />
        <Routes>
          <Route>
            <Route path="/" element={<SignIn />} />
            <Route path="/absent" element={<Absent />} />
            <Route path="/sigup" element={<SignUp />} />
          </Route>
        </Routes> */}
      </BrowserRouter>
    </>
  );
}

export default App;
