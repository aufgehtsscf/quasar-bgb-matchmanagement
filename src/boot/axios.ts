import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'https://api.example.com' })

const URLMatch = 'https://script.google.com/macros/s/AKfycbysBv-GIg2N_vpj7n1L3pWiK1WC0EC1bUfJCmv7kBXHfdPKxtbJg8bQyNJKFDkekGEDeA/exec?ID=1znyBnIzqghCeRImZ8fSVGB_gR6TESuqep20YbUhkhSU&SH=BGB-Match'
const URLParticipant = 'https://script.google.com/macros/s/AKfycbxyY9YZjWtnDPLQCWrO_j7YmfPFRRu6VHmqMgN1oS5bHL1nXoPyc3LrRBMDH0V-tDszuA/exec?ID=1HCZKuGO-dmNJwrEsFyN2acvnE-WMHabBW8jWdhO4ggI&SH=BGB-Participant'
const URLParticipantArchive = 'https://script.google.com/macros/s/AKfycbwNroj1OzLNOOHRWFdNmaiN8bpKnJqBf3Lbm6firEaWPJo1wstm7Nsh9J3oAJox1lSt7w/exec?ID=1fjnXO0Fsrj03Da8CDaBSClheSrE9Qr6VMNWzL-JQR7s&SH=BGB-ParticipantArchive'
const URLWhereIsMyCard = 'https://script.google.com/macros/s/AKfycbzlc-2httq6jMOsqbGIQmE6oAXNcWpLRZmGckDWQ6DqFoGQgHD-C1BkennQGntzAkJj/exec?ID=1AA2nnIb886xaBjpSaxwf2JNtujKnJc4xSVR-ChRGs2U&SH=BGB-WhereIsMyCard'

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
export { URLMatch }
export { URLParticipant }
export { URLParticipantArchive }
export { URLWhereIsMyCard }
