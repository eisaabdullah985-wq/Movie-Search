import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard.jsx'
import topPoster from '../assets/poster.jpg'
import { useOMDbApi } from '../hooks/useOMDbApi'

export default function Home({ addToFavourites, removeFromFavourites, favourites = [] }) {
  const [movies, setMovies] = useState([])
  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [trendingMovies, setTrendingMovies] = useState([])
  const [newReleases, setNewReleases] = useState([])
  const [harryPotter, setHarryPotter] = useState([])
  const [fastnFurious, setFastnFurious] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  const { error, clearError } = useOMDbApi()

  useEffect(() => {
    setIsLoading(true)
    clearError()

    const fetchAllDataParallel = async () => {
      try {
        const currentYear = new Date().getFullYear()
    
        const [
          featuredResponse,
          trendingResponse,
          newReleasesResponse,
          popularResponse,
          harryResponse,
          fastResponse
        ] = await Promise.all([
          // Featured movie (detailed)
          fetch(`https://www.omdbapi.com/?apikey=7e13c8fd&i=tt3896198&plot=full`),
          
          // All other sections (basic search - FAST)
          fetch("https://www.omdbapi.com/?apikey=7e13c8fd&s=avengers&type=movie"),
          fetch(`https://www.omdbapi.com/?apikey=7e13c8fd&s=${currentYear}&type=movie&y=2025`),
          fetch("https://www.omdbapi.com/?apikey=7e13c8fd&s=superman&type=movie"),
          fetch("https://www.omdbapi.com/?apikey=7e13c8fd&s=harry&type=movie"),
          fetch("https://www.omdbapi.com/?apikey=7e13c8fd&s=fast")
        ])

        const featuredData = await featuredResponse.json()
        const trendingData = await trendingResponse.json()
        const newReleasesData = await newReleasesResponse.json()
        const popularData = await popularResponse.json()
        const harryData = await harryResponse.json()
        const fastData = await fastResponse.json()

        setFeaturedMovie(featuredData)
        if (trendingData.Response === "True") setTrendingMovies(trendingData.Search.slice(0, 4))
        if (newReleasesData.Response === "True") setNewReleases(newReleasesData.Search.slice(0, 4))
        if (popularData.Response === "True") setMovies(popularData.Search.slice(1, 5))
        if (harryData.Response === "True") setHarryPotter(harryData.Search.slice(0, 4))
        if (fastData.Response === "True") setFastnFurious(fastData.Search.slice(0, 4))

        setIsLoading(false)

      } catch (err) {
        console.error('Error fetching home data:', err)
        setIsLoading(false)
      }
    }

    fetchAllDataParallel()
  }, [clearError])

  // Render movie section component
  const renderMovieSection = (title, movies, viewAllLink = null) => {
    if (!movies || movies.length === 0) return null

    return (
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
          {viewAllLink && (
            <Link 
              to={viewAllLink}
              className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors text-sm md:text-base"
            >
              View All →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map(movie => (
            <MovieCard 
              key={movie.imdbID} 
              movie={movie}
              addToFavourites={addToFavourites}
              removeFromFavourites={removeFromFavourites}
              isFavourite={favourites.some(f => f.imdbID === movie.imdbID)}
            />
          ))}
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#2b0f35] to-[#4d1135] text-white p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-fuchsia-500 mb-4"></div>
          <h2 className="text-2xl text-white">Loading Movies...</h2>
          <p className="text-gray-400 mt-2">Preparing your cinematic experience</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#2b0f35] to-[#4d1135] text-white p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link 
            to="/search"
            className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg text-white transition-colors"
          >
            Search Movies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#2b0f35] to-[#4d1135] text-white">
      {featuredMovie && (
        <section className="relative h-[70vh] min-h-[500px] bg-gradient-to-r from-black/80 to-purple-900/30">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
            style={{
              backgroundImage:  `url(${topPoster})`
            }}
          ></div>
          
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                {featuredMovie.Title}
              </h1>
              <div className="flex flex-wrap gap-4 mb-6 text-sm md:text-base">
                <span className="bg-fuchsia-600 px-3 py-1 rounded-full">{featuredMovie.Year}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{featuredMovie.Genre}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{featuredMovie.Runtime}</span>
                {featuredMovie.imdbRating && featuredMovie.imdbRating !== 'N/A' && (
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full">
                    ⭐ {featuredMovie.imdbRating}/10
                  </span>
                )}
                {featuredMovie.Ratings && featuredMovie.Ratings.find(r => r.Source === 'Rotten Tomatoes') && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full">
                    🍅 {featuredMovie.Ratings.find(r => r.Source === 'Rotten Tomatoes').Value}
                  </span>
                )}
              </div>
              <p className="text-gray-300 mb-6 line-clamp-3">
                {featuredMovie.Plot !== 'N/A' ? featuredMovie.Plot : 'Explore this amazing movie in our collection.'}
              </p>
              <p className="text-gray-300 mb-6 line-clamp-3">
                Cast : {featuredMovie.Actors}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (favourites.some(f => f.imdbID === featuredMovie.imdbID)) {
                      removeFromFavourites(featuredMovie)
                    } else {
                      addToFavourites(featuredMovie)
                    }
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white transition-colors"
                >
                  {favourites.some(f => f.imdbID === featuredMovie.imdbID) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 rounded-lg p-6 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-fuchsia-400">1000+</div>
            <div className="text-gray-400 text-sm">Movies Available</div>
          </div>
          <div className="bg-white/5 rounded-lg p-6 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-fuchsia-400">{favourites.length}</div>
            <div className="text-gray-400 text-sm">Your Favorites</div>
          </div>
          <div className="bg-white/5 rounded-lg p-6 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-fuchsia-400">1000+</div>
            <div className="text-gray-400 text-sm">Titles to Explore</div>
          </div>
          <div className="bg-white/5 rounded-lg p-6 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-fuchsia-400">24/7</div>
            <div className="text-gray-400 text-sm">Available</div>
          </div>
        </div>

        {renderMovieSection("Trending Now", trendingMovies, "/search?q=avengers")}
        {renderMovieSection("New Releases", newReleases, "/search?q=2024")}
        {renderMovieSection("Popular Movies", movies, "/search?q=superman")}
        {renderMovieSection("Harry Potter Collection", harryPotter, "/search?q=harry")}
        {renderMovieSection("Fast n Furious Collection", fastnFurious, "/search?q=fast")}

        <section className="text-center py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Search through our extensive collection of movies, TV series, and episodes. 
            Find your next favorite film with our powerful search tools.
          </p>
          <Link 
            to="/search"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 rounded-lg text-white transition-all transform hover:scale-105"
          >
            <span>🔍</span>
            Explore All Movies
          </Link>
        </section>
      </div>
    </div>
  )
}