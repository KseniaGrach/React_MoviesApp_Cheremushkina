import React from 'react';
import { Tabs } from 'antd';

import PropTypes from 'prop-types';

import './Header.css';

const Header = ({ onTabChange }) => {
  const items = [
    {
      key: '1',
      label: 'Search',
    },
    {
      key: '2',
      label: 'Rated',
    },
  ];

  return (
    <div className="header">
      <Tabs defaultActiveKey="1" items={items} onChange={onTabChange} />
    </div>
  );
};

Header.defaultProps = {
  onTabChange: () => {},
};

Header.propTypes = {
  onTabChange: PropTypes.func,
};

export default Header;
