import UserAuthentication from "../SignUpAndLogin/UserAuthentication";
import DirectToLogin from "../SignUpAndLogin/DirectToLogin";

const authRoutes = [
  {
    path: "/account",
    element: <UserAuthentication />,
  },
  {
    path: "/redirect",
    element: <DirectToLogin />,
  },
];

export default authRoutes;
