import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { type MatchTableGetForm } from "../../types/MatchTable";
import { getMatchTable } from "../../logic/apiRequest";
import ErrorModal from "../../components/Modal/ErrorModal";

const MatchTableLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<MatchTableGetForm>({
    matchId: "",
    password: "",
  });

  //入力判定
  const [isMatchIdEmpty, setIsMatchIdEmpty] = useState<Boolean>(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<Boolean>(false);
  //モーダル
  const [isErrorModal, setIsErrorModal] = useState<Boolean>(false);
  const [errorModalText, setErrprModalText] = useState<string>("");

  //入力データの確認
  const formDataConfirm = () => {
    if (formData.matchId === "" || formData.matchId == null) {
      setIsMatchIdEmpty(true);
      return;
    } else {
      setIsMatchIdEmpty(false);
    }

    if (formData.password === "" || formData.password == null) {
      setIsPasswordEmpty(true);
      return;
    } else {
      setIsPasswordEmpty(false);
    }

    login();
  };

  //ログイン処理
  const login = async () => {
    console.log(formData);
    try {
      const result = await getMatchTable(formData);
      if (result) {
        localStorage.setItem("matchTableInfo", JSON.stringify(result));
        localStorage.setItem("matchTableLoginInfo", JSON.stringify(formData));
        toLink("/MatchTable");
      }
    } catch (e: any) {
      setErrprModalText(e.response.data.message);

      setIsErrorModal(true);
    }
  };

  //大会ID記入漏れエラーメッセージ
  const matchIdEmptyMessage = () => {
    if (isMatchIdEmpty) {
      return (
        <p className="help has-text-left is-danger">
          大会IDが記入されていません
        </p>
      );
    }
  };

  //大会パスワード記入漏れエラーメッセージ
  const passwordEmptyMessage = () => {
    if (isPasswordEmpty) {
      return (
        <p className="help has-text-left is-danger">
          大会パスワードが記入されていません
        </p>
      );
    }
  };

  //エラーモーダル表示
  const errorModalComponent = () => {
    if (isErrorModal) {
      return (
        <ErrorModal
          text={errorModalText}
          onClick={() => errorModalClose()}
        ></ErrorModal>
      );
    }
  };

  //エラーモーダル非表示
  const errorModalClose = () => {
    setIsErrorModal(false);
  };

  const toLink = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <div className="columns is-mobile is-centered mx-2">
        <div className="column is-11 mt-3">
          <div className="card">
            <div className="card-content">
              <h1 className="title pt-3">対戦表つくーる</h1>
              <h2 className="title">ログイン</h2>

              <div className="field">
                <label className="label has-text-left">大会ID</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={formData.matchId}
                    onChange={(e) => {
                      setFormData({ ...formData, matchId: e.target.value });
                    }}
                  />
                </div>
                {matchIdEmptyMessage()}
              </div>

              <div className="field">
                <label className="label has-text-left">大会パスワード</label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                  />
                </div>
                {passwordEmptyMessage()}
              </div>

              <div className="field is-grouped mt-6">
                <div className="control">
                  <button className="button is-link" onClick={formDataConfirm}>
                    ログイン
                  </button>
                </div>
                <div className="control">
                  <button
                    className="button is-link is-light"
                    onClick={() => toLink("/MatchTable/mode")}
                  >
                    戻る
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {errorModalComponent()}
    </>
  );
};
export default MatchTableLogin;
