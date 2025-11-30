import React from 'react'
import { Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard.jsx'

export default function Favourites({ favourites = [], addToFavourites, removeFromFavourites}) {
  return (
    <div className="p-12 min-h-screen bg-gradient-to-br from-black via-[#2b0f35] to-[#4d1135] text-white">
      <div className="container mx-auto ">
        <h1 className="text-2xl font-bold mb-4">Your favourites</h1>

        {favourites.length < 1 ?(
          <div className='container w-[80%] h-[400px] flex flex-col justify-center mx-auto text-center'>
            <p className="mb-6">You haven't added any favourites yet.</p>
            <Link to='/' className="px-4 py-2 mx-auto w-[50%] bg-fuchsia-600 rounded text-white">Browse Movies</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {favourites.map(movie => (
              <MovieCard 
                key={movie.imdbID} 
                movie={movie}
                addToFavourites={addToFavourites}
                removeFromFavourites={removeFromFavourites}
                isFavourite={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
