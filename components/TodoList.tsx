import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { todoListStyles } from '../styles/todoList.styles';
import { TodoItem } from '../utils/storage';

interface TodoListProps {
  todos: TodoItem[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, updates: { title: string; description: string }) => void;
}

export default function TodoList({ 
  todos, 
  onToggleTodo, 
  onDeleteTodo,
  onEditTodo 
}: TodoListProps) {
  const { isDarkMode } = useTheme();
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTitleError, setEditTitleError] = useState<string | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<TodoItem | null>(null);

  useEffect(() => {
    if (editTitle) {
      validateEditTitle(editTitle);
    }
  }, [editTitle]);

  const handleStartEdit = (todo: TodoItem) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditTitleError(null);
  };

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
    if (editingTodo) {
      const trimmedTitle = editTitle.trim();
      
      if (validateEditTitle(trimmedTitle)) {
        onEditTodo(editingTodo.id, {
          title: trimmedTitle,
          description: editDescription.trim()
        });
        handleCloseModal();
      }
    }
  };

  const handleCloseModal = () => {
    setEditingTodo(null);
    setEditTitle('');
    setEditDescription('');
    setEditTitleError(null);
  };

  const handleConfirmDelete = () => {
    if (deletingTodo) {
      onDeleteTodo(deletingTodo.id);
      setDeletingTodo(null);
    }
  };

  const isEditSaveDisabled = !editTitle.trim() || editTitle.trim().length < 3;

  const renderTodoItem = (todo: TodoItem) => {
    const { id, title, description, completed, timestamp } = todo;

    return (
      <View 
        key={id}
        style={[
          todoListStyles.todoContainer,
          { backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff' }
        ]}
      >
        <TouchableOpacity
          style={todoListStyles.todoContent}
          onPress={() => onToggleTodo(id)}
        >
          <View style={todoListStyles.checkboxContainer}>
            <Ionicons
              name={completed ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={completed ? '#4CAF50' : (isDarkMode ? '#ffffff' : '#000000')}
            />
          </View>
          <TouchableOpacity 
            style={todoListStyles.textContainer}
            onPress={() => handleStartEdit(todo)}
          >
            <Text style={[
              todoListStyles.title,
              { textDecorationLine: completed ? 'line-through' : 'none' },
              { color: isDarkMode ? '#ffffff' : '#000000' }
            ]}>
              {title}
            </Text>
            <Text style={[
              todoListStyles.description,
              { color: isDarkMode ? '#cccccc' : '#666666' }
            ]}>
              {description}
            </Text>
            <View style={todoListStyles.timestampContainer}>
              <Text style={todoListStyles.timestamp}>{timestamp}</Text>
              {todo.isEdited && (
                <Text style={[
                  todoListStyles.editedText,
                  { color: isDarkMode ? '#888888' : '#666666' }
                ]}>
                  • Edited
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          style={todoListStyles.deleteButton}
          onPress={() => setDeletingTodo(todo)}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color="#FF5252"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <ScrollView style={todoListStyles.todoList}>
        {todos.map(renderTodoItem)}
      </ScrollView>

      <Modal
        visible={editingTodo !== null}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
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
                onPress={handleCloseModal}
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
                <Text style={todoListStyles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deletingTodo !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDeletingTodo(null)}
      >
        <View style={todoListStyles.modalOverlay}>
          <View style={[
            todoListStyles.modalContent,
            todoListStyles.deleteModalContent,
            { backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff' }
          ]}>
            <Ionicons
              name="alert-circle-outline"
              size={40}
              color="#FF5252"
              style={todoListStyles.deleteIcon}
            />
            <Text style={[
              todoListStyles.modalTitle,
              { color: isDarkMode ? '#ffffff' : '#000000' }
            ]}>
              Delete Todo
            </Text>
            <Text style={[
              todoListStyles.deleteMessage,
              { color: isDarkMode ? '#cccccc' : '#666666' }
            ]}>
              Are you sure you want to delete this todo?
            </Text>
            <Text style={[
              todoListStyles.deleteTodoTitle,
              { color: isDarkMode ? '#ffffff' : '#000000' }
            ]}>
              "{deletingTodo?.title}"
            </Text>
            <View style={todoListStyles.modalButtons}>
              <TouchableOpacity
                style={[todoListStyles.modalButton, todoListStyles.cancelButton]}
                onPress={() => setDeletingTodo(null)}
              >
                <Text style={todoListStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[todoListStyles.modalButton, todoListStyles.deleteConfirmButton]}
                onPress={handleConfirmDelete}
              >
                <Text style={todoListStyles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
} 