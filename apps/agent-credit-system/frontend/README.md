# Nexi Dashboard React

A modern React SPA for the Nexi Dashboard, providing a user-friendly interface to manage clinic configurations and view conversations.

## Features

- View and search clinic configurations
- View detailed clinic information
- Toggle clinic active status
- View and search conversations for each clinic
- View detailed conversation messages

## Tech Stack

- React 18
- React Router v6
- Axios for API requests
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```
   cd apps/agent-credit-system-react
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Configuration

Create a `.env` file in the project root with the following variables:

```
REACT_APP_API_URL=http://localhost:8020
```

Adjust the URL to match your backend API endpoint.

### Running the Development Server

```
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

```
npm run build
```

This will create an optimized production build in the `build` folder.

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components for different routes
- `src/services/` - API services for data fetching
- `src/utils/` - Utility functions
- `src/context/` - React context providers (if needed)

## API Integration

The application communicates with the Nexi Dashboard backend API. The API service is configured in `src/services/api.js`.
