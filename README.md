# React Dashboard Template - Auth Only

A modern React dashboard template with authentication module. Built with clean MVVM architecture, ready for customization.

## 🌟 Features

- **🔐 Authentication**: Complete login system with Firebase integration
- **🎨 Modern UI**: Built with Tailwind CSS + shadcn/ui components
- **🌙 Theme Support**: Dark/Light mode switching
- **📱 Responsive Design**: Optimized for all devices
- **🏗️ MVVM Architecture**: Clean separation of concerns
- **🔥 Firebase Ready**: Pre-configured Firebase authentication
- **📦 Type-Safe**: Full TypeScript support

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: React Context + Custom Hooks
- **Routing**: React Router v7
- **Form Handling**: React Hook Form + Zod validation
- **Authentication**: Firebase Auth
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Package Manager**: pnpm

## 🏗️ Project Structure

```
src/
├── app/
│   ├── config/           # App configuration (theme, menu)
│   ├── layouts/          # Layout components
│   ├── modules/
│   │   └── auth/         # Authentication module (MVVM)
│   │       ├── components/   # UI components
│   │       ├── hooks/        # Custom hooks
│   │       ├── models/       # Data models & schemas
│   │       ├── pages/        # Page components
│   │       ├── services/     # API services
│   │       ├── utils/        # Utility functions
│   │       └── viewmodels/   # Business logic
│   ├── shared/           # Shared components & contexts
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hocs/
│   │   └── hooks/
│   └── router.tsx        # Route configuration
├── components/ui/        # shadcn/ui components
├── lib/
│   ├── services/         # External services (Firebase)
│   └── utils.ts          # Utility functions
└── main.tsx             # App entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-dashboard-template
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure Firebase:
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication > Sign-in method > Email/Password
   - Copy your Firebase config to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Start development server:
```bash
pnpm dev
```

## 🔐 Authentication Module

The auth module follows MVVM architecture:

- **Models**: Data structures and validation schemas (Zod)
- **Views**: React components (Login form, inputs, etc.)
- **ViewModels**: Business logic and state management
- **Services**: Firebase authentication API calls

### Key Files:

- `src/app/modules/auth/pages/login.tsx` - Login page
- `src/app/modules/auth/viewmodels/login.viewmodel.ts` - Login business logic
- `src/app/modules/auth/services/auth.service.ts` - Auth API calls
- `src/app/modules/auth/models/auth.schema.ts` - Validation schemas
- `src/lib/services/firebase.ts` - Firebase configuration

## 📝 Adding New Modules

To add a new module (e.g., dashboard, users, etc.):

1. Create module directory:
```bash
mkdir -p src/app/modules/your-module/{components,hooks,models,pages,services,viewmodels}
```

2. Add routes in `src/app/router.tsx`
3. Add menu items in `src/app/config/menu.ts`
4. Follow the MVVM pattern from the auth module

## 🎨 Theming

Theme configuration is in `src/app/config/theme.ts`:

- Color palette (Primary, Secondary, etc.)
- Dark/Light mode support
- Responsive breakpoints

See `THEME_GUIDELINE.md` for detailed theming instructions.

## 📦 Build

Build for production:
```bash
pnpm build
```

Preview production build:
```bash
pnpm preview
```

## 🐳 Docker Support

Build Docker image:
```bash
docker build -t react-dashboard-template .
```

Run container:
```bash
docker run -p 3000:80 react-dashboard-template
```

## 📄 License

MIT
