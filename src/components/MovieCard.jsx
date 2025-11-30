export default function MovieCard({ movie, addToFavourites , removeFromFavourites , isFavourite }) {

  function handleClick() {
    if (isFavourite) {
      removeFromFavourites(movie);
    } else {
      addToFavourites(movie);
    }
  }
  
  return (

    <div 
      className="relative bg-gradient-to-br from-[#1b1b1b] via-[#262626] to-[#0d0d0d]
      rounded-xl shadow-lg shadow-black/40 
      hover:scale-105 hover:shadow-red-500/40 duration-300 cursor-pointer"
    >
      <img className='w-[100%] h-[400px] rounded-t-lg' src={movie.Poster} alt={movie.Title} />

      <p className='text-white text-xl font-bold px-2 pt-2'>
        {movie.Title}
      </p>

      <p className='text-gray-300 px-3 text-sm'>
        📅 Year: <span className='text-white'>{movie.Year}</span>
      </p>

      <p className='text-gray-300 px-3 pb-4 text-sm'>
        🎬 Type: <span className='text-white capitalize'>{movie.Type}</span>
      </p>

      <button 
        onClick={handleClick}
        className='absolute top-2 right-2 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 transition'>
        <p className='text-black text-lg'>
            {isFavourite ? "❤️" : "🤍"}
        </p>
      </button>
    </div>
  );
}
