import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="*"
          element={
            <>
              <div className="text-center flex justify-center align-center">
                Not found
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
