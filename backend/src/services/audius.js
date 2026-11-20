import axios from "axios";
export const getAudiusUrl = async (app, request = axios.get) => {
    if (app.locals.audiusUrl)
        return app.locals.audiusUrl;
    if (!app.locals.audiusDiscoveryPromise) {
        app.locals.audiusDiscoveryPromise = request("https://api.audius.co", { timeout: 10000 })
            .then((response) => {
            const url = response.data?.data?.[0];
            if (typeof url !== "string" || !/^https:\/\//.test(url)) {
                throw new Error("Audius discovery returned no usable server");
            }
            app.locals.audiusUrl = url;
            return url;
        })
            .finally(() => { app.locals.audiusDiscoveryPromise = null; });
    }
    return app.locals.audiusDiscoveryPromise;
};
