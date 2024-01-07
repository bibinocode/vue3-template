import { createPinia } from 'pinia'
import piniasistedPlugin from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniasistedPlugin)


export default pinia