import axios from 'axios'
import { /*Journey,*/ JourneysResponse } from '../types'
const baseUrl = '/api/journeys'

//axios fetch the data from backend
const getAll = async (currentPage: number, sortField: any, sortOrder: any, searchTerm: string) => {
  const { data } = await axios.get<JourneysResponse>(
    `${baseUrl}?page=${currentPage}&sortField=${sortField}&sortOrder=${sortOrder}&search=${searchTerm}`
  )
  console.log(data)
  return data
}
// eslint-disable-next-line
export default { getAll }
