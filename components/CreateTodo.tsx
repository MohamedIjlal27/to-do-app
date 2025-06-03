import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createTodoStyles } from '../styles/createTodo.styles';
import { TodoItem } from '../utils/storage';

interface CreateTodoProps {
  onCreateTodo: (todo: Omit<TodoItem, 'id' | 'completed' | 'timestamp'>) => void;
}

export const CreateTodo: React.FC<CreateTodoProps> = ({ onCreateTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { isDarkMode } = useTheme();

  const handleSubmit = () => {
    if (title.trim()) {
      onCreateTodo({
        title: title.trim(),
        description: description.trim(),
        isEdited: false,
      });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <View style={createTodoStyles.inputContainer}>
      <TextInput
        style={[
          createTodoStyles.input,
          { backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff' },
          { color: isDarkMode ? '#ffffff' : '#000000' }
        ]}
        placeholder="Add a new task"
        placeholderTextColor={isDarkMode ? '#888888' : '#666666'}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[
          createTodoStyles.input,
          { backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff' },
          { color: isDarkMode ? '#ffffff' : '#000000' }
        ]}
        placeholder="Add description (optional)"
        placeholderTextColor={isDarkMode ? '#888888' : '#666666'}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity
        style={[
          createTodoStyles.addButton,
          { opacity: title.trim() ? 1 : 0.5 }
        ]}
        onPress={handleSubmit}
        disabled={!title.trim()}
      >
        <Text style={createTodoStyles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}; 