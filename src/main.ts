import { miniCookies } from './mini-cookies'

const cookies = miniCookies({ isDebugging: true }).set('foo', 'bar', {
	days: 1,
})
console.log(cookies.cookies)

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Mini Cookies! 🍪</h1>
  <p>Initially, this is a <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite starter</a>.</p>
`
