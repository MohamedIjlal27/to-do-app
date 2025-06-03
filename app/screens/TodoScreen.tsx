import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { CreateTodo } from '../../components/CreateTodo';
import { Header } from '../../components/Header';
import TodoList from '../../components/TodoList';
import { useTheme } from '../../context/ThemeContext';
import { todoScreenStyles } from '../../styles/todoScreen.styles';
import { TodoItem, loadTodos, saveTodos } from '../../utils/storage';

export default function TodoScreen() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadSavedTodos();
  }, []);

  const loadSavedTodos = async () => {
    const savedTodos = await loadTodos();
    setTodos(savedTodos);
  };

  const handleCreateTodo = async (newTodo: Omit<TodoItem, 'id' | 'completed' | 'timestamp' | 'isEdited'>) => {
    const todoToAdd: TodoItem = {
      ...newTodo,
      id: Date.now().toString(),
      completed: false,
      timestamp: new Date().toLocaleString(),
      isEdited: false,
    };

    const updatedTodos = [...todos, todoToAdd];
    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
  };

  const handleToggleTodo = async (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
  };

  const handleDeleteTodo = async (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
  };

  const handleEditTodo = async (id: string, updates: { title: string; description: string }) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? {
        ...todo,
        ...updates,
        timestamp: new Date().toLocaleString(),
        isEdited: true
      } : todo
    );
    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
  };

  return (
    <View style={[
      todoScreenStyles.container,
      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }
    ]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Header title="Todo List" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={todoScreenStyles.content}
      >
        <TodoList
          todos={todos}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          onEditTodo={handleEditTodo}
        />
        <CreateTodo onCreateTodo={handleCreateTodo} />
      </KeyboardAvoidingView>
    </View>
  );
} 