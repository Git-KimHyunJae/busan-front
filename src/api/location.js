import client from './request'

export const getLocation = (param) => {
  return client.get('/location/getLocation', { params: param })
}
