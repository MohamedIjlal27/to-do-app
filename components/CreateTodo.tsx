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
  const [titleError, setTitleError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();

  const validateTitle = (text: string): boolean => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      setTitleError('Title is required');
      return false;
    } else if (trimmedText.length < 3) {
      setTitleError('Title must be at least 3 characters');
      return false;
    } else if (trimmedText.length > 50) {
      setTitleError('Title must be less than 50 characters');
      return false;
    } else {
      setTitleError(null);
      return true;
    }
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    validateTitle(text);
  };

  const handleDescriptionChange = (text: string) => {
    if (text.length <= 200) {
      setDescription(text);
    }
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    
    if (validateTitle(trimmedTitle)) {
      onCreateTodo({
        title: trimmedTitle,
        description: description.trim(),
        isEdited: false,
      });
      setTitle('');
      setDescription('');
      setTitleError(null);
    }
  };

  const isSubmitDisabled = !title.trim() || title.trim().length < 3;

  return (
    <View style={createTodoStyles.inputContainer}>
      <View>
        <TextInput
          style={[
            createTodoStyles.input,
            titleError ? createTodoStyles.inputError : null,
            { backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff' },
            { color: isDarkMode ? '#ffffff' : '#000000' }
          ]}
          placeholder="Add a new task"
          placeholderTextColor={isDarkMode ? '#888888' : '#666666'}
          value={title}
          onChangeText={handleTitleChange}
          maxLength={50}
        />
        {titleError && (
          <Text style={[
            createTodoStyles.errorText,
            { color: '#FF5252' }
          ]}>
            {titleError}
          </Text>
        )}
      </View>
      <View>
        <TextInput
          style={[
            createTodoStyles.input,
            { backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff' },
            { color: isDarkMode ? '#ffffff' : '#000000' }
          ]}
          placeholder="Add description (optional, max 200 characters)"
          placeholderTextColor={isDarkMode ? '#888888' : '#666666'}
          value={description}
          onChangeText={handleDescriptionChange}
          multiline
          maxLength={200}
        />
        {description.length > 150 && (
          <Text style={[
            createTodoStyles.characterCount,
            { color: description.length >= 200 ? '#FF5252' : (isDarkMode ? '#888888' : '#666666') }
          ]}>
            {`${description.length}/200 characters`}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={[
          createTodoStyles.addButton,
          { opacity: isSubmitDisabled ? 0.5 : 1 }
        ]}
        onPress={handleSubmit}
        disabled={isSubmitDisabled}
      >
        <Text style={createTodoStyles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}; 