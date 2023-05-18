const CreateConfirm = (props: any) => {
  const passwordCover = (value: string | undefined | null) => {
    if (!value) {
      return "設定なし";
    }
    let password = "";
    for (let i = 0; i < value.length; i++) {
      password = password + "*";
    }
    return password;
  };

  return (
    <div className="card-content">
      <h1 className="title pt-3">対戦表作成確認</h1>
      <div className="field">
        <label className="label has-text-left">大会名</label>
        <p className="has-text-left">{props.inputData.title}</p>
      </div>

      <div className="field">
        <label className="label has-text-left">大会ID</label>
        <p className="has-text-left">{props.inputData.matchId}</p>
      </div>

      <div className="field">
        <label className="label has-text-left">大会パスワード</label>
        <p className="has-text-left">
          {passwordCover(props.inputData.password)}
        </p>
      </div>

      <div className="field">
        <label className="label has-text-left">
          編集権限パスワード<span className="tag is-info"> 任意</span>
        </label>
        <p className="has-text-left">
          {passwordCover(props.inputData.authPassword)}
        </p>
      </div>

      <label className="label has-text-left">参加プレイヤー</label>

      {props.playerList.map((element: string, index: number) => (
        <div className="field mx-2" key={index}>
          <label className="label has-text-left">プレイヤー {index + 1}</label>
          <p className="has-text-left">{element}</p>
        </div>
      ))}

      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link" onClick={props.onSubmit}>
            作成する
          </button>
        </div>
        <div className="control">
          <button className="button is-link is-light" onClick={props.onBack}>
            戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateConfirm;
