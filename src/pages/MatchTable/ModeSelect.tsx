import { useNavigate } from "react-router-dom";
import HeaderComponent from "../../components/headerComponent";

const MatchTableModeSelect = () => {
  const navigate = useNavigate();

  const toLink = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <HeaderComponent title="対戦表つくーる"></HeaderComponent>
      <div className="columns is-mobile is-centered mx-2">
        <div className="column is-11 mt-3">
          <div className="card">
            <div className="card-content">
              <h1 className="title pt-3">対戦表つくーる</h1>
              <div className="columns">
                <div className="column is-half is-offset-one-quarter">
                  <button
                    className="button is-fullwidth"
                    onClick={() => toLink("/MatchTable/create")}
                  >
                    作成する
                  </button>
                </div>
              </div>
              <div className="columns">
                <div className="column is-half is-offset-one-quarter">
                  <button
                    className="button is-fullwidth"
                    onClick={() => toLink("/MatchTable/login")}
                  >
                    参加する
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
export default MatchTableModeSelect;
