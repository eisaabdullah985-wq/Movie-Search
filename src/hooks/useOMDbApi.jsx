
import { useState, useCallback } from 'react';
import { omdbApiService } from '../services/omdbApi';

export const useOMDbApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchMovies = useCallback(async (query, page = 1, type = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await omdbApiService.searchMovies(query, page, type);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getMovieDetails = useCallback(async (imdbID) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await omdbApiService.getMovieDetails(imdbID);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const enhanceMoviesWithDetails = useCallback(async (movies) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await omdbApiService.enhanceSearchResultsWithDetails(movies);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    searchMovies,
    getMovieDetails,
    enhanceMoviesWithDetails,
    clearError
  };
};