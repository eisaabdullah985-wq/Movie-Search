import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard.jsx';

export default function SearchPage({ addToFavourites, removeFromFavourites, favourites = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [searchRes, setSearchRes] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resultsPerPage = 10;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  useEffect(() => {
    const q = (searchParams.get('q') || '').trim();
    const type = searchParams.get('type') || '';
    const page = parseInt(searchParams.get('page')) || 1;

    setSearch(q);
    setTypeFilter(type);
    setCurrentPage(page);

    const savedResults = JSON.parse(sessionStorage.getItem('searchResults') || '[]');
    if (savedResults.length > 0 && q) {
      setSearchRes(savedResults);
      setTotalResults(parseInt(sessionStorage.getItem('totalResults')) || 0);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (typeFilter) params.set('type', typeFilter);
    if (currentPage > 1) params.set('page', currentPage);
    setSearchParams(params, { replace: true });
  }, [search, typeFilter, currentPage, setSearchParams]);

  function handleSearch(e) {
    setSearch(e.target.value);
    setCurrentPage(1);
  }

  function handleTypeFilterChange(e) {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  }

  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Fetch OMDb API
  useEffect(() => {
    const q = (search || '').trim();
    if (!q) {
      setSearchRes([]);
      setTotalResults(0);
      setError('');
      sessionStorage.removeItem('searchResults');
      sessionStorage.removeItem('totalResults');
      return;
    }

    setLoading(true);
    setError('');

    const id = setTimeout(() => {
      fetch(
        `https://www.omdbapi.com/?apikey=7e13c8fd&s=${encodeURIComponent(q)}&page=${currentPage}${
          typeFilter ? `&type=${typeFilter}` : ''
        }`
      )
        .then(res => res.json())
        .then(res => {
          if (res.Response === 'True') {
            setSearchRes(res.Search || []);
            setTotalResults(parseInt(res.totalResults) || 0);
            sessionStorage.setItem('searchResults', JSON.stringify(res.Search || []));
            sessionStorage.setItem('totalResults', res.totalResults || 0);
            setError('');
          } else {
            setSearchRes([]);
            setTotalResults(0);
            setError(res.Error || 'No results found');
            sessionStorage.removeItem('searchResults');
            sessionStorage.removeItem('totalResults');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('OMDb fetch error', err);
          setSearchRes([]);
          setTotalResults(0);
          setError('Network error. Please try again.');
          setLoading(false);
        });
    }, 350);

    return () => clearTimeout(id);
  }, [search, currentPage, typeFilter]);

  // Pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-white/10 border border-white/30 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition"
      >
        ← Previous
      </button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 bg-white/10 border border-white/30 rounded-md text-white hover:bg-white/20 transition"
        >
          1
        </button>
      );
      if (startPage > 2) buttons.push(<span key="ellipsis1" className="px-2 text-white">...</span>);
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 border rounded-md transition ${
            currentPage === i
              ? 'bg-fuchsia-600 border-fuchsia-600 text-white'
              : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) buttons.push(<span key="ellipsis2" className="px-2 text-white">...</span>);
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-1 bg-white/10 border border-white/30 rounded-md text-white hover:bg-white/20 transition"
        >
          {totalPages}
        </button>
      );
    }

    // Next
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="px-3 py-1 bg-white/10 border border-white/30 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition"
      >
        Next →
      </button>
    );

    return buttons;
  };

  return (
    <div className='p-6 md:p-12 min-h-screen bg-gradient-to-br from-black via-[#2b0f35] to-[#4d1135]'>
      {/* Search Header */}
      <div className='flex flex-col md:flex-row gap-4 justify-center items-center mb-8'>
        <input
          className='w-full md:w-[50%] bg-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
          type='text'
          placeholder='Search for Movies...'
          value={search}
          onChange={handleSearch}
        />
        <select
          value={typeFilter}
          onChange={handleTypeFilterChange}
          className='w-full md:w-auto bg-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
        >
          <option value="">All Types</option>
          <option value="movie">Movies</option>
          <option value="series">Series</option>
          <option value="episode">Episodes</option>
        </select>
      </div>

      {/* Results Info */}
      {search && !loading && (
        <div className='text-center mb-6'>
          <p className='text-white text-lg'>
            {totalResults > 0 ? (
              <>
                Results for "<span className='text-fuchsia-300'>{search}</span>" 
                {typeFilter && ` (${typeFilter})`} - 
                Page {currentPage} of {totalPages} 
                <span className='text-gray-300 ml-2'>
                  ({totalResults} total results)
                </span>
              </>
            ) : (
              error && <span className='text-red-300'>{error}</span>
            )}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className='flex justify-center items-center h-40'>
          <div className='text-white text-xl'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-500 mx-auto mb-2'></div>
            Searching...
          </div>
        </div>
      )}

      {/* Results Grid */}
      {!loading && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8'>
          {searchRes.length > 0 ? (
            searchRes.map(movie => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                addToFavourites={addToFavourites}
                removeFromFavourites={removeFromFavourites}
                isFavourite={favourites.some(f => f.imdbID === movie.imdbID)}
              />
            ))
          ) : (
            search && !loading && (
              <div className='col-span-full text-center py-12'>
                <p className='text-white text-xl mb-4'>🎬 No movies found</p>
                <p className='text-gray-300'>{error}</p>
              </div>
            )
          )}
        </div>
      )}

      {/* Pagination */}
      {totalResults > 0 && !loading && (
        <div className='flex justify-center items-center space-x-2 flex-wrap gap-2'>
          {renderPaginationButtons()}
        </div>
      )}

      {/* Empty State */}
      {!search && !loading && (
        <div className='text-center py-20'>
          <div className='text-6xl mb-4'>🎬</div>
          <h2 className='text-white text-2xl mb-4'>Search for Movies</h2>
          <p className='text-gray-300 max-w-md mx-auto'>
            Enter a movie title in the search bar above to discover amazing films, series, and episodes.
          </p>
        </div>
      )}
    </div>
  );
}
