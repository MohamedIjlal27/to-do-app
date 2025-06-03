import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createTodoStyles } from '../styles/createTodo.styles';
import { TodoItem } from '../utils/storage';

interface CreateTodoModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (todo: Omit<TodoItem, 'id' | 'completed' | 'timestamp'>) => void;
}

export const CreateTodoModal: React.FC<CreateTodoModalProps> = ({
  isVisible,
  onClose,
  onSave,
}) => {
  const { isDarkMode } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);

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

  const handleSave = () => {
    const trimmedTitle = title.trim();
    
    if (validateTitle(trimmedTitle)) {
      onSave({
        title: trimmedTitle,
        description: description.trim(),
        isEdited: false,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setTitleError(null);
    onClose();
  };

  const isSubmitDisabled = !title.trim() || title.trim().length < 3;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={createTodoStyles.modalOverlay}>
        <View style={[
          createTodoStyles.modalContent,
          { backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff' }
        ]}>
          <Text style={[
            createTodoStyles.modalTitle,
            { color: isDarkMode ? '#ffffff' : '#000000' }
          ]}>
            Add New Todo
          </Text>
          
          <View style={createTodoStyles.inputContainer}>
            <View>
              <TextInput
                style={[
                  createTodoStyles.input,
                  titleError ? createTodoStyles.inputError : null,
                  { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
                  { color: isDarkMode ? '#ffffff' : '#000000' }
                ]}
                placeholder="Add a new task"
                placeholderTextColor={isDarkMode ? '#888888' : '#666666'}
                value={title}
                onChangeText={handleTitleChange}
                maxLength={50}
              />
              {titleError && (
                <Text style={createTodoStyles.errorText}>
                  {titleError}
                </Text>
              )}
            </View>

            <View>
              <TextInput
                style={[
                  createTodoStyles.input,
                  { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
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
          </View>

          <View style={createTodoStyles.buttonContainer}>
            <TouchableOpacity
              style={[createTodoStyles.button, createTodoStyles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={createTodoStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                createTodoStyles.button,
                createTodoStyles.addButton,
                { opacity: isSubmitDisabled ? 0.5 : 1 }
              ]}
              onPress={handleSave}
              disabled={isSubmitDisabled}
            >
              <Text style={createTodoStyles.buttonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 