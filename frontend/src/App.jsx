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
import Login from './pages/Login'

export default function App() {
  return (
    <BrowserRouter>
    <RecoilRoot>
    <div>
      <Routes>
        <Route path='/' element={<Home/>} ></Route>
        <Route path='/signup' element={<Signup/>} ></Route>
        <Route path='/login' element={<Login/>} ></Route>
        <Route path='/anime' element={<Anime/>} ></Route>
        <Route path='/movies' element={<Movies/>} ></Route>
        <Route path='/series' element={<Series/>} ></Route>
        <Route path='/:title/:id' element={<Details/>} ></Route>
        <Route path='/:category/rated/:id/:posterName' element={<Details/>} ></Route>
        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
    </div>
    </RecoilRoot>
    </BrowserRouter>
  )
}
