import "bulma/css/bulma.css";
import { useState, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import "./assets/MatchTable.css";
import "./assets/aideatool.css";
import routes from "./routes/routes";

function App() {
  const element = useRoutes(routes);

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  useEffect(() => {
    const onResize = () => {
      setWindowDimensions(getWindowDimensions());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  //画面の横幅監視
  const watchIsPc = () => {
    return windowDimensions.width >= 1024;
  };

  return (
    <div className="has-background-grey-light main-height">
      <div className={`is-main-center ${watchIsPc() ? "pc-window" : ""}`}>
        {element}
      </div>
    </div>
  );
}

export default App;
