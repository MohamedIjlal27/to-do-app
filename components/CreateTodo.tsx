import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createTodoStyles } from '../styles/createTodo.styles';
import { TodoItem } from '../utils/storage';
import { CreateTodoModal } from './CreateTodoModal';

interface CreateTodoProps {
  onCreateTodo: (todo: Omit<TodoItem, 'id' | 'completed' | 'timestamp'>) => void;
}

export const CreateTodo: React.FC<CreateTodoProps> = ({ onCreateTodo }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <>
      <TouchableOpacity
        style={[
          createTodoStyles.fab,
          { backgroundColor: isDarkMode ? '#007AFF' : '#007AFF' }
        ]}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#ffffff" />
      </TouchableOpacity>

      <CreateTodoModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={onCreateTodo}
      />
    </>
  );
}; 