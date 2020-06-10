const wrap = (request) => {
  return new Promise((resolve, reject) => {
    request.onerror = (event) => reject(event)
    request.onsuccess = (event) => resolve(event.target.result)
  })
}

const getDb = (database, version) => {
  const request = window.indexedDB.open(database, version)
  request.onupgradeneeded = (event) => {
    const db = event.target.result
    db.createObjectStore('keyvaluepairs')
  }
  return wrap(request)
}

const storageBuilder = (database = 'storage_2', version = 1) => ({
  getItem: async (key) => {
    const db = await getDb(database, version)
    const dataRequest =
      db
        .transaction(['keyvaluepairs'])
        .objectStore('keyvaluepairs')
        .get(key)

    const dataRequestPromise = wrap(dataRequest)

    return dataRequestPromise
  },
  setItem: async (key, value) => {
    const db = await getDb(database, version)
    const dataRequest =
      db
        .transaction(['keyvaluepairs'], 'readwrite')
        .objectStore('keyvaluepairs')
        .put(value, key)

    return wrap(dataRequest)
  }
})

export default storageBuilder
