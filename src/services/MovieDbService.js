export default class MovieDbService {
  apiKey = '061351680ed87654f5ae0baea113ffe1';

  baseUrl = 'https://api.themoviedb.org/3/';

  getDataFromServer = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }
      const body = await res.json();
      return body;
    } catch (err) {
      console.error('Возникла проблема с fetch запросом: ', err.message);
      return err.message;
    }
  };

  getMovies = async (searchQuery = 'return', pageNumber = 1) => {
    const url = `${this.baseUrl}search/movie?api_key=${this.apiKey}&page=10&include_adult=false&query=${searchQuery}&page=${pageNumber}`;
    const body = await this.getDataFromServer(url);

    return body;
  };
}
