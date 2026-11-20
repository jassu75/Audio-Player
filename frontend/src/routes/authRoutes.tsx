import Auth from "../pages/auth/Auth";
import DirectToAuth from "../pages/helpers/direct-to-auth/DirectToAuth";
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
