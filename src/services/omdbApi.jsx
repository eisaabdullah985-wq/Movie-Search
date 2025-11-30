
const API_KEY = '7e13c8fd';
const BASE_URL = 'https://www.omdbapi.com/';

class OMDbApiService {

  async searchMovies(query, page = 1, type = '') {
    try {
      const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}${type ? `&type=${type}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.Response === "False") {
        throw new Error(data.Error || 'No results found');
      }
      
      return data;
    } catch (error) {
      console.error('OMDb API search error:', error);
      throw error;
    }
  }

  // Get movie details by IMDB ID
  async getMovieDetails(imdbID) {
    try {
      const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTPS error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.Response === "False") {
        throw new Error(data.Error || 'Movie not found');
      }
      
      return data;
    } catch (error) {
      console.error('OMDb API details error:', error);
      throw error;
    }
  }

  // Get movie details with short plot (for cards)
  async getMovieDetailsShort(imdbID) {
    try {
      const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=short`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTPS error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.Response === "False") {
        throw new Error(data.Error || 'Movie not found');
      }
      
      return data;
    } catch (error) {
      console.error('OMDb API details error:', error);
      throw error;
    }
  }

  // Search movies by year and type
  async searchMoviesByYear(year, type = 'movie', page = 1) {
    try {
      const url = `${BASE_URL}?apikey=${API_KEY}&y=${year}&type=${type}&page=${page}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTPS error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.Response === "False") {
        throw new Error(data.Error || 'No results found');
      }
      
      return data;
    } catch (error) {
      console.error('OMDb API year search error:', error);
      throw error;
    }
  }

  async getMultipleMovieDetails(imdbIDs) {
    try {
      const promises = imdbIDs.map(id => this.getMovieDetailsShort(id));
      const results = await Promise.all(promises);
      return results.filter(movie => movie !== null);
    } catch (error) {
      console.error('OMDb API batch details error:', error);
      throw error;
    }
  }

  async enhanceSearchResultsWithDetails(searchResults) {
    if (!searchResults || searchResults.length === 0) return [];

    try {
      const enhancedMovies = await Promise.all(
        searchResults.map(async (movie) => {
          try {
            const details = await this.getMovieDetailsShort(movie.imdbID);
            return {
              ...movie,
              ...details
            };
          } catch (error) {
            console.warn(`Could not fetch details for ${movie.Title}:`, error);
            return movie; 
          }
        })
      );
      
      return enhancedMovies;
    } catch (error) {
      console.error('Error enhancing search results:', error);
      throw error;
    }
  }
}

export const omdbApiService = new OMDbApiService();

export default OMDbApiService;