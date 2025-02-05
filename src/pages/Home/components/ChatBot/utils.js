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
    case 'when':
      chatMessage.message = 'Quando pretendes ir? (Exemplo: 12 de Janeiro a 15 de Janeiro)'
      break
    case 'origin':
      chatMessage.message = 'De onde é que vais viajar ?'
      break
    case 'who':
      chatMessage.message = 'Quantas pessoas vão ?'
      break
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

export const generateRandomOption = (hasCity = '') => {

  const option = {
    id: uuidV4(),
    image: `https://picsum.photos/200?random=${randomIntFromInterval(1, 100)}`,
    landmarks: [
      "Museu do Prado",
      "Palácio Real de Madrid",
      "Parque do Retiro",
      "Plaza Mayor"
    ],
    restaurants: [
      "Casa Lucio",
      "Sobrino de Botín",
      "DiverXO"
    ],
    hotel_list: [
      "Hotel Regina",
      "Hotel Emperador",
      "Hotel Catalonia Plaza Mayor"
    ],
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
      }
    }
  }

  if (!hasCity) option.destination = faker.location.city()

  return option
}
