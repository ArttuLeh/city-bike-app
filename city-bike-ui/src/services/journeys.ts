import axios from 'axios'
import { Journey, JourneyFormValues, JourneysResponse } from '../types'
const apiUrl = process.env.REACT_APP_API_URL// + '/api/journeys'

//axios fetch the data from backend
const getAll = async (currentPage: number, sortField: any, sortOrder: any, searchTerm: string) => {
  const { data } = await axios.get<JourneysResponse>(
    `${apiUrl}/api/journeys?page=${currentPage}&sortField=${sortField}&sortOrder=${sortOrder}&search=${searchTerm}`
  )
  console.log(data)
  return data
}

const create = async (content: JourneyFormValues) => {
  const { data } = await axios.post<Journey>(`${apiUrl}/api/journeys`, content)
  console.log("createNew",data)
  return data
}

// eslint-disable-next-line
export default { getAll, create }