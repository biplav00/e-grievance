import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const DataCacheContext = createContext();

export function DataCacheProvider({ children, token }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState({ departments: false });
  const [error, setError] = useState({ departments: "" });

  const fetchDepartments = useCallback(async () => {
    setLoading((l) => ({ ...l, departments: true }));
    try {
      const config = token ? { headers: { "x-auth-token": token } } : {};
      const api = require('../api').default;
      const res = await api.get("/api/department", config);
      setDepartments(res.data);
      setError((e) => ({ ...e, departments: "" }));
    } catch {
      setError((e) => ({ ...e, departments: "Failed to load departments" }));
    }
    setLoading((l) => ({ ...l, departments: false }));
  }, [token]);

  useEffect(() => {
    if (departments.length === 0) fetchDepartments();
    // eslint-disable-next-line
  }, [fetchDepartments]);

  return (
    <DataCacheContext.Provider
      value={{
        departments,
        loading,
        error,
        refetchDepartments: fetchDepartments,
      }}
    >
      {children}
    </DataCacheContext.Provider>
  );
}

export function useDataCache() {
  return useContext(DataCacheContext);
}
