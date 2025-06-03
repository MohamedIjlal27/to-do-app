import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { todoListStyles } from '../styles/todoList.styles';
import { TodoItem } from '../utils/storage';
import { EditTodoModal } from './EditTodoModal';

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
  const [deletingTodo, setDeletingTodo] = useState<TodoItem | null>(null);

  const handleStartEdit = (todo: TodoItem) => {
    setEditingTodo(todo);
  };

  const handleCloseEditModal = () => {
    setEditingTodo(null);
  };

  const handleConfirmDelete = () => {
    if (deletingTodo) {
      onDeleteTodo(deletingTodo.id);
      setDeletingTodo(null);
    }
  };

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

      <EditTodoModal
        todo={editingTodo}
        onClose={handleCloseEditModal}
        onSave={onEditTodo}
      />

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