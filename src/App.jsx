import { useEffect } from "react";
import Register from "./pages/Register";
import { testConnection } from "./services/riderService";

function App() {

  useEffect(() => {
    testConnection();
  }, []);

  return <Register />;
}

export default App;