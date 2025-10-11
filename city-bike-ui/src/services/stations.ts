import axios from 'axios'
import { /*Station,*/ StationDetails, StationsResponse } from '../types'
const baseUrl = '/api/stations'

//axios fetch the data from backend
const getAll = async (currentPage: number, searchTerm: string) => {
  const { data } = await axios.get<StationsResponse>(
    `${baseUrl}?page=${currentPage}&search=${searchTerm}`
  )
  console.log("services", currentPage)
  return data
}
//fetch the specific station data from backend
const getStation = async (id: number) => {
  const { data } = await axios.get<StationDetails>(`${baseUrl}/${id}`)
  console.log("services", data)
  return data
}
// eslint-disable-next-line
export default { getAll, getStation }
