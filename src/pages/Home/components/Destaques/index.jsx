import { Carousel, Col, Container, Row } from "react-bootstrap"

//Styles
import './style.scss'

const PlaceholderComponent = () => {
  const title = 'Maurícia'
  const description1 = 'Voo direto + 7 noits | meia-pensão'
  const description2 = 'Partidas de Madrid'
  const price = Math.floor(Math.random() * 3000) + 1
  const formatedPrice = new Intl.NumberFormat('de-DE').format(price)

  return (
    <Row>
      <Col lg={8} sm={8}>
        <p className='destaque-section_list-description'>
          <strong>{title}</strong>
          <br />
          {description1}
          <br />
          {description2}
        </p>
      </Col>
      <Col lg={4} sm={4}>
        <p className='destaque-section_list-price'>
          € {formatedPrice}
        </p>
      </Col>
    </Row>
  )
}

const Destaques = () => {
  return (
    <section className='destaque-section'>
      <Container>
        <Row>
          <h2 className='destaque-section_title'>
            Comece a planear as suas férias
          </h2>

          <Col lg={4} sm={12}>
            <Carousel
              className="destaque-section_carousel"
              fade
              slide
              indicators={false}
              controls={false}
            >
              <Carousel.Item className="destaque-section_carousel-item">
                <figure
                  className='destaque-section_carousel-image'
                  style={{
                    backgroundImage: "url('https://cdn.optigest.net/abreu_lo/mig_cdn_abreu/SiteAbreu/ImageNew/300x250_MREC/MREC-caraibas.png')"
                  }}
                />

              </Carousel.Item>
            </Carousel>
          </Col>

          <Col lg={4} sm={12}>
            <figure
              className='destaque-section_image'
              style={{
                backgroundImage: "url('https://cdn.optigest.net/abreu_lo/mig_cdn_abreu/SiteAbreuv2/ImageNew/767x510/DubaiPredios.jpg')"
              }}
            >
              <h2 className='destaque-section_image-title'>
                Férias na Cidade
              </h2>
            </figure>

            <div className='destaque-section_disclaimer'>
              <span >desde por pessoa</span>
            </div>

            <ul className='destaque-section_list'>
              <li className='destaque-section_list-item'>
                <PlaceholderComponent />
              </li>
              <li className='destaque-section_list-item'>
                <PlaceholderComponent />
              </li>
              <li className='destaque-section_list-item'>
                <PlaceholderComponent />
              </li>
            </ul>
          </Col>

          <Col lg={4} sm={12}>
            <figure
              className='destaque-section_image'
              style={{
                backgroundImage: "url('https://cdn.optigest.net/abreu_lo/mig_cdn_abreu/SiteAbreuv2/ImageNew/767x510/Maldivas2.png')"
              }}
            >
              <h2 className='destaque-section_image-title'>
                Praias Paradisíacas
              </h2>
            </figure>

            <div className='destaque-section_disclaimer'>
              <span >desde por pessoa</span>
            </div>

            <ul className='destaque-section_list'>
              <li className='destaque-section_list-item'>
                <PlaceholderComponent />
              </li>
              <li className='destaque-section_list-item'>
                <PlaceholderComponent />
              </li>
              <li className='destaque-section_list-item'>
                <PlaceholderComponent />
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Destaques
