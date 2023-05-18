import Main from "../pages/Main";
import MatchTableModeSelect from "../pages/MatchTable/ModeSelect";
import MatchTableCreate from "../pages/MatchTable/Create";

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
];
export default routes;
