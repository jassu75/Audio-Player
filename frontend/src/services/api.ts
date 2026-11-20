import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import type { ApiEndpoints } from "./types/api.types";
export const postApi = <Path extends keyof ApiEndpoints>(path: Path, payload: ApiEndpoints[Path]["request"], config?: AxiosRequestConfig<ApiEndpoints[Path]["request"]>) => config === undefined
    ? axios.post<ApiEndpoints[Path]["response"]>(path, payload)
    : axios.post<ApiEndpoints[Path]["response"]>(path, payload, config);
