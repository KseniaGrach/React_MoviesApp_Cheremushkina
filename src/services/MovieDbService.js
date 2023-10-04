export default class MovieDbService {
  apiKey = '061351680ed87654f5ae0baea113ffe1';

  async getDataFromServer() {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&page=10&include_adult=false&query=return`
      );
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }
      const body = await res.json();
      return body.results;
    } catch (err) {
      console.error('Возникла проблема с fetch запросом: ', err.message);
      return err.message;
    }
  }
}
