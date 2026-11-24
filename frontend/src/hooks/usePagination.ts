import { useSearchParams } from "react-router-dom";
export const SONGS_PER_PAGE = 20;
const usePagination = (itemCount: number, pageSize = SONGS_PER_PAGE) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageCount = Math.max(1, Math.ceil(itemCount / pageSize));
  const requestedPage = Number(searchParams.get("page") || 1);
  const page = Number.isInteger(requestedPage)
    ? Math.min(pageCount, Math.max(1, requestedPage))
    : 1;
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(value));
    setSearchParams(nextParams, { replace: true });
  };
  return {
    page,
    pageCount,
    start: (page - 1) * pageSize,
    end: page * pageSize,
    handlePageChange,
  };
};
export default usePagination;
