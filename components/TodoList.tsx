import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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

  const handleStartEdit = (todo: TodoItem) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const handleSaveEdit = () => {
    if (editingTodo && editTitle.trim()) {
      onEditTodo(editingTodo.id, {
        title: editTitle.trim(),
        description: editDescription.trim()
      });
      setEditingTodo(null);
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
          onPress={() => onDeleteTodo(id)}
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
        onRequestClose={() => setEditingTodo(null)}
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
            <TextInput
              style={[
                todoListStyles.editInput,
                { 
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                  color: isDarkMode ? '#ffffff' : '#000000' 
                }
              ]}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Title"
              placeholderTextColor={isDarkMode ? '#888888' : '#666666'}
            />
            <TextInput
              style={[
                todoListStyles.editInput,
                { 
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                  color: isDarkMode ? '#ffffff' : '#000000' 
                }
              ]}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Description"
              placeholderTextColor={isDarkMode ? '#888888' : '#666666'}
              multiline
            />
            <View style={todoListStyles.modalButtons}>
              <TouchableOpacity
                style={[todoListStyles.modalButton, todoListStyles.cancelButton]}
                onPress={() => setEditingTodo(null)}
              >
                <Text style={todoListStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  todoListStyles.modalButton, 
                  todoListStyles.saveButton,
                  { opacity: editTitle.trim() ? 1 : 0.5 }
                ]}
                onPress={handleSaveEdit}
                disabled={!editTitle.trim()}
              >
                <Text style={todoListStyles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
} 