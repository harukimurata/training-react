import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { type MatchTableCreateForm } from "../../types/MatchTable";
import { createMatchTable } from "../../logic/apiRequest";

const MatchTableCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<MatchTableCreateForm>({
    title: "",
    matchId: "",
    password: "",
    player: ["palyerA", "palyerB"],
    authPassword: null,
  });

  //入力確認切り替えフラグ
  const [isConfirm, setIsConfirm] = useState<Boolean>(false);
  //入力判定
  const [isTitleEmpty, setIsTitleEmpty] = useState<Boolean>(false);
  const [isMatchIdEmpty, setIsMatchIdEmpty] = useState<Boolean>(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<Boolean>(false);

  //配列の動的更新処理
  const playerInput = (index: number, value: string) => {
    const newPlayerList = formData.player;
    newPlayerList[index] = value;
    setFormData({ ...formData, player: newPlayerList });
  };

  //プレイヤーの追加
  const playerAdd = () => {
    const newPlayerList = formData.player;
    newPlayerList.push("player" + (newPlayerList.length + 1));
    setFormData({ ...formData, player: newPlayerList });
  };

  //プレイヤーの削除
  const playerDelete = () => {
    if (formData.player.length <= 2) {
      return;
    }
    const newPlayerList = formData.player;
    newPlayerList.pop();
    setFormData({ ...formData, player: newPlayerList });
  };

  const create = () => {
    console.log(formData);
  };

  //入力データの確認
  const formDataConfirm = () => {
    if (formData.title === "" || formData.title == null) {
      setIsTitleEmpty(true);
      return;
    } else {
      setIsTitleEmpty(false);
    }

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

    setIsConfirm(true);
    create();
  };

  //エラーメッセージ処理
  const titleEmptyMessage = () => {
    if (isTitleEmpty) {
      return (
        <p className="help has-text-left is-danger">
          大会名が記入されていません
        </p>
      );
    }
  };

  const MatchIdEmptyMessage = () => {
    if (isMatchIdEmpty) {
      return (
        <p className="help has-text-left is-danger">
          大会IDが記入されていません
        </p>
      );
    }
  };

  const PasswordEmptyMessage = () => {
    if (isPasswordEmpty) {
      return (
        <p className="help has-text-left is-danger">
          大会パスワードが記入されていません
        </p>
      );
    }
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
              <h1 className="title pt-3">対戦表作成画面</h1>
              <div className="field">
                <label className="label has-text-left">大会名</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                    }}
                  />
                </div>
                {titleEmptyMessage()}
              </div>

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
                {MatchIdEmptyMessage()}
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
                {PasswordEmptyMessage()}
              </div>

              <div className="field">
                <label className="label has-text-left">
                  編集権限パスワード<span className="tag is-info"> 任意</span>
                </label>
                <p className="has-text-left">編集権限パスワードは任意です。</p>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    value={formData.authPassword ?? ""}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        authPassword: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>

              <label className="label has-text-left">参加プレイヤー</label>

              {formData.player.map((element, index) => (
                <div className="field mx-2" key={index}>
                  <label className="label has-text-left">
                    プレイヤー {index + 1}
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={element}
                      onChange={(e) => {
                        playerInput(index, e.target.value);
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="field is-grouped mt-2 mx-2">
                <p className="control">
                  <button className="button is-link mr-2" onClick={playerAdd}>
                    追加
                  </button>
                  <button className="button is-danger" onClick={playerDelete}>
                    削除
                  </button>
                </p>
              </div>

              <div className="field is-grouped mt-6">
                <div className="control">
                  <button className="button is-link" onClick={formDataConfirm}>
                    確認する
                  </button>
                </div>
                <div className="control">
                  <button
                    className="button is-link is-light"
                    onClick={() => toLink("/MatchTable/mode")}
                  >
                    やめる
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
export default MatchTableCreate;
