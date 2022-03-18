import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Popper from "@popperjs/core"
import Bootstrap from 'bootstrap'
import BootstrapCss from 'bootstrap/dist/css/bootstrap.min.css'


createApp(App)
.use(store)
.use(router)
.use(Popper)
.use(Bootstrap)
.use(BootstrapCss)
.mount('#app')
