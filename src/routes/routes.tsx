import Main from "../pages/Main";
import MatchTableModeSelect from "../pages/MatchTable/ModeSelect";
import MatchTableCreate from "../pages/MatchTable/Create";
import MatchTableLogin from "../pages/MatchTable/Login";
import MatchTableMain from "../pages/MatchTable/Main";

const routes = [
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/MatchTable/mode",
    element: <MatchTableModeSelect />,
  },
  {
    path: "/MatchTable/create",
    element: <MatchTableCreate />,
  },
  {
    path: "/MatchTable/login",
    element: <MatchTableLogin />,
  },
  {
    path: "/MatchTable",
    element: <MatchTableMain />,
  },
];
export default routes;
