const checkIsNavigationSupported = () => {
  return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
  const response = await fetch(url)
  const text = await response.text()
  // se obtiene solo el body
  // uso de regex para la extraccion
  const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)
  return data
}

export const startViewTransition = () => {
  if (!checkIsNavigationSupported()) return

    window.navigation.addEventListener('navigate', (event) => {
      const toUrl = new URL(event.destination.url)
      // si la pagina es externa no devuelve nada
      if (location.origin !== toUrl.origin) return
      // si es del mismo dominio
      event.intercept({
        async handler () {
          const data = await fetchPage(toUrl.pathname)
          // cargar la pagina de destino
          // usando un fetch para obtener html
          // usa la api de view transition Api
          document.startViewTransition(() => {
            // // como tiene que actualizar la vista
            // document.getElementById('content').innerHTML = data
            // scroll top up todo
            document.body.innerHTML = data
            document.documentElement.scrollTop = 0
          })
        }
      })
    })
}