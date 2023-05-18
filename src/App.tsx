import routes from "./routes/routes";
import { useRoutes } from "react-router-dom";
import "bulma/css/bulma.css";

function App() {
  const element = useRoutes(routes);

  return <div>{element}</div>;
}

export default App;
