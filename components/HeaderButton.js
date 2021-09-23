import React from 'react';
import { Platform } from 'react-native';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import CustomTheme from '../assets/UIkitten/custom-theme.json';

const CustomHeaderButton = props => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={27}
      color={CustomTheme['color-primary-500']}

    />
  );
};

export default CustomHeaderButton;
