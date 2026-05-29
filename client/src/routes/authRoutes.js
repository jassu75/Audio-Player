import Auth from "../pages/auth/Auth";
import DirectToAuth from "../pages/helpers/directToAuth/DirectToLogin";

const authRoutes = [
  {
    path: "/account",
    element: <Auth />,
  },
  {
    path: "/redirect",
    element: <DirectToAuth />,
  },
];

export default authRoutes;
