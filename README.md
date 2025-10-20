# React Dashboard Template

A modern React dashboard template with authentication module and professional business theme. Built with clean MVVM architecture, ready for customization.

## 🌟 Features

- **🔐 Authentication**: Complete login system with Firebase integration
- **🎨 Modern UI**: Built with Tailwind CSS + shadcn/ui components
- **🌙 Theme Support**: Dark/Light mode with professional blue color scheme
- **📱 Responsive Design**: Optimized for all devices
- **🏗️ MVVM Architecture**: Clean separation of concerns
- **🔥 Firebase Ready**: Pre-configured Firebase authentication with user-friendly setup UI
- **📦 Type-Safe**: Full TypeScript support
- **⚡ Setup Friendly**: Clear error messages and setup instructions when Firebase is not configured

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

4. Start development server:
```bash
pnpm dev
```

5. Configure Firebase:
   - When you first run the app, you'll see a user-friendly setup screen
   - Follow the on-screen instructions to configure Firebase
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

6. Restart the development server after adding Firebase configuration

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
- `src/app/shared/components/firebase-setup-required.tsx` - Setup UI component

### Firebase Setup UI

The template includes a user-friendly setup screen that appears when Firebase is not configured:

- Detects missing Firebase environment variables
- Displays step-by-step setup instructions
- Provides direct links to Firebase Console
- Shows example `.env` configuration
- Copy-to-clipboard functionality for easy setup

This ensures new users have a smooth onboarding experience instead of cryptic error messages.

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

The template uses a professional business theme with blue as the primary color.

### Theme Configuration

Theme configuration is in:
- **CSS Variables**: `src/index.css` - Contains all color definitions in OKLCH format
- **Theme Object**: `src/app/config/theme.ts` - Color palette constants

### Color Scheme

**Light Mode:**
- Primary: Professional Blue (`oklch(0.5 0.15 250)`)
- Secondary: Slate Gray
- Radius: 0.5rem (slightly rounded corners)

**Dark Mode:**
- Primary: Brighter Blue (`oklch(0.6 0.18 250)`)
- Background: Dark slate
- Proper contrast for readability

### Customizing Colors

To change the theme colors:
1. Edit CSS variables in `src/index.css` (lines 43-182)
2. Update the theme object in `src/app/config/theme.ts`
3. Both light and dark modes can be customized independently

### Available Utility Classes

- `.status-active`, `.status-pending`, `.status-error`, `.status-info`, `.status-neutral`
- `.bg-business-gradient`, `.bg-business-gradient-dark`
- `.card-hover` - Smooth hover effects for cards
- `.glass`, `.glass-dark` - Glass morphism effects

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
