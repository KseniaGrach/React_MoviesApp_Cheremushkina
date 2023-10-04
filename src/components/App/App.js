import React, { Component } from 'react';
import { Alert, Spin } from 'antd';

import Header from '../Header';
import CardMovieList from '../CardMovieList';
import MovieDbService from '../../services/MovieDbService';

import './App.css';

export default class App extends Component {
  state = {
    movieData: [],
    isLoading: true,
    isError: false,
  };

  MovieDbService = new MovieDbService();

  componentDidMount() {
    this.getMoviesData();
  }

  onError = () => {
    this.setState({
      isLoading: false,
      isError: true,
    });
  };

  getMoviesData() {
    this.MovieDbService.getDataFromServer()
      .then((movies) => {
        movies.forEach((elm) => {
          this.addMovie(elm);
        });
      })
      .catch(this.onError);
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

  addMovie = (movie) => {
    const newMovie = this.createMovie(movie);
    this.setState(({ movieData }) => {
      const newMovieData = [...movieData, newMovie];
      return {
        movieData: newMovieData,
        isLoading: false,
      };
    });
  };

  render() {
    const { movieData, isLoading, isError } = this.state;

    const error = isError ? (
      <Alert message="Error" description="Что-то пошло не так. Пам пам пам" type="error" showIcon />
    ) : null;
    const cardMovieList =
      isLoading && !isError ? <Spin size="large" /> : <CardMovieList movieDataFromBase={movieData} />;

    return (
      <div className="App">
        <Header />
        {cardMovieList}
        {error}
      </div>
    );
  }
}
