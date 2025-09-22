# Study Share - Academic Collaboration Platform

A modern web application built with React, TypeScript, and Tailwind CSS for academic collaboration, note sharing, and timetable management.

## Features

- **User Authentication**: Login and signup functionality
- **Dashboard**: Centralized view of academic activities
- **Timetable Management**: Create and manage class schedules
- **Note Sharing**: Collaborate on academic materials
- **Assignment Tracking**: Keep track of assignments and deadlines

## Technologies Used

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_REPO_URL>
cd collab-hive-71
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── landing/        # Landing page components
│   ├── layout/         # Layout components
│   ├── timetable/      # Timetable-related components
│   └── ui/             # Base UI components (shadcn/ui)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── main.tsx           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.