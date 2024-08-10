import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonModal from "../../components/Modal/CommonModal";
import ErrorModal from "../../components/Modal/ErrorModal";
import HeaderComponent from "../../components/headerComponent";
import { getMatchTable, updateMatchTable } from "../../logic/apiRequest";
import { type MatchTableUpdateRequest } from "../../types/MatchTable";
import {
  type MatchTableData,
  type MathTableGetRequest,
} from "../../types/MatchTable";
import { type MatchTablePlayerEntity } from "../../types/entity/matchTablePlayer";
import { type MatchTableOrderEntity } from "../../types/entity/matchTableOrder";
import { type MatchTableResultEntity } from "../../types/entity/matchTableResult";

const MatchTableMain = () => {
  const navigate = useNavigate();

  //大会情報
  const [title, setTitle] = useState<string>();
  const [matchTableData, setMatchTableData] = useState<MatchTableData>();
  const [playerList, setPlayerLIst] = useState<MatchTablePlayerEntity[]>([]);
  const [resultList, setResultList] = useState<MatchTableResultEntity[]>([]);
  const [orderList, setOrderList] = useState<MatchTableOrderEntity[]>([]);
  const [authPassword, setAuthPassword] = useState<string>("");

  const [loginInfo, setLoginInfo] = useState<MathTableGetRequest>();

  //モーダル
  const [isCommonModal, setIsCommonModal] = useState<boolean>(false);
  const [commonModalTitle, setCommonModalTitle] = useState<string>("");
  const [commonModalText, setCommonModalText] = useState<string>("");
  //エラーモーダル
  const [isErrorModal, setIsErrorModal] = useState<boolean>(false);
  const [errorModalText, setErrorModalText] = useState<string>("");
  //その他制御系
  const [isUpdateRequest, setIsUpdateRequest] = useState<boolean>(false);
  const [isAuthPasswordModal, setIsAuthPasswordModal] =
    useState<boolean>(false);
  const [isButtonView, setButtonView] = useState<boolean>(false);

  useEffect(() => {
    const localStorageMatchTableData = localStorage.getItem("matchTableData");
    const localStorageLoginInfo = localStorage.getItem("loginInfo");
    console.log("useEffect");
    if (localStorageMatchTableData == null || localStorageLoginInfo == null) {
      setErrorModalText("大会情報が見つかりませんでした。");
      setIsErrorModal(true);
    } else {
      const matchTableData: MatchTableData = JSON.parse(
        localStorageMatchTableData
      );
      setMatchTableData(matchTableData);
      setTitle(matchTableData.matchTable.title);
      setPlayerLIst(matchTableData.matchTablePlayer);
      setResultList(matchTableData.matchTableResult);
      setOrderList(matchTableData.matchTableOrder);

      const loginInfo: MathTableGetRequest = JSON.parse(localStorageLoginInfo);
      setLoginInfo(loginInfo);
    }
  }, [setTitle, setPlayerLIst, setResultList, setOrderList, setLoginInfo]);

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
      setResultList(result.matchTableResult);
      setOrderList(result.matchTableOrder);
    } catch (e: any) {
      setErrorModalText(e.response.data.message);
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

    if (matchTableData.matchTable.auth_password) {
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
      const reqData: MatchTableUpdateRequest = {
        match_id: loginInfo.match_id,
        auth_password: authPassword,
        matchTableResult: resultList,
        matchTableOrder: orderList,
      };
      const result = await updateMatchTable(reqData);
      setCommonModalTitle("");
      setCommonModalText(result.message);
      setIsCommonModal(true);
    } catch (e: any) {
      setErrorModalText(e.response.data.message);
      setIsErrorModal(true);
    }
  };

  /**
   * 勝ち数計算
   */
  const countWinner = (playerA_id: number) => {
    let resultNum = 0;
    for (const val of resultList) {
      if (val.playerA_id == playerA_id) {
        resultNum = resultNum + val.result;
      }
    }
    return resultNum;
  };

  /**
   * 勝率計算
   */
  const calcWinningPercentage = (playerA_id: number) => {
    let resultNum = 0;
    for (const val of resultList) {
      if (val.playerA_id == playerA_id) {
        resultNum = resultNum + val.result;
      }
    }
    const winPercentage =
      resultNum / (resultNum + (playerList.length - 1 - resultNum));
    return (winPercentage * 100).toFixed(1);
  };

  /**
   * 順位計算
   */
  const calcRank = (playerA_id: number) => {
    let rankList = [];

    for (const player of playerList) {
      rankList.push({ player_id: player.id, winCount: countWinner(player.id) });
    }

    const sortRankList = rankList.sort((a, b) => {
      return b.winCount - a.winCount;
    });

    let rank = 0;
    sortRankList.forEach((list, index) => {
      if (playerA_id == list.player_id) {
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
  const setResult = (playerA_id: number, playerB_id: number, value: number) => {
    const newResultList = [...resultList];
    newResultList.forEach((result) => {
      if (result.playerA_id == playerA_id && result.playerB_id == playerB_id) {
        result.result = value == 1 ? 1 : 0;
      }

      if (result.playerB_id == playerA_id && result.playerA_id == playerB_id) {
        result.result = value !== 1 ? 1 : 0;
      }
    });

    setResultList(newResultList);
  };

  /**
   * 勝ち負け表示
   * @param value
   */
  const resultConvert = (playerA_id: number, playerB_id: number) => {
    const result = resultList.find((value) => {
      return value.playerA_id == playerA_id && value.playerB_id == playerB_id;
    });
    return result?.result == 1 ? "勝ち" : "負け";
  };

  /**
   * フォントカラー変更
   * @param value
   */
  const textColor = (playerA_id: number, playerB_id: number) => {
    const result = resultList.find((value) => {
      return value.playerA_id == playerA_id && value.playerB_id == playerB_id;
    });
    return result?.result == 1 ? "has-text-danger" : "has-text-info";
  };

  //ボタン非表示切り替え
  const changeButtonView = (event: any) => {
    setButtonView(!isButtonView);
  };

  /**
   * プレイヤー名表示
   * @param index
   */
  const findPlayerName = (index: number) => {
    const player = playerList.find((value) => {
      return value.id == index;
    });

    return player?.name;
  };

  /**
   * 対戦状況更新
   * @param index
   */
  const battleFlow = (index: number) => {
    setOrderList((prevValue) => {
      const newOrderList = [...prevValue];
      if (newOrderList[index].status == 2) {
        newOrderList[index].status = 0;
      } else {
        newOrderList[index].status = newOrderList[index].status + 1;
      }
      return newOrderList;
    });
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
  const renderMainTable = (playerList: MatchTablePlayerEntity[]) => {
    if (playerList) {
      return (
        <table className="table is-striped is-bordered">
          <thead>
            <tr>
              <th>Player</th>
              {playerList.map((player) => (
                <th className="text-nowrap" key={player.id}>
                  {player.name}
                </th>
              ))}
              <th>勝ち数</th>
              <th>勝率</th>
              <th>順位</th>
            </tr>
          </thead>
          <tbody>
            {playerList.map((player_vertical, vertical_index) => (
              <tr key={vertical_index}>
                <th className="text-nowrap">{player_vertical.name}</th>
                {playerList.map((player_horizontal, horizontal_index) => (
                  <td key={horizontal_index}>
                    {renderTableData(
                      vertical_index,
                      horizontal_index,
                      player_vertical,
                      player_horizontal
                    )}
                  </td>
                ))}
                <td>
                  <p className="table-cell-width-mediun">
                    {countWinner(player_vertical.id)}
                  </p>
                </td>
                <td>
                  <p className="table-cell-width-mediun">
                    {calcWinningPercentage(player_vertical.id)}%
                  </p>
                </td>
                <td>
                  <p className="table-cell-width-mediun">
                    {calcRank(player_vertical.id)}位
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
  const renderTableData = (
    vertical_index: number,
    horizontal_index: number,
    player_vertical: MatchTablePlayerEntity,
    player_horizontal: MatchTablePlayerEntity
  ) => {
    if (!matchTableData) {
      return;
    }

    if (vertical_index == horizontal_index) {
      return <div>―</div>;
    } else {
      return (
        <>
          {resultButton(player_vertical.id, player_horizontal.id)}
          <p className={textColor(player_vertical.id, player_horizontal.id)}>
            {resultConvert(player_vertical.id, player_horizontal.id)}
          </p>
        </>
      );
    }
  };

  //勝ち負けボタン
  const resultButton = (playerA_id: number, playerB_id: number) => {
    if (!isButtonView) {
      return (
        <>
          <div className="columns is-mobile is-centered mb-0">
            <div className="column is-half">
              <button
                className="button is-danger is-small"
                onClick={() => setResult(playerA_id, playerB_id, 1)}
              >
                勝ち
              </button>
            </div>
            <div className="column is-half">
              <button
                className="button is-info is-small"
                onClick={() => setResult(playerA_id, playerB_id, 0)}
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
          <h1 className="title pt-3">{title}</h1>
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
              <div className="table-width">{renderMainTable(playerList)}</div>
              <div className="has-text-left ml-2">
                <label className="checkbox">
                  <input type="checkbox" onChange={changeButtonView} />
                  ボタン非表示
                </label>
              </div>

              <h2 className="title mt-3 mb-0">対戦カード</h2>
              <p className="has-text-left ml-2">全 {orderList.length}試合</p>

              <table className="table is-striped is-bordered">
                <thead>
                  <tr>
                    <th>対戦カード</th>
                    <th>対戦状況</th>
                  </tr>
                </thead>
                <tbody>
                  {orderList.map((order, index) => (
                    <tr key={index}>
                      <th>
                        {findPlayerName(order.playerA_id)} vs{" "}
                        {findPlayerName(order.playerB_id)}
                      </th>
                      <td>
                        <button
                          className={`button ${
                            battleState(order.status).color
                          }`}
                          onClick={() => battleFlow(index)}
                        >
                          {battleState(order.status).state}
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
