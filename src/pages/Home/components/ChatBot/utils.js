import moment from "moment"
import { faker } from "@faker-js/faker"
import { v4 as uuidV4 } from "uuid"

export const DEFAULT_PROMPT_KEYS = ['destination', 'origin', 'when', 'who', 'budget']

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

export const getPKeyQuestion = (key) => {
  switch (key) {
    case 'destination':
      return 'Qual o destino da viagem do cliente?'
    case 'when':
      return 'Quando pretendes ir? (Exemplo: 12 de Janeiro a 15 de Janeiro)'
    case 'origin':
      return 'De onde vai sair o seu cliente?'
    case 'who':
      return 'Quantas pessoas são?'
    case 'budget':
      return 'Qual o valor máximo que o cliente quer gastar?'
    default:
      return ''
  }
}
export const INITIAL_PROMPTS = DEFAULT_PROMPT_KEYS.map((key) => ({ key, question: getPKeyQuestion(key), value: '' }))

export const generatePrompts = (aiPrompts = null) => {
  if (aiPrompts?.length > 0) {
    return aiPrompts.map((p) => ({ ...p, value: '' }))
  }

  return INITIAL_PROMPTS
}


export const generateOfflineBotMsg = (nextKey) => {
  let chatMessage = { type: 'bot', message: '', timeStamp: moment() }

  switch (nextKey) {
    case 'free_form': {
      chatMessage.message = 'Em que é que o posso ajudar?'
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
    case 'prompts_error': {
      chatMessage.message = 'Alguma coisa correu mal. Tenta outra vez carregando no botão de reset (x) ou então mais tarde!'
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
    family_size: "2 adultos e uma criança",
    origin: "Portugal",
    start_date: "10/08/2025",
    end_date: "10/08/2025",
    departures_from_origin: [
      "10 de julho, 08:00, 2h30",
      "10 de julho, 12:00, 2h30",
      "10 de julho, 18:00, 2h30"
    ],
    departures_from_destination: [
      "15 de julho, 09:00, 2h30",
      "15 de julho, 13:00, 2h30",
      "15 de julho, 17:00, 2h30"
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
  if (!data || !data.trip_plans) return []

  const _data = data.trip_plans.map((item) => {
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
          ...landmark,
          image: generateRandomUrlForImg()
        }
      })
    }
  })

  return _data
}

export const parseFreeResponseData = (data) => {
  if (!data) return generateOfflineBotMsg('request_error')

  return {
    type: 'bot',
    message: data.message,
    timeStamp: moment(),
    has_report: data.finished
  }
}
