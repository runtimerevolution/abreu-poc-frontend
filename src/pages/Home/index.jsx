// Code: Home page
import ImageCarousel from './components/Carousel'
import Destaques from './components/Destaques'
import ReservationSearch from './components/ReservationSearch'
import './style.scss'

const Home = () => {
  return (
    <>
      <ImageCarousel />

      <ReservationSearch />

      <Destaques />
    </>
  )
}

export default Home
