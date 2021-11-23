import axios from 'axios'

const API_KEY = 'KISI-LOGIN ' // insert API key here

export const KisiClient = axios.create({
  baseURL: 'https://api.kisi.io/',
  timeout: 2000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: API_KEY
  }
})
