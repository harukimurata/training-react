import Main from "../pages/Main";
import MatchTableModeSelect from "../pages/MatchTable/ModeSelect";
import MatchTableCreate from "../pages/MatchTable/Create";
import MatchTableLogin from "../pages/MatchTable/Login";

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
];
export default routes;
