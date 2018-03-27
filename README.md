
# cors

A chrome extension which proxies `fetch` requests without CORS restriction. Works on only localhost.

# How to use?

## Install chrome extension for your environment

1. Clone this gist
1. Edit "permissions" of manifest.json to fit your environment. Add the domain you want to access to `permissions`.
1. Open `chrome://extensions/`
2. Click "Load unpacked extension..."
3. Select the directory where the files are placed

Popsicle icon is by Lee [dessert Collection \| Noun Project](https://thenounproject.com/b_b_Lee/collection/dessert/?i=163582#)
licensed as Creative Commons CCBY.

## Define wrapper

Override `fetch()` with something like

```
window.fetch = ( function createFetch() {
  let promises = {};
  let _sequence = 0;
  const listener = (ev) => {
    const detail = ev.detail;
    if (detail) {
      const pair = promises[detail.sequence];
      if (pair) {
        delete promises[detail.sequence];
        if (detail.status >= 400) {
          pair.reject(detail.statusText);
        } else {
          pair.resolve(Object.assign(detail, {
            json: () => Promise.resolve(detail.body)
          }));
        }
      }
    }
  }

  document.addEventListener('INSECURE_CORS_RESPONSE', listener, false);

  return function fetch(url, options) {
    const sequence = _sequence++;
    return new Promise( (resolve, reject) => {
      document.dispatchEvent(
        new CustomEvent('INSECURE_CORS_REQUEST', {
          detail: { url, options, sequence },
        }),
      );
      promises[sequence] = { resolve, reject };
    });
  }
})();
```
