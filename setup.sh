#!/bin/bash

# Navigate to your existing repository location
cd /Users/andrewlawson/development/encorelando

# Create directories (only if they don't already exist)
mkdir -p .github/workflows
mkdir -p docs
mkdir -p public
mkdir -p src/{assets,components/{common,layout,ui},context,hooks,pages,services,styles,utils}
mkdir -p functions/{api,utils}
mkdir -p .vscode

# Create GitHub Actions workflow file for CI
cat > .github/workflows/ci.yml << 'EOF'
name: Continuous Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Run tests
        run: npm test
EOF

# Copy documentation files if they're not already in the docs directory
if [ ! -f "docs/Overview & Requirements.md" ]; then
  # Assuming these files exist in the parent directory or elsewhere accessible
  # Adjust the source paths if needed
  cp "../Overview & Requirements.md" docs/ 2>/dev/null || echo "Could not find Overview & Requirements.md"
  cp "../Technical Architecture.md" docs/ 2>/dev/null || echo "Could not find Technical Architecture.md"
  cp "../Development Roadmap.md" docs/ 2>/dev/null || echo "Could not find Development Roadmap.md"
  cp "../Data Management Strategy.md" docs/ 2>/dev/null || echo "Could not find Data Management Strategy.md"
fi

# Create basic HTML files if they don't exist
if [ ! -f "public/index.html" ]; then
  cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="EncoreLando - Orlando Theme Park Concert Tracker"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>EncoreLando</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF
fi

# Create manifest.json
if [ ! -f "public/manifest.json" ]; then
  cat > public/manifest.json << 'EOF'
{
  "short_name": "EncoreLando",
  "name": "EncoreLando - Orlando Concert Tracker",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
EOF
fi

# Create robots.txt
if [ ! -f "public/robots.txt" ]; then
  cat > public/robots.txt << 'EOF'
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
EOF
fi

# Create React files if they don't exist
if [ ! -f "src/index.jsx" ]; then
  cat > src/index.jsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
fi

if [ ! -f "src/App.jsx" ]; then
  cat > src/App.jsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
EOF
fi

if [ ! -f "src/routes.jsx" ]; then
  cat > src/routes.jsx << 'EOF'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default AppRoutes;
EOF
fi

# Create a placeholder HomePage
mkdir -p src/pages
if [ ! -f "src/pages/HomePage.jsx" ]; then
  cat > src/pages/HomePage.jsx << 'EOF'
import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to EncoreLando</h1>
      <p className="text-center text-lg mb-4">
        Your comprehensive source for Orlando theme park concerts and performances
      </p>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <p className="text-center">
          Coming soon! We're building a platform to help you discover and track all the amazing live
          performances happening at Orlando's theme parks.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
EOF
fi

# Create basic CSS files
mkdir -p src/styles
if [ ! -f "src/styles/index.css" ]; then
  cat > src/styles/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOF
fi

if [ ! -f "src/styles/App.css" ]; then
  cat > src/styles/App.css << 'EOF'
.App {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
EOF
fi

# Create configuration files
cat > netlify.toml << 'EOF'
[build]
  command = "npm run build"
  publish = "build"
  functions = "functions"

# Production context
[context.production]
  environment = { NODE_ENV = "production" }

# Deploy Preview context
[context.deploy-preview]
  environment = { NODE_ENV = "production" }

# Branch Deploy context
[context.branch-deploy]
  environment = { NODE_ENV = "production" }

# Dev context
[context.develop]
  environment = { NODE_ENV = "development" }

# Redirects for SPA
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da6ff',
          DEFAULT: '#0077cc',
          dark: '#005299',
        },
        secondary: {
          light: '#ffb84d',
          DEFAULT: '#ff9900',
          dark: '#cc7a00',
        },
      },
    },
  },
  plugins: [],
}
EOF

cat > .eslintrc.js << 'EOF'
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/prop-types': 'warn',
    'no-unused-vars': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
EOF

cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
EOF

# Create VS Code settings
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "javascriptreact"],
  "prettier.singleQuote": true,
  "prettier.trailingComma": "es5",
  "prettier.tabWidth": 2,
  "prettier.semi": true,
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "javascriptreact": "javascriptreact"
  },
  "tailwindCSS.emmetCompletions": true
}
EOF

cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "github.vscode-pull-request-github",
    "eamodio.gitlens"
  ]
}
EOF

# Update or create package.json
if [ ! -f "package.json" ]; then
  cat > package.json << 'EOF'
{
  "name": "encorelando",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.10.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\"",
    "netlify:dev": "netlify dev"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "eslint": "^8.38.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "netlify-cli": "^14.2.1",
    "postcss": "^8.4.23",
    "prettier": "^2.8.7",
    "tailwindcss": "^3.3.1"
  }
}
EOF
else
  echo "package.json already exists. You may need to update it manually."
fi

# Create sample Netlify function
mkdir -p functions/api
cat > functions/api/hello.js << 'EOF'
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from EncoreLando API!" }),
  };
};
EOF

echo "Initial project structure has been set up!"
echo "Next steps:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Install VS Code extensions as recommended in .vscode/extensions.json"
echo "3. Login to GitHub and Netlify using the respective CLIs"