export interface Movie {
  id: string
  title: string
  description: string
  poster_url: string
  trailer_url: string
  telegram_link: string
  genre: string[]
  release_year: number
  rating: number
  type: 'movie' | 'series'
  created_at: string
  updated_at: string
}

export interface MovieFormData {
  title: string
  description: string
  poster_url: string
  trailer_url: string
  telegram_link: string
  genre: string[]
  release_year: number
  rating: number
  type: 'movie' | 'series'
}

export const GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western',
] as const

export const SERIES_TELEGRAM_LINK = 'https://t.me/mmsubmoviesvip/3'
