import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  timestamp: string;
  isEdited: boolean;
}

const STORAGE_KEY = '@todo_items';

export const saveTodos = async (todos: TodoItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos:', error);
  }
};

export const loadTodos = async (): Promise<TodoItem[]> => {
  try {
    const todosString = await AsyncStorage.getItem(STORAGE_KEY);
    return todosString ? JSON.parse(todosString) : [];
  } catch (error) {
    console.error('Error loading todos:', error);
    return [];
  }
}; 