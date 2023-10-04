import React from 'react';

import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';

import './CardMovie.css';
import { Card, Tag, Typography } from 'antd';

const { Text } = Typography;

const CardMovie = ({ movieDataFromBase }) => {
  const listElements = movieDataFromBase.map((movie) => {
    const tag1 = 'Action';
    const tag2 = 'Drama';
    const { posterURL, id, filmTitle, releaseDate, overview } = movie;

    const releaseDateFormatted = format(parseISO(releaseDate), 'MMMM dd, yyyy');

    function truncate(numberSymbols, useWordBoundary) {
      if (this.length <= numberSymbols) {
        return this;
      }
      const subString = this.substring(0, numberSymbols - 1);
      return `${useWordBoundary ? subString.substring(0, subString.lastIndexOf(' ')) : subString}...`;
    }

    const overviewTruncated = truncate.apply(overview, [200, true]);

    return (
      <Card key={id} hoverable cover={<img alt="images" src={posterURL} />}>
        <div className="card-title">
          <p className="card-film-title">{filmTitle}</p>
        </div>
        <Text type="secondary">{releaseDateFormatted}</Text>
        <div>
          <Tag>{tag1}</Tag>
          <Tag>{tag2}</Tag>
        </div>
        <Text>{overviewTruncated}</Text>
      </Card>
    );
  });

  return listElements;
};
CardMovie.defaultProps = {
  movieDataFromBase: [],
};
CardMovie.propTypes = {
  movieDataFromBase: PropTypes.instanceOf(Array),
};

export default CardMovie;
