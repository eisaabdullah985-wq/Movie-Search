import { useEffect, useState } from 'react'
import './App.css'
import NavBar from './components/NavBar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Favourites from './pages/Favourites'
import SearchPage from './pages/SearchPage'

function App() {
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favourites') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites))
  }, [favourites])

  function addToFavourites(movie) {
    setFavourites(prev => {
      if (prev.some(f => f.imdbID === movie.imdbID)) return prev;
      return [...prev, movie];
    });
  }

  function removeFromFavourites(movie) {
    setFavourites(prev => prev.filter(f => f.imdbID !== movie.imdbID));
  }

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path='/' 
          element={ 
            <Home 
              addToFavourites={addToFavourites}
              favourites={favourites}
              removeFromFavourites={removeFromFavourites}
            /> 
          } 
        />
        <Route path='/favourites' 
          element={ 
            <Favourites 
              favourites={favourites} 
              removeFromFavourites={removeFromFavourites}
            /> 
          } 
        />
        <Route path='/search' 
          element={ 
            <SearchPage 
              addToFavourites={addToFavourites} 
              removeFromFavourites={removeFromFavourites}
              favourites={favourites} 
            /> 
          } 
        />
      </Routes>
    </>
  )
}

export default App