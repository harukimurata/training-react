const ErrorModal = (props: any) => {
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card px-3">
        <header className="modal-card-head">
          <p className="modal-card-title">エラーが発生しました。</p>
          <button
            className="delete"
            aria-label="close"
            onClick={props.onClick}
          ></button>
        </header>
        <section className="modal-card-body">{props.text}</section>
        <footer className="modal-card-foot">
          <button className="button" onClick={props.onClick}>
            とじる
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ErrorModal;
