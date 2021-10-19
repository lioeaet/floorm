const fetchData = (url, method = 'GET', body) =>
  fetch(`http://localhost:7337/${url}`, { body, method, headers: { 'Content-Type': method === 'GET' ? 'text/plain' : 'application/json', } })
    // .then(a => console.log(a) || a)
    .then(res => res.json())

const api = {
  author: {
    get: authorId => fetchData(`author/${authorId}`)
  },
  authors: {
    get: () => fetchData('authors')
  },
  book: {
    get: bookId => fetchData(`book/${bookId}`),
    put: (bookId, diff) => fetchData(
      `book/${bookId}`,
      'PUT',
      JSON.stringify(
        { diff }, 
        (key, val) => key === 'author' ? diff.author.id : val
      )
    ),
    remove: bookId => fetchData(`book/${bookId}`, 'DELETE')
  },
  favoriteBooks: {
    get: () => fetchData('favoriteBooks'),
  }
}

export default api

// const delay = (func, ms = 999) =>
//   new Promise(resolve =>
//     setTimeout(
//       () => resolve(func()), 
//       ms
//     )
//   )
