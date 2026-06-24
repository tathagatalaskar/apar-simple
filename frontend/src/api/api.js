import client from './client'

export const authApi = {
  login: (email, password) => client.post('/auth/login', { email, password }),
}

export const reportApi = {
  list: () => client.get('/v1/reports'),
  get: (id) => client.get(`/v1/reports/${id}`),
  submit: (payload) => client.post('/v1/reports', payload),
  review: (id, payload) => client.put(`/v1/reports/${id}/review`, payload),
}
