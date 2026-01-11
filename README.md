# Kanban Board (React + TypeScript)

A clean and responsive Kanban Board application built using **React** and **TypeScript**.  
It helps manage tasks across three columns: **Todo**, **In Progress**, and **Done**.

## 🚀 Features

- Add new cards to any column  
- Delete existing cards  
- Edit card titles  
- Responsive layout (mobile & desktop)  
- Clean and colorful UI  
- Component-based structure (Board → Column → Card)  

## 🛠 Tech Stack

- React  
- TypeScript  
- Vite  
- CSS  

## 📂 Project Structure

kanban-board/
├── dist/                   # Build output (after npm run build)
├── node_modules/           # Dependencies
├── public/                 # Static assets
├── src/
│   ├── components/         # Kanban Components
│   │   ├── Card.tsx        # Single Draggable Card
│   │   ├── Column.tsx      # Droppable Column
│   │   └── KanbanBoard.tsx # Main Board Container (DnD Context)
│   ├── assets/             # Images/Icons
│   ├── App.css             # Main Styling (Global + Component Styles)
│   ├── App.tsx             # Root Component with Footer
│   ├── index.css           # Base Reset Styles
│   ├── main.tsx            # Entry Point
│   └── types.ts            # TypeScript Interfaces (ColumnType, CardType)
├── .gitignore
├── index.html              # HTML Entry Point
├── package.json            # Project Dependencies & Scripts
├── tsconfig.json           # TypeScript Configuration
└── vite.config.ts          # Vite Configuration
