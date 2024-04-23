import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import HomeView from './views/HomeView.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Avatar from 'primevue/avatar'
import Dropdown from 'primevue/dropdown'
import ProgressBar from 'primevue/progressbar'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import { VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(HomeView)

app.use(PrimeVue)
app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)

app.component('Button', Button)
app.component('Textarea', Textarea)
app.component('Avatar', Avatar)
app.component('Dropdown', Dropdown)
app.component('ProgressBar', ProgressBar)
app.component('Dialog', Dialog)
app.component('InputText', InputText)

app.mount('#app')
