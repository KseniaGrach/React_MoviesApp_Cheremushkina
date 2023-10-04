import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import './SearchPanel.css';
// eslint-disable-next-line no-unused-vars
import debounce from 'lodash.debounce';

export default class SearchPanel extends Component {
  static defaultProps = {
    onInputChange: () => {},
  };

  static propTypes = {
    onInputChange: PropTypes.func,
  };

  onSearch = (event) => {
    const { onInputChange } = this.props;
    const trimUserRequest = event.target.value.replace(/ +/g, ' ').trim();

    if (trimUserRequest !== '') {
      onInputChange(trimUserRequest);
    }
  };

  render() {
    return <Input placeholder="Type to search..." size="large" onChange={debounce(this.onSearch, 1000)} />;
  }
}
