'use client';

import { useState, useEffect, useCallback } from 'react';

export function useAdminData<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to load');
      const json = await res.json();
      if (json && !Array.isArray(json) && json.error) throw new Error(json.error);
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const create = async (item: Partial<T>): Promise<boolean> => {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error('Failed to create');
      await loadData();
      return true;
    } catch {
      return false;
    }
  };

  const update = async (id: string, item: Partial<T>): Promise<boolean> => {
    try {
      const res = await fetch(`${endpoint}?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error('Failed to update');
      await loadData();
      return true;
    } catch {
      return false;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await loadData();
      return true;
    } catch {
      return false;
    }
  };

  return { data, loading, error, create, update, remove, reload: loadData };
}
