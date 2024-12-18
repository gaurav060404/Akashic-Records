import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Movies from './pages/Movies'
import Series from './pages/Series'
import Anime from './pages/Anime'
import { RecoilRoot } from 'recoil'
import AnimeTrending from './pages/AnimeTrending'
import NotFound from './pages/NotFound'
import Details from './pages/Details'

export default function App() {
  return (
    <BrowserRouter>
    <RecoilRoot>
    <div>
      <Routes>
        <Route path='/' element={<Home/>} ></Route>
        <Route path='/signup' element={<Signup/>} ></Route>
        <Route path='/anime' element={<Anime/>} ></Route>
        <Route path='/movies' element={<Movies/>} ></Route>
        <Route path='/series' element={<Series/>} ></Route>
        <Route path='/anime/trending' element={<AnimeTrending/>} ></Route>
        <Route path='/:title/:category/:id/:posterName' element={<Details/>} ></Route>
        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
    </div>
    </RecoilRoot>
    </BrowserRouter>
  )
}
