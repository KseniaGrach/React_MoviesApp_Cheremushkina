import React, { Component } from 'react';
import { Alert, Empty, Pagination, Space, Spin } from 'antd';
import { format, parseISO } from 'date-fns';

import Header from '../Header';
import SearchPanel from '../SearchPanel';
import CardMovieList from '../CardMovieList';
import MovieDbService from '../../services/MovieDbService';

import './App.css';

export default class App extends Component {
  state = {
    movieData: [],
    isLoading: true,
    isError: false,
    notFound: false,
    searchQuery: 'Good day',
    numberPage: 1,
    totalPages: 1,
  };

  MovieDbService = new MovieDbService();

  componentDidMount() {
    this.getMoviesData();
  }

  onInputChange = (searchQuery) => {
    this.setState(
      {
        searchQuery,
        numberPage: 1,
      },
      () => {
        this.getMoviesData();
      }
    );
  };

  onPageChange = (page) => {
    this.setState(
      {
        numberPage: page,
      },
      () => {
        this.getMoviesData();
      }
    );
  };

  getMoviesData = () => {
    const { searchQuery, numberPage } = this.state;
    const callMovieDbService = new MovieDbService();

    this.setState({
      movieData: [],
      isLoading: true,
      notFound: false,
      isError: false,
    });

    callMovieDbService
      .getMovies(searchQuery, numberPage)
      .then((movies) => {
        this.setState({
          totalPages: movies.total_pages,
          numberPage,
        });
        if (movies.results.length === 0) {
          this.setState({
            isLoading: false,
            notFound: true,
          });
        }
        movies.results.forEach((elm) => {
          this.addMovie(elm);
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          notFound: false,
          isError: true,
        });
      });
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

  createMovie = (movie) => {
    const releaseDate = movie.release_date ? format(parseISO(movie.release_date), 'MMMM dd, yyyy') : 'no release date';
    const filmTitle = movie.title || 'Movie title not specified';
    const overview = movie.overview || 'Movie overview not specified';
    const popularity = movie.popularity || -0;

    let posterURL = `https://sun9-69.userapi.com/c11392/u50493878/-6/x_cea601e1.jpg`;
    if (movie.poster_path) {
      posterURL = `https://image.tmdb.org/t/p/w185${movie.poster_path}`;
    }
    return {
      id: movie.id,
      filmTitle,
      posterURL,
      releaseDate,
      overview,
      popularity,
    };
  };

  onError = () => {
    this.setState({
      isLoading: false,
      isError: true,
    });
  };

  render() {
    const { movieData, isLoading, isError, notFound, totalPages, numberPage } = this.state;

    const error = isError ? (
      <Alert message="Error" description="Что-то пошло не так. Пам пам пам" type="error" showIcon />
    ) : null;
    const notFoundMovies = notFound ? <Empty /> : null;
    const cardMovieList =
      isLoading && !isError ? <Spin size="large" /> : <CardMovieList movieDataFromBase={movieData} />;

    return (
      <div className="App">
        <Header />
        <SearchPanel onInputChange={this.onInputChange} />
        <Space direction="vertical" className="app" align="center">
          {cardMovieList}
          {notFoundMovies}
          {error}
          <Pagination defaultCurrent={1} current={numberPage} total={totalPages * 10} onChange={this.onPageChange} />
        </Space>
      </div>
    );
  }
}
