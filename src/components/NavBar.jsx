import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import search from '../assets/search.png'

export default function NavBar() {

  return (
    <div className='h-[60px] w-full bg-gradient-to-l from-[#12001b] via-[#3b002d] to-[#660011] p-2 flex items-center justify-between'>
        <img src={logo} alt="logo" className='w-[90px] h-[40px]'/>
        <div className='flex text-xl gap-x-8 font-semibold mr-2 text-white'>
          <Link to='/' className='cursor-pointer text-red-300 hover:text-white transition'>
            Home
          </Link>
          <Link to='/favourites' className='cursor-pointer text-red-300 hover:text-white transition'>
            Favourites
          </Link>
        </div>
        <Link 
          to='/search' 
          className='px-3 bg-white/10 border border-white/30 flex items-center 
          gap-x-2 rounded-lg cursor-pointer hover:bg-white/20 transition'
        > 
          <p className='text-white'>Search</p>
          <img className="w-[22px] h-[22px]" src={search}/>
        </Link>

    </div>
  )
}
