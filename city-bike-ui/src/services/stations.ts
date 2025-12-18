import axios from 'axios'
import { /*Station,*/ StationDetails, StationsResponse } from '../types'
const apiUrl = process.env.REACT_APP_API_URL + '/api/stations'

//axios fetch the data from backend
const getAll = async (currentPage: number, searchTerm: string) => {
  const { data } = await axios.get<StationsResponse>(
    `${apiUrl}?page=${currentPage}&search=${searchTerm}`
  )
  console.log("services", currentPage)
  return data
}
//fetch the specific station data from backend
const getStation = async (id: number) => {
  const { data } = await axios.get<StationDetails>(`${apiUrl}/${id}`)
  console.log("services", data)
  return data
}
// eslint-disable-next-line
export default { getAll, getStation }
