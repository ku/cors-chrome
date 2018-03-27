

document.addEventListener('INSECURE_CORS_REQUEST', (ev) => {
  let {url, options, sequence} = ev.detail

  options = options || {}

  fetch(url, options).then( response => {
    const {status, statusText} = response

    return response.json().then( body => {
      const ev = new CustomEvent('INSECURE_CORS_RESPONSE', {
        detail: { status, statusText, body, sequence }
      })
      document.dispatchEvent(ev)
    })
  })
}, false)
