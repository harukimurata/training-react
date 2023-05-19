import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonModal from "../../components/Modal/CommonModal";
import ErrorModal from "../../components/Modal/ErrorModal";
import HeaderComponent from "../../components/headerComponent";
import { getMatchTable, updateMatchTable } from "../../logic/apiRequest";
import {
  type MatchTableGetForm,
  type MatchTableResponse,
} from "../../types/MatchTable";
import { type MatchTableInfoUpdateForm } from "../../types/MatchTableInfo";

const MatchTableMain = () => {
  const navigate = useNavigate();

  //大会情報
  const [matchTableData, setMatchTableData] = useState<MatchTableResponse>();
  const [authPassword, setAuthPassword] = useState<string>("");
  const [loginInfo, setLoginInfo] = useState<MatchTableGetForm>({
    matchId: "",
    password: "",
  });

  //モーダル
  const [isCommonModal, setIsCommonModal] = useState<boolean>(false);
  const [commonModalTitle, setCommonModalTitle] = useState<string>("");
  const [commonModalText, setCommonModalText] = useState<string>("");
  //エラーモーダル
  const [isErrorModal, setIsErrorModal] = useState<boolean>(false);
  const [errorModalText, setErrprModalText] = useState<string>("");
  //その他制御系
  const [isUpdateRequest, setIsUpdateRequest] = useState<boolean>(false);
  const [isAuthPasswordModal, setIsAuthPasswordModal] =
    useState<boolean>(false);
  const [isButtonView, setButtonView] = useState<boolean>(false);

  useEffect(() => {
    const matchTableInfo = localStorage.getItem("matchTableInfo");
    const matchTableLoginInfo = localStorage.getItem("matchTableLoginInfo");
    if (
      matchTableInfo == null ||
      matchTableLoginInfo == null ||
      matchTableInfo === "" ||
      matchTableLoginInfo === ""
    ) {
      setErrprModalText("大会情報が見つかりませんでした。");
      setIsErrorModal(true);
    } else {
      const MatchTableResponseData: MatchTableResponse =
        JSON.parse(matchTableInfo);
      const MatchTableGetFormData: MatchTableGetForm =
        JSON.parse(matchTableLoginInfo);
      setMatchTableData(MatchTableResponseData);
      setLoginInfo(MatchTableGetFormData);
    }
  }, [setMatchTableData, setLoginInfo]);

  /**
   * ローカルデータの更新
   * サーバーと同期
   */
  const localUpdate = async () => {
    try {
      if (!loginInfo) {
        return;
      }
      const result = await getMatchTable(loginInfo);
      setMatchTableData(result);
    } catch (e: any) {
      setErrprModalText(e.response.data.message);
      setIsErrorModal(true);
    }
  };

  /**
   * データ送信時のモーダル表示判定
   */
  const updateModalIsActive = async () => {
    setIsUpdateRequest(true);
    if (!matchTableData) {
      return;
    }

    if (matchTableData.isAuthPassword) {
      setIsAuthPasswordModal(true);
    } else {
      await serverUpdate();
    }
  };

  /**
   * ローカルデータ送信
   */
  const serverUpdate = async () => {
    if (!loginInfo || !matchTableData) {
      return;
    }
    try {
      const reqData: MatchTableInfoUpdateForm = {
        matchId: loginInfo.matchId,
        authPassword: authPassword,
        result: matchTableData.result,
        order: matchTableData.order,
      };
      const result = await updateMatchTable(reqData);
      setCommonModalTitle("");
      setCommonModalText(result.message);
      setIsCommonModal(true);
    } catch (e: any) {
      setErrprModalText(e.response.data.message);
      setIsErrorModal(true);
    }
  };

  /**
   * 勝ち数計算
   */
  const countWinner = (verti: number) => {
    let resultNum = 0;
    if (matchTableData && matchTableData.result[verti]) {
      for (const val of matchTableData.result[verti]) {
        const point = val ? 1 : 0;
        resultNum = resultNum + point;
      }
    }
    return resultNum;
  };

  /**
   * 勝率計算
   */
  const calcWinningPercentage = (verti: number) => {
    if (!matchTableData) {
      return;
    }
    let resultNum = countWinner(verti);
    const winPercentage =
      resultNum / (resultNum + (matchTableData.player.length - 1 - resultNum));
    return (winPercentage * 100).toFixed(1);
  };

  /**
   * 順位計算
   */
  const calcRank = (verti: number) => {
    let rankResultList = [];
    let rankList = [];
    if (!matchTableData) {
      return;
    }

    for (let hori = 0; hori < matchTableData.player.length; hori++) {
      rankResultList.push(countWinner(hori));
    }

    for (let hori = 0; hori < matchTableData.player.length; hori++) {
      rankList.push({ playerNo: hori, result: rankResultList[hori] });
    }

    const sortRankList = rankList.sort((a, b) => {
      return b.result - a.result;
    });

    let rank = 0;
    sortRankList.forEach((list, index) => {
      if (verti === list.playerNo) {
        rank = index + 1;
      }
    });

    return rank;
  };

  /**
   * 勝敗投入
   * @param verti
   * @param hori
   * @param value
   */
  const setResult = (verti: number, hori: number, value: boolean) => {
    if (matchTableData) {
      matchTableData.result[verti].splice(hori, 1, value);
      matchTableData.result[hori].splice(verti, 1, !value);
      setMatchTableData({ ...matchTableData, result: matchTableData.result });
    }
  };

  /**
   * 勝ち負け表示
   * @param value
   */
  const resultConvert = (value: boolean) => {
    return value ? "勝ち" : "負け";
  };

  //ボタン非表示切り替え
  const changeButtonView = (event: any) => {
    setButtonView(!isButtonView);
  };

  /**
   * フォントカラー変更
   * @param value
   */
  const textColor = (value: boolean) => {
    return value ? "has-text-danger" : "has-text-info";
  };

  /**
   * 対戦表生成
   * @param index
   */
  const ballteFlow = (index: number) => {
    if (matchTableData) {
      if (matchTableData.order[index].result === 2) {
        matchTableData.order[index].result = 0;
      } else {
        matchTableData.order[index].result =
          matchTableData.order[index].result + 1;
      }

      setMatchTableData({ ...matchTableData, order: matchTableData.order });
    }
  };

  /**
   * 対戦状況管理
   * @param value
   */
  const battleState = (value: number) => {
    switch (value) {
      case 0:
        return { state: "対戦前", color: "is-light" };
      case 1:
        return { state: "対戦中", color: "is-info" };
      case 2:
        return { state: "終了", color: "is-success" };
      default:
        return { state: "対戦前", color: "is-light" };
    }
  };

  //モーダル表示
  const commonModalComponent = () => {
    if (isCommonModal) {
      return (
        <CommonModal
          title={commonModalTitle}
          text={commonModalText}
          onClick={() => commonModalClose()}
        ></CommonModal>
      );
    }
  };

  //モーダル非表示
  const commonModalClose = () => {
    setIsCommonModal(false);
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
    if (!isUpdateRequest) {
      toLink("/MatchTable/login");
    }
    setIsUpdateRequest(false);
  };

  //認証パスワード要求モーダル
  const authPasswordModal = () => {
    if (isAuthPasswordModal) {
      return (
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-card px-3">
            <header className="modal-card-head">
              <p className="modal-card-title">
                認証パスワードが設定されています。
              </p>
              <button className="delete" aria-label="close"></button>
            </header>
            <section className="modal-card-body">
              <p>認証パスワードを入力してください。</p>
              <input
                className="input"
                type="password"
                value={authPassword}
                onChange={(e) => {
                  setAuthPassword(e.target.value);
                }}
              />
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success">送信</button>
              <button className="button">やめる</button>
            </footer>
          </div>
        </div>
      );
    }
  };

  //ログアウト
  const logout = () => {
    localStorage.setItem("matchTableInfo", "");
    localStorage.setItem("matchTableLoginInfo", "");
    toLink("/MatchTable/login");
  };

  const toLink = (path: string) => {
    navigate(path);
  };

  //メインテーブル
  const renderMainTable = (playerData: string[]) => {
    if (playerData) {
      return (
        <table className="table is-striped is-bordered">
          <thead>
            <tr>
              <th>Player</th>
              {playerData.map((player, index) => (
                <th className="text-nowrap" key={index}>
                  {player}
                </th>
              ))}
              <th>勝ち数</th>
              <th>勝率</th>
              <th>順位</th>
            </tr>
          </thead>
          <tbody>
            {playerData.map((player_verti, verti_index) => (
              <tr key={verti_index}>
                <th className="text-nowrap">{player_verti}</th>
                {playerData.map((player_hori, hori_index) => (
                  <td key={player_hori}>
                    {renderTableData(verti_index, hori_index)}
                  </td>
                ))}
                <td>
                  <p className="table-cell-width-mediun">
                    {countWinner(verti_index)}
                  </p>
                </td>
                <td>
                  <p className="table-cell-width-mediun">
                    {calcWinningPercentage(verti_index)}%
                  </p>
                </td>
                <td>
                  <p className="table-cell-width-mediun">
                    {calcRank(verti_index)}位
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  //テーブル内のセル
  const renderTableData = (verti_index: number, hori_index: number) => {
    if (!matchTableData) {
      return;
    }

    if (verti_index === hori_index) {
      return <div>―</div>;
    } else {
      return (
        <>
          {resultButton(verti_index, hori_index)}
          <p
            className={
              matchTableData.result[verti_index][hori_index]
                ? "has-text-danger"
                : "has-text-info"
            }
          >
            {resultConvert(matchTableData.result[verti_index][hori_index])}
          </p>
        </>
      );
    }
  };

  //勝ち負けボタン
  const resultButton = (verti_index: number, hori_index: number) => {
    if (!isButtonView) {
      return (
        <>
          <div className="columns is-mobile is-centered mb-0">
            <div className="column is-half">
              <button
                className="button is-danger is-small"
                onClick={() => setResult(verti_index, hori_index, true)}
              >
                勝ち
              </button>
            </div>
            <div className="column is-half">
              <button
                className="button is-info is-small"
                onClick={() => setResult(verti_index, hori_index, false)}
              >
                負け
              </button>
            </div>
          </div>
        </>
      );
    }
  };

  //対戦表メインコンポーネント
  const matchTableMainComponent = () => {
    if (matchTableData) {
      return (
        <>
          <h1 className="title pt-3">{matchTableData.title}</h1>
          <div className="columns is-mobile mx-2">
            <div className="column has-text-left">
              <button className="button is-light mr-2" onClick={() => logout()}>
                ログアウト
              </button>
            </div>
            <div className="column has-text-right">
              <button
                className="button is-info mr-2"
                onClick={() => localUpdate()}
              >
                サーバーと同期
              </button>
            </div>
          </div>

          <h2 className="title mb-0">対戦結果</h2>
          <div className="columns is-mobile is-centered mx-2">
            <div className="column is-12 px-0">
              <div className="table-width">
                {renderMainTable(matchTableData.player)}
              </div>
              <div className="has-text-left ml-2">
                <label className="checkbox">
                  <input type="checkbox" onChange={changeButtonView} />
                  ボタン非表示
                </label>
              </div>

              <h2 className="title mt-3 mb-0">対戦カード</h2>
              <p className="has-text-left ml-2">
                全 {matchTableData.order.length}試合
              </p>

              <table className="table is-striped is-bordered">
                <thead>
                  <tr>
                    <th>対戦カード</th>
                    <th>対戦状況</th>
                  </tr>
                </thead>
                <tbody>
                  {matchTableData.order.map((element, index) => (
                    <tr>
                      <th key={index}>{element.card}</th>
                      <td>
                        <button
                          className={`button ${
                            battleState(element.result).color
                          }`}
                          onClick={() => ballteFlow(index)}
                        >
                          {battleState(element.result).state}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div>
      <HeaderComponent title="対戦表つくーる"></HeaderComponent>
      {matchTableMainComponent()}
      <button
        className="button is-primary is-large mb-3"
        onClick={() => updateModalIsActive()}
      >
        変更を送信する
      </button>
      {authPasswordModal()}
      {commonModalComponent()}
      {errorModalComponent()}
    </div>
  );
};
export default MatchTableMain;
