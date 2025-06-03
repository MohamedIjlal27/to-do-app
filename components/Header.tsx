import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { headerStyles } from '../styles/header.styles';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <View style={headerStyles.header}>
      <Text style={[
        headerStyles.title,
        { color: isDarkMode ? '#ffffff' : '#000000' }
      ]}>
        {title}
      </Text>
      <TouchableOpacity onPress={toggleTheme} style={headerStyles.themeToggle}>
        <Ionicons
          name={isDarkMode ? 'sunny' : 'moon'}
          size={24}
          color={isDarkMode ? '#ffffff' : '#000000'}
        />
      </TouchableOpacity>
    </View>
  );
}; 