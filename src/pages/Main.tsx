import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  const toLink = (path: string) => {
    navigate(path);
  };
  return (
    <>
      <div className="columns is-mobile is-centered mx-2">
        <div className="column is-11 mt-3">
          <div className="card">
            <div className="card-content">
              <h1 className="title pt-3">aideaTool</h1>
              <div className="columns">
                <div className="column is-half is-offset-one-quarter">
                  <button
                    className="button is-fullwidth"
                    onClick={() => toLink("/MatchTable/mode")}
                  >
                    対戦表つくーる
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Main;
