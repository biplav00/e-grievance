import { useDataCache } from "../context/DataCacheContext";

export default function useCategories() {
  const { categories, loading, error, refetchCategories } = useDataCache();
  return { categories, loading: loading.categories, error: error.categories, refetch: refetchCategories };
}
