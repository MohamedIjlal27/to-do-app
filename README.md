# Todo App with React Native & Expo 📝

A modern, feature-rich Todo application built with React Native and Expo, featuring a beautiful UI with dark/light theme support.

## Features ✨

- **Complete Todo Management**
  - Create todos with title and description
  - Edit existing todos
  - Mark todos as complete/incomplete
  - Delete todos
  - Timestamp tracking with "Edited" indicator

- **Modern UI/UX**
  - Dark/light theme support
  - System theme detection
  - Beautiful animations and transitions
  - Responsive keyboard handling
  - Clean and intuitive interface

- **Data Persistence**
  - Automatic saving of todos
  - Persists across app restarts
  - Efficient AsyncStorage implementation

## Tech Stack 🛠

- React Native
- Expo
- TypeScript
- AsyncStorage
- React Context API
- Expo Vector Icons

## Getting Started 🚀

1. Clone the repository
   ```bash
   git clone [your-repo-url]
   cd todo-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

## Project Structure 📁

```
todo-app/
├── app/                   # App directory (Expo Router)
│   ├── screens/          # Screen components
│   └── _layout.tsx       # Root layout
├── components/           # Reusable components
│   ├── CreateTodo.tsx
│   ├── Header.tsx
│   └── TodoList.tsx
├── context/             # React Context
│   └── ThemeContext.tsx
├── styles/             # Component styles
│   ├── createTodo.styles.ts
│   ├── header.styles.ts
│   ├── todoList.styles.ts
│   └── todoScreen.styles.ts
└── utils/              # Utility functions
    └── storage.ts
```

## Features in Detail 🔍

### Todo Management
- Create new todos with title and optional description
- Edit existing todos with full update capability
- Mark todos as complete/incomplete with visual feedback
- Delete unwanted todos
- Automatic timestamp tracking
- "Edited" indicator for modified todos

### Theme Support
- Automatic system theme detection
- Manual theme toggle with sun/moon icons
- Consistent theming across all components
- Smooth theme transitions

### Data Persistence
- Automatic saving of todos using AsyncStorage
- Efficient data loading on app start
- Error handling for storage operations

## Contributing 🤝

Feel free to open issues and pull requests for any improvements you want to add.

## License 📄

MIT License - feel free to use this project for your own learning or as a base for your todo app.
