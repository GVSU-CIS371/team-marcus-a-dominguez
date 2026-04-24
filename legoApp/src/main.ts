import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { createRouter, createWebHashHistory} from "vue-router"
import '@mdi/font/css/materialdesignicons.css'

import './style.css'
import App from './App.vue'
import Home from './views/homeView.vue'
import test from './views/testView.vue'


const routes = [
    {path: "/", component: Home},
    {path: "/test", component: test }
]


const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify(
    {components, 
    directives, 
    theme: { defaultTheme: 'light'},
    icons: {defaultSet: 'mdi'},})
createApp(App).use(vuetify).use(router).mount('#app')
