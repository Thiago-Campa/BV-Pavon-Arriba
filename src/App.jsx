import GuardBar from './components/GuardBar.jsx'
import Header from './components/Header.jsx'
import Carousel from './components/Carousel.jsx'
import History from './components/History.jsx'
import ActiveCorps from './components/ActiveCorps.jsx'
import Board from './components/Board.jsx'
import News from './components/News.jsx'
import Gallery from './components/Gallery.jsx'
import Memorial from './components/Memorial.jsx'
import LocationMap from './components/LocationMap.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <GuardBar />
      <Header />
      <Carousel />
      <History />
      <ActiveCorps />
      <Board />
      <News />
      <Gallery />
      <Memorial />
      <LocationMap />
      <Contact />
      <Footer />
    </>
  )
}
