export default class MovieDbService {
  apiKey = '061351680ed87654f5ae0baea113ffe1';

  async getDataFromServer() {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=061351680ed87654f5ae0baea113ffe1&page=10&include_adult=false&query=return`
    );
    if (!res.ok) {
      throw new Error(`Could not load movies data from MovieDB, received ${res.status}`);
    }
    const body = await res.json();
    return body.results;
  }

  async getPosterUrl(id) {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${this.apiKey}&language=en-US`);
    if (!res.ok) {
      throw new Error(`Could not load poster from MovieDB, received ${res.status}`);
    }
    const body = await res.json();
    return body.results;
  }
}
