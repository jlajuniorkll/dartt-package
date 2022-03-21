import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Popper from "@popperjs/core"
import Bootstrap from 'bootstrap'
import VCalendar from 'v-calendar';

/*import css*/
import BootstrapCss from 'bootstrap/dist/css/bootstrap.min.css'
import 'v-calendar/dist/style.css';


createApp(App)
.use(store)
.use(router)
.use(Popper)
.use(Bootstrap)
.use(BootstrapCss)
.use(VCalendar, {})
.mount('#app')
