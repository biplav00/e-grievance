import { useDataCache } from "../context/DataCacheContext";

export default function useDepartments() {
  const { departments, loading, error, refetchDepartments } = useDataCache();
  return { departments, loading: loading.departments, error: error.departments, refetch: refetchDepartments };
}
