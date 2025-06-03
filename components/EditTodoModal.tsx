import React, { useEffect, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { todoListStyles } from '../styles/todoList.styles';
import { TodoItem } from '../utils/storage';

interface EditTodoModalProps {
  todo: TodoItem | null;
  onClose: () => void;
  onSave: (id: string, updates: { title: string; description: string }) => void;
}

export const EditTodoModal: React.FC<EditTodoModalProps> = ({
  todo,
  onClose,
  onSave,
}) => {
  const { isDarkMode } = useTheme();
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTitleError, setEditTitleError] = useState<string | null>(null);

  useEffect(() => {
    if (todo) {
      setEditTitle(todo.title);
      setEditDescription(todo.description);
      setEditTitleError(null);
    }
  }, [todo]);

  useEffect(() => {
    if (editTitle) {
      validateEditTitle(editTitle);
    }
  }, [editTitle]);

  const validateEditTitle = (text: string): boolean => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      setEditTitleError('Title is required');
      return false;
    } else if (trimmedText.length < 3) {
      setEditTitleError('Title must be at least 3 characters');
      return false;
    } else if (trimmedText.length > 50) {
      setEditTitleError('Title must be less than 50 characters');
      return false;
    } else {
      setEditTitleError(null);
      return true;
    }
  };

  const handleEditTitleChange = (text: string) => {
    setEditTitle(text);
    validateEditTitle(text);
  };

  const handleEditDescriptionChange = (text: string) => {
    if (text.length <= 200) {
      setEditDescription(text);
    }
  };

  const handleSaveEdit = () => {
    if (todo) {
      const trimmedTitle = editTitle.trim();
      
      if (validateEditTitle(trimmedTitle)) {
        onSave(todo.id, {
          title: trimmedTitle,
          description: editDescription.trim()
        });
        onClose();
      }
    }
  };

  const isEditSaveDisabled = !editTitle.trim() || editTitle.trim().length < 3;

  return (
    <Modal
      visible={todo !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={todoListStyles.modalOverlay}>
        <View style={[
          todoListStyles.modalContent,
          { backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff' }
        ]}>
          <Text style={[
            todoListStyles.modalTitle,
            { color: isDarkMode ? '#ffffff' : '#000000' }
          ]}>
            Edit Todo
          </Text>
          <View>
            <TextInput
              style={[
                todoListStyles.editInput,
                editTitleError ? todoListStyles.inputError : null,
                { 
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                  color: isDarkMode ? '#ffffff' : '#000000' 
                }
              ]}
              value={editTitle}
              onChangeText={handleEditTitleChange}
              placeholder="Title"
              placeholderTextColor={isDarkMode ? '#888888' : '#666666'}
              maxLength={50}
            />
            {editTitleError && (
              <Text style={[
                todoListStyles.errorText,
                { color: '#FF5252' }
              ]}>
                {editTitleError}
              </Text>
            )}
          </View>
          <View>
            <TextInput
              style={[
                todoListStyles.editInput,
                { 
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                  color: isDarkMode ? '#ffffff' : '#000000' 
                }
              ]}
              value={editDescription}
              onChangeText={handleEditDescriptionChange}
              placeholder="Description (optional, max 200 characters)"
              placeholderTextColor={isDarkMode ? '#888888' : '#666666'}
              multiline
              maxLength={200}
            />
            {editDescription.length > 150 && (
              <Text style={[
                todoListStyles.characterCount,
                { color: editDescription.length >= 200 ? '#FF5252' : (isDarkMode ? '#888888' : '#666666') }
              ]}>
                {`${editDescription.length}/200 characters`}
              </Text>
            )}
          </View>
          <View style={todoListStyles.modalButtons}>
            <TouchableOpacity
              style={[todoListStyles.modalButton, todoListStyles.cancelButton]}
              onPress={onClose}
            >
              <Text style={todoListStyles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                todoListStyles.modalButton, 
                todoListStyles.saveButton,
                { opacity: isEditSaveDisabled ? 0.5 : 1 }
              ]}
              onPress={handleSaveEdit}
              disabled={isEditSaveDisabled}
            >
              <Text style={todoListStyles.modalButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 