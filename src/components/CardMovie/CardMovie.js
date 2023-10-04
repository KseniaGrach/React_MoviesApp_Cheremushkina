import React, { useContext } from 'react';

import PropTypes from 'prop-types';

import './CardMovie.css';
import { Card, Tag, Typography } from 'antd';
import RateStars from '../RateMovie';
import { Context } from '../GenresMovie/GenresMovie';

const CardMovie = () => {
  const { Text } = Typography;

  const { movieData, ratedFilmData, tabPane, guestSessionId } = useContext(Context);
  const movieDataFromBase = tabPane === '1' ? movieData : ratedFilmData;

  const listElements = movieDataFromBase.map((movie) => {
    const { posterURL, id, filmTitle, releaseDate, overview, popularity, rating, genres } = movie;

    function truncate(numberSymbols, useWordBoundary) {
      if (this.length <= numberSymbols) {
        return this;
      }
      const subString = this.substring(0, numberSymbols - 1);
      return `${useWordBoundary ? subString.substring(0, subString.lastIndexOf(' ')) : subString}...`;
    }

    const overviewTruncated = truncate.apply(overview, [200, true]);

    const inputClasses = ['card-popularity-count'];
    if (popularity >= 3 && popularity < 5) {
      inputClasses.push('orange');
    }
    if (popularity >= 5 && popularity < 7) {
      inputClasses.push('yellow');
    }
    if (popularity >= 7) {
      inputClasses.push('green');
    }

    const filmGenres = (
      <div>
        {genres.map((genre) => {
          return (
            <Tag className="card-genres-tag" key={genre}>
              {genre}
            </Tag>
          );
        })}
      </div>
    );

    return (
      <Card hoverable key={id}>
        <img className="card-img" alt={`poster ${filmTitle}`} src={posterURL} />

        <div className="card-movie-title">{filmTitle}</div>
        <span className={inputClasses.join(' ')}>{popularity.toFixed(1)}</span>

        <Text type="secondary" className="card-release-date">
          {releaseDate}
        </Text>
        <div className="card-tags">{filmGenres}</div>
        <Text className="card-overview">{overviewTruncated}</Text>
        <RateStars id={id} guestSessionId={guestSessionId} rating={rating} />
      </Card>
    );
  });

  return listElements;
};
CardMovie.defaultProps = {
  movieDataFromBase: [],
  guestSessionId: '',
};
CardMovie.propTypes = {
  movieDataFromBase: PropTypes.instanceOf(Array),
  guestSessionId: PropTypes.string,
};

export default CardMovie;
