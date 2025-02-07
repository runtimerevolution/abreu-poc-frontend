import moment from "moment"
import { faker } from "@faker-js/faker"
import { v4 as uuidV4 } from "uuid"

export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

export const randomIntFromInterval = (min, max) => { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const timeOfDay = () => {
  const currentHour = moment().format('HH')

  if (currentHour >= 3 && currentHour < 12) return 'bom dia'
  else if (currentHour >= 12 && currentHour < 19) return 'boa tarde'

  return null
}

export const generateBotMsg = (nextKey) => {
  let chatMessage = { type: 'bot', message: '', timeStamp: moment() }

  switch (nextKey) {
    case 'destination':
      chatMessage.message = 'Qual o destino da viagem do cliente?'
      break
    case 'when':
      chatMessage.message = 'Quando pretendes ir? (Exemplo: 12 de Janeiro a 15 de Janeiro)'
      break
    case 'origin':
      chatMessage.message = 'De onde vai sair o seu cliente?'
      break
    case 'who':
      chatMessage.message = 'Quantas pessoas são?'
      break
    case 'budget':
      chatMessage.message = 'Qual o valor máximo que o cliente quer gastar?'
      break
    case 'free_form': {
      chatMessage.message = 'O que é que o cliente deseja?'
      break
    }
    case 'opening': {
      chatMessage.message = `Olá, ${timeOfDay()}! Bem vindo ao seu assistente de viagem à medida.`
      break
    }
    case 'reset': {
      chatMessage.message = 'Se quiserer recomeçar a conversa, clica no botão de reset (x).'
      break
    }
    case 'request_error': {
      chatMessage.message = 'Desculpa, não foi possivel gerar relatórios. Tenta outra vez!'
      break
    }
    case 'request_success': {
      chatMessage.message = 'Desculpa, não foi possivel gerar relatórios. Tenta outra vez!'
      break
    }
    case 'generate_options': {
      chatMessage.message = 'Geradas algumas sugestões de viagens verifique em baixo!'
    }
  }
  return chatMessage
}

export const getDayPeriodFromIndex = (index) => {
  switch (index) {
    case 0:
      return 'Manhã:'
    case 1:
      return 'Tarde:'
    case 2:
      return 'Noite:'
    default:
      return "Desconhecido:"
  }
}

export const generateRandomUrlForImg = () => {
  return `https://picsum.photos/200?random=${randomIntFromInterval(1, 100)}`
}

export const generateRandomPriceString = (min = 500, max = 1000) => {
  const price = randomIntFromInterval(min, max)
  return new Intl.NumberFormat('de-DE').format(price)
}

export const generateRandomOption = (hasCity = '') => {

  const option = {
    id: uuidV4(),
    image: generateRandomUrlForImg(),
    landmarks: [
      { image: generateRandomUrlForImg(), name: "Museu do Prado" },
      { image: generateRandomUrlForImg(), name: "Palácio Real de Madrid" },
      { image: generateRandomUrlForImg(), name: "Parque do Retiro" },
      { image: generateRandomUrlForImg(), name: "Plaza Mayor" }
    ],
    restaurants: [
      { image: generateRandomUrlForImg(), name: "Casa Lucio" },
      { image: generateRandomUrlForImg(), name: "Sobrino de Botín" },
      { image: generateRandomUrlForImg(), name: "DiverXO" }
    ],
    hotel_list: [
      { image: generateRandomUrlForImg(), name: "Hotel Regina" },
      { image: generateRandomUrlForImg(), name: "Hotel Emperador" },
      { image: generateRandomUrlForImg(), name: "Hotel Catalonia Plaza Mayor" }
    ],
    price: "1800 EUR",
    average_temp: "30°C",
    departure_from_origin: "Voo AM3, 10 de Julho, 14:00, 11 horas de viagem",
    departure_from_destination: " Voo AM4, 15 de Julho, 19:00, 11 horas de viagem",
    short_description: "Cidade vibrante com rica história e cultura em Espanha.",
    small_history: "Madrid, a capital de Espanha, é uma cidade com uma rica história que remonta ao século IX. Tornou-se a capital do país em 1561 sob o reinado de Felipe II. A cidade é conhecida pela sua arquitetura histórica, museus de renome mundial e uma vibrante cena cultural.",
    activities_per_day: {
      "1st": {
        morning: "Visite o Museu do Prado para admirar obras de arte de mestres como Velázquez e Goya.",
        afternoon: "Explore o Palácio Real de Madrid e os seus magníficos jardins.",
        evening: "Jante no restaurante tradicional Casa Lucio para experimentar a autêntica culinária madrilena."
      },
      "2nd": {
        morning: "Passeie pelo Parque do Retiro e desfrute de um passeio de barco no lago.",
        afternoon: "Visite a Plaza Mayor e aproveite para conhecer as lojas e cafés ao redor.",
        evening: "Delicie-se com uma refeição no histórico Sobrino de Botín, o restaurante mais antigo do mundo."
      },
      "3rd": {
        morning: "Descubra o bairro de La Latina e explore os seus mercados e ruas pitorescas.",
        afternoon: "Faça uma visita ao Museu Reina Sofia para ver a Guernica de Picasso.",
        evening: "Desfrute de uma experiência gastronómica inovadora no restaurante DiverXO."
      },
      "2rd": {
        morning: "Descubra o bairro de La Latina e explore os seus mercados e ruas pitorescas.",
        afternoon: "Faça uma visita ao Museu Reina Sofia para ver a Guernica de Picasso.",
        evening: "Desfrute de uma experiência gastronómica inovadora no restaurante DiverXO."
      },
      "4rd": {
        morning: "Descubra o bairro de La Latina e explore os seus mercados e ruas pitorescas.",
        afternoon: "Faça uma visita ao Museu Reina Sofia para ver a Guernica de Picasso.",
        evening: "Desfrute de uma experiência gastronómica inovadora no restaurante DiverXO."
      },
      "5rd": {
        morning: "Descubra o bairro de La Latina e explore os seus mercados e ruas pitorescas.",
        afternoon: "Faça uma visita ao Museu Reina Sofia para ver a Guernica de Picasso.",
        evening: "Desfrute de uma experiência gastronómica inovadora no restaurante DiverXO."
      }
    }
  }

  if (!hasCity) option.destination = faker.location.city()

  return option
}


export const parseResponseData = (data) => {
  if (!data) return null

  if (Array.isArray(data)) {
    const _data = data.map((item) => {
      return {
        ...item,
        image: generateRandomUrlForImg(),
        restaurants: item.restaurants.map((restaurant) => {
          return {
            name: restaurant,
            image: generateRandomUrlForImg()
          }
        }),
        hotel_list: item.hotel_list.map((hotel) => {
          return {
            name: hotel,
            image: generateRandomUrlForImg()
          }
        }),
        landmarks: item.landmarks.map((landmark) => {
          return {
            name: landmark,
            image: generateRandomUrlForImg()
          }
        })
      }
    })

    return _data
  } else {
    return [{
      ...data,
      image: generateRandomUrlForImg(),
      restaurants: data.restaurants.map((restaurant) => {
        return {
          name: restaurant,
          image: generateRandomUrlForImg()
        }
      }),
      hotel_list: data.hotel_list.map((hotel) => {
        return {
          name: hotel,
          image: generateRandomUrlForImg()
        }
      }),
      landmarks: data.landmarks.map((landmark) => {
        return {
          name: landmark,
          image: generateRandomUrlForImg()
        }
      })
    }]
  }

}
