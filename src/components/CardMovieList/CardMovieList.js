import React from 'react';

import './CardMovieList.css';
import CardMovie from '../CardMovie';
import PropTypes from 'prop-types';

const CardMovieList = ({ movieDataFromBase }) => (
  <div className="cardMovie-list">
    <CardMovie movieDataFromBase={movieDataFromBase} />
  </div>
);

CardMovieList.defaultProps = {
  movieDataFromBase: [],
};
CardMovieList.propTypes = {
  movieDataFromBase: PropTypes.instanceOf(Array),
};

export default CardMovieList;
