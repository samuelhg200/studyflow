import React from 'react';
import { Platform } from 'react-native';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import { colorTheme } from "../data/products";
import { useSelector } from 'react-redux';


const CustomHeaderButton = props => {
  const colorThemeIndex = useSelector(state => state.product.colorTheme)
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={24}
      color={colorTheme[colorThemeIndex].source['color-primary-500']}

    />
  );
};

export default CustomHeaderButton;
