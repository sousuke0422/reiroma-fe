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

const storageBuilder = async (database = 'storage_2', version = 1) => {
  try {
    let db = await getDb(database, version)
    const storage = {
      getItem: async (key) => {
        const dataRequest =
          db
            .transaction(['keyvaluepairs'])
            .objectStore('keyvaluepairs')
            .get(key)

        const dataRequestPromise = wrap(dataRequest)

        return dataRequestPromise
      },
      setItem: async (key, value) => {
        const dataRequest =
          db
            .transaction(['keyvaluepairs'], 'readwrite')
            .objectStore('keyvaluepairs')
            .put(value, key)

        return wrap(dataRequest)
      }
    }

    return storage
  } catch (e) {
    console.log("Can't get indexeddb going, let's use localstorage")

    const storage = {
      getItem: async (key) => {
        const result = window.localStorage.getItem(`${database}/${key}`)
        try {
          return JSON.parse(result)
        } catch (e) {
          return undefined
        }
      },
      setItem: async (key, value) => {
        const json = JSON.stringify(value)
        return window.localStorage.setItem(`${database}/${key}`, json)
      }
    }
    return storage
  }
}

export default storageBuilder
