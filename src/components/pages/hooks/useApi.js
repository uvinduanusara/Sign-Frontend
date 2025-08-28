import { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchData = async () => {
    if (!token && options.requireAuth) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await ApiService.request(endpoint, options.requestOptions);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }
  }, [endpoint, token]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};