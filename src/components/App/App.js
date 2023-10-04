import React, { Component } from 'react';

import Header from '../Header';
import CardMovieList from '../CardMovieList';
import MovieDbService from '../../services/MovieDbService';
import './App.css';

export default class App extends Component {
  state = {
    movieData: [],
  };

  MovieDbService = new MovieDbService();

  componentDidMount() {
    this.getMoviesData();
  }

  getMoviesData() {
    this.MovieDbService.getDataFromServer().then((movies) => {
      movies.forEach((elm) => {
        this.addItem(elm);
      });
    });
  }

  createMovie = (movie) => {
    let posterURL = `https://sun9-69.userapi.com/c11392/u50493878/-6/x_cea601e1.jpg`;
    if (movie.poster_path) {
      posterURL = `https://image.tmdb.org/t/p/w185${movie.poster_path}`;
    }
    return {
      id: movie.id,
      filmTitle: movie.title,
      posterURL,
      releaseDate: movie.release_date,
      overview: movie.overview,
      popularity: movie.popularity,
    };
  };

  addItem = (movie) => {
    const newMovie = this.createMovie(movie);
    this.setState(({ movieData }) => {
      const newMovieData = [...movieData, newMovie];
      return {
        movieData: newMovieData,
      };
    });
  };

  render() {
    const { movieData } = this.state;

    return (
      <div className="App">
        <Header />
        <CardMovieList movieDataFromBase={movieData} />
      </div>
    );
  }
}
