import { Link } from "react-router-dom";
const HeaderComponent = (props: any) => {
  const subTitle = (value: string | undefined) => {
    return value ? `/ ${value}` : "";
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <h1 className="navbar-item">
          <Link to="/">aideatool</Link>
        </h1>
        <span className="navbar-item is-size-7 px-0">
          {subTitle(props.title)}
        </span>
      </div>
    </nav>
  );
};

export default HeaderComponent;
