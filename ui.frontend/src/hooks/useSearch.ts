import { useCallback } from 'react';
import SearchService from '../services/SearchService';

interface UseSearchReturn {
  onSearch: (query: string) => Promise<any[]>;
}

export const useSearch = (): UseSearchReturn => {
  const onSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      return [];
    }
    return await SearchService.search(query);
  }, []);

  return { onSearch };
};