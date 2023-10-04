import React from 'react';

import './CardMovieList.css';
import CardMovie from '../CardMovie';
import PropTypes from 'prop-types';

const CardMovieList = ({ movieDataFromBase, guestSessionId }) => (
  <div className="cardMovie-list">
    <CardMovie movieDataFromBase={movieDataFromBase} guestSessionId={guestSessionId} />
  </div>
);

CardMovieList.defaultProps = {
  movieDataFromBase: [],
  guestSessionId: '',
};
CardMovieList.propTypes = {
  movieDataFromBase: PropTypes.instanceOf(Array),
  guestSessionId: PropTypes.string,
};

export default CardMovieList;
