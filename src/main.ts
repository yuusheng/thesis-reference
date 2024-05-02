import { createApp } from 'vue'
// import './style.css'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css'
import App from './App.vue'
import 'uno.css'

createApp(App)
  .use(ToastPlugin, {
    position: 'top',
    dismissible: true,
  })
  .mount('#app')
