import React, { Component } from 'react';
import store from 'store';
import { Alert, Empty, Layout, Pagination, Space, Spin } from 'antd';
import { format, parseISO } from 'date-fns';

import { Context } from '../GenresMovie/GenresMovie';
import Header from '../Header';
import SearchPanel from '../SearchPanel';
import CardMovieList from '../CardMovieList';
import MovieDbService from '../../services/MovieDbService';

import './App.css';

export default class App extends Component {
  state = {
    movieData: [],
    ratedFilmData: [],
    genresList: [],
    isLoading: true,
    isError: false,
    notFound: false,
    searchQuery: '',
    numberPage: 1,
    totalPages: 0,
    guestSessionId: '',
    tabPane: '1',
  };

  componentDidMount() {
    if (!store.get('guestSessionId')) {
      this.createGuestSession();
    } else {
      this.setState({
        guestSessionId: store.get('guestSessionId'),
      });
    }

    this.getGenresList();
    this.getPopularMovies();
  }

  getGenresList = () => {
    const callMovieDbService = new MovieDbService();

    callMovieDbService
      .getGenersList()
      .then((body) => {
        this.setState({
          genresList: [...body.genres],
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

  createGuestSession = () => {
    const callMovieDbService = new MovieDbService();
    callMovieDbService
      .guestSession()
      .then((body) => {
        store.set('guestSessionId', `${body.guest_session_id}`);
        this.setState({
          guestSessionId: body.guest_session_id,
          isLoading: false,
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

  searchMoviesData = () => {
    const { searchQuery, numberPage } = this.state;
    const callMovieDbService = new MovieDbService();

    this.setState({
      movieData: [],
      isLoading: true,
      notFound: false,
      isError: false,
    });

    if (searchQuery === '') {
      this.getPopularMovies();
    } else {
      callMovieDbService
        .searchMoviesData(searchQuery, numberPage)
        .then((item) => {
          this.setState({
            // eslint-disable-next-line react/no-unused-state
            totalPages: item.total_pages,
            numberPage,
          });
          if (item.results.length === 0) {
            this.setState({
              isLoading: false,
              notFound: true,
            });
          }
          item.results.forEach((elm) => {
            this.addMovieToList(elm);
          });
        })
        .catch(() => {
          this.setState({
            isLoading: false,
            notFound: false,
            isError: true,
          });
        });
    }
  };

  getPopularMovies = () => {
    const { numberPage } = this.state;
    const callMovieDbService = new MovieDbService();
    this.setState({
      movieData: [],
      isLoading: true,
      notFound: false,
      isError: false,
    });

    callMovieDbService
      .getPopularMovies(numberPage)
      .then((item) => {
        this.setState({
          totalPages: item.total_pages,
          numberPage,
        });
        if (item.results.length === 0) {
          this.setState({
            isLoading: false,
            notFound: true,
          });
        }
        item.results.forEach((elm) => {
          this.addMovieToList(elm);
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

  getRatedMovies = () => {
    const { guestSessionId, numberPage } = this.state;
    const callMovieDbService = new MovieDbService();
    this.setState({
      ratedFilmData: [],
      isLoading: true,
      notFound: false,
      isError: false,
    });

    callMovieDbService
      .getRatedMovies(guestSessionId, numberPage)
      .then((item) => {
        this.setState({
          totalPages: item.total_pages,
          numberPage,
        });
        if (item.results.length === 0) {
          this.setState({
            isLoading: false,
            notFound: true,
          });
        }
        item.results.forEach((elm) => {
          this.addRatedMovie(elm);
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

  onInputChange = (searchQuery) => {
    this.setState(
      {
        searchQuery,
        numberPage: 1,
      },
      () => {
        this.searchMoviesData();
      }
    );
  };

  onTabChange = (key) => {
    if (key === '2') {
      this.setState(
        {
          tabPane: key,
          numberPage: 1,
        },
        () => {
          this.getRatedMovies();
        }
      );
    } else {
      this.setState(
        {
          notFound: false,
          tabPane: key,
          numberPage: 1,
        },
        () => {
          this.getPopularMovies();
        }
      );
    }
  };

  onPageChange = (page) => {
    const { tabPane } = this.state;
    this.setState(
      {
        numberPage: page,
      },
      () => {
        if (tabPane === '1') {
          this.searchMoviesData();
        } else {
          this.getRatedMovies();
        }
      }
    );
  };

  addMovieToList = (movie) => {
    const newMovie = this.createMovie(movie);
    this.setState(({ movieData }) => {
      const newMovieData = [...movieData, newMovie];
      return {
        movieData: newMovieData,
        isLoading: false,
      };
    });
  };

  addRatedMovie = (movie) => {
    const newMovie = this.createMovie(movie);

    this.setState(({ ratedFilmData }) => {
      const newMovieData = [...ratedFilmData, newMovie];
      return {
        ratedFilmData: newMovieData,
        isLoading: false,
      };
    });
  };

  getGenresFilm = (genresIds) => {
    const filmGenres = [];
    const { genresList } = this.state;
    for (let genreId of genresIds) {
      genresList.forEach((el) => {
        if (el.id === genreId) {
          filmGenres.push(el.name);
        }
      });
    }

    return filmGenres;
  };

  createMovie = (movie) => {
    const releaseDate = movie.release_date ? format(parseISO(movie.release_date), 'MMMM dd, yyyy') : 'no release date';
    const filmTitle = movie.title || 'Movie title not specified';
    const overview = movie.overview || 'Movie overview not specified';
    const popularity = movie.vote_average || 0;
    const rating = store.get(`${movie.id}`) || movie.rating || 0;

    let posterURL = `https://sun9-69.userapi.com/c11392/u50493878/-6/x_cea601e1.jpg`;
    if (movie.poster_path) {
      posterURL = `https://image.tmdb.org/t/p/w185${movie.poster_path}`;
    }

    const genres = this.getGenresFilm(movie.genre_ids);

    return {
      id: movie.id,
      filmTitle,
      posterURL,
      releaseDate,
      overview,
      popularity,
      rating,
      genres,
    };
  };

  onError = () => {
    this.setState({
      isLoading: false,
      isError: true,
    });
  };

  render() {
    const { Content } = Layout;
    const { movieData, isLoading, isError, notFound, totalPages, numberPage, guestSessionId, tabPane, ratedFilmData } =
      this.state;

    const error = isError ? (
      <Alert message="Error" description="Что-то пошло не так._. Пам пам пам.-." type="error" showIcon />
    ) : null;

    const foundMovies = notFound ? <Empty /> : <CardMovieList />;

    const spin = isLoading && !isError ? <Spin size="large" /> : null;

    const search = tabPane === '1' ? <SearchPanel onInputChange={this.onInputChange} /> : null;

    const pagination =
      totalPages > 0 && !isLoading ? (
        <Pagination
          defaultCurrent={1}
          current={numberPage}
          total={totalPages * 10}
          showSizeChanger={false}
          onChange={this.onPageChange}
        />
      ) : null;
    return (
      <div className="container">
        <Layout>
          <Context.Provider value={{ movieData, ratedFilmData, tabPane, guestSessionId }}>
            <Content>
              <Header onTabChange={this.onTabChange} />
              {search}
              <Space direction="vertical" align="center">
                {spin}
                {foundMovies}
                {error}
                {pagination}
              </Space>
            </Content>
          </Context.Provider>
        </Layout>
      </div>
    );
  }
}
