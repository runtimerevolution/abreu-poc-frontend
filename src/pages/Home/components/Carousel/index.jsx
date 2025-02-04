import PropTypes from 'prop-types';
import { Carousel } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import './style.scss'


const CaptionButton = ({ label = 'VER OFERTAS', path='/' }) => {
  return (
    <a
      className="caption-btn"
      href={path}
      target="_self"
    >
      {label}
    </a>
  )
}

CaptionButton.propTypes = {
  label: PropTypes.string,
  path: PropTypes.string
}

const CaptionText = ({ text, subText='', path='/' }) => {
  return (
    <a className="caption-text" href={path} target="_self">
      <h5 className="caption-text_title">
        {text}
      </h5>

      {subText !== '' && (
        <p className="caption-text_sub-title">
          {subText}
        </p>
      )}
    </a>
  )
}


CaptionText.propTypes = {
  text: PropTypes.string.isRequired,
  subText: PropTypes.string,
  path: PropTypes.string
}


const ImageCarousel = () => {
  return (
    <Carousel
      className="image-carousel"
      fade
      indicators={false}
      controls
      nextIcon={<FontAwesomeIcon className="image-carousel_control-icon" icon={faChevronRight} />}
      prevIcon={<FontAwesomeIcon className="image-carousel_control-icon" icon={faChevronLeft} />}
    >
      <Carousel.Item
        className='image-carousel_item'
        // interval={4000}
      >
        <img
            className='image-carousel_image'
            src="https://cdn.optigest.net/abreu_lo/202501/BAN_67912cf5a5653.png"
            alt=""
        />
        <div className='image-carousel_image-wrapper' />

        <Carousel.Caption className="image-carousel_caption">
        </Carousel.Caption>

        <img
          className='banner-img'
          src="https://cdn.optigest.net/abreu_lo/202501/BAN_DESK67912cf5a5689.png"
          style={{
            position: 'absolute',
          }}
        />
      </Carousel.Item>

      <Carousel.Item
        className='image-carousel_item'
        // interval={4000}
      >
        <img
          className='image-carousel_image'
          src="https://cdn.optigest.net/abreu_lo/202501/BAN_678e283f5fa96.jpg"
          alt=""
        />
        <div className='image-carousel_image-wrapper' />

        <Carousel.Caption />

        <img
          className='banner-img'
          src="https://cdn.optigest.net/abreu_lo/202501/BAN_DESK678e2d7244c3e.jpg"
        />
      </Carousel.Item>

      <Carousel.Item
        className='image-carousel_item'
        // interval={4000}
      >
        <img
          className='image-carousel_image'
          src="https://cdn.optigest.net/abreu_lo/202312/caboverde_sal_banner.jpg"
          alt=""
        />
        <div className='image-carousel_image-wrapper' />

        <Carousel.Caption className="image-carousel_caption">
          <CaptionText
            path='https://www.abreu.pt/cabo_verde?MB'
            text="Cabo Verde"
            subText="As férias que não vai esquecer!"
          />

          <CaptionButton path={"https://www.abreu.pt/cabo_verde?MB"} />
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item
        className='image-carousel_item'
      // interval={4000}
      >
        <img
          className='image-carousel_image'
          src="https://cdn.optigest.net/abreu_lo/202312/espanha_baleares_ibiza.jpg"
          alt=""
        />
        <div className='image-carousel_image-wrapper' />

        <Carousel.Caption className="image-carousel_caption">
          <CaptionText
            path='https://www.abreu.pt/espanha?MB'
            text="Ilhas Espanholas"
            subText="As melhores praias ao melhor preço"
          />

          <CaptionButton path={"https://www.abreu.pt/espanha?MB"} />
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item
        className='image-carousel_item'
        // interval={4000}
      >
        <img
          className='image-carousel_image'
          src="https://cdn.optigest.net/abreu_lo/202405/mega_banner_tunisia_vista.jpg"
          alt=""
        />
        <div className='image-carousel_image-wrapper' />

        <Carousel.Caption className="image-carousel_caption">
          <CaptionText
            text='Tunísia Praias'
            subText='Hammamet, Port El Kantoui, Sousse e Monastir'
          />

          <CaptionButton
            path='https://www.abreu.pt/produto.php?prodCode=PT2025VENBETPLISQUIDELFINO&amp;mmy='
            label='Reserve já'
          />
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  )
}

export default ImageCarousel
