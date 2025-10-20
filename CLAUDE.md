# 🤖 Claude AI - Project Knowledge Base

> **Purpose**: This document serves as the central knowledge hub for Claude AI to understand and work with this React Dashboard Template project. It contains all essential information, guidelines, and best practices.

---

## 📚 Table of Contents

1. [Project Overview](#-project-overview)
2. [Quick Reference](#-quick-reference)
3. [Architecture Guidelines](#-architecture-guidelines)
4. [Development Workflow](#-development-workflow)
5. [Code Standards](#-code-standards)
6. [Common Tasks](#-common-tasks)
7. [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

### What is this project?

A **modern React dashboard template** with:
- ✅ Pre-built authentication system (Firebase)
- ✅ MVVM architecture pattern
- ✅ Professional business theme (Blue palette)
- ✅ Dark/Light mode support
- ✅ TypeScript + React 19 + Vite 7
- ✅ Tailwind CSS 4 + shadcn/ui components
- ✅ Full type safety with Zod validation

### Project Goals

- **Template First**: Built as a reusable template, not a specific application
- **Developer Friendly**: Clear structure, comprehensive docs, helpful error messages
- **Production Ready**: Best practices, type safety, proper error handling
- **Easy to Customize**: Well-organized, modular, documented

---

## 🚀 Quick Reference

### Essential Documentation

| Document | Purpose | Link |
|----------|---------|------|
| **README.md** | Project setup, tech stack, getting started | [README.md](./README.md) |
| **MODULE_GUIDELINE.md** | MVVM architecture, module creation, code examples | [MODULE_GUIDELINE.md](./MODULE_GUIDELINE.md) |
| **THEME_GUIDELINE.md** | Theme system, colors, component styles | [THEME_GUIDELINE.md](./THEME_GUIDELINE.md) |

### Tech Stack Summary

```yaml
Framework: React 19 + TypeScript
Build Tool: Vite 7
Styling: Tailwind CSS 4 + shadcn/ui
State: React Context + Custom Hooks
Routing: React Router v7
Forms: React Hook Form + Zod
Auth: Firebase Auth
Icons: Lucide React
Notifications: Sonner
Package Manager: pnpm
```

### Project Structure

```
src/
├── app/
│   ├── config/              # Configuration (theme, menu, routes)
│   ├── layouts/             # Page layouts (full-layout, error-layout)
│   ├── modules/             # Feature modules (MVVM pattern)
│   │   └── auth/            # Authentication module
│   │       ├── components/  # UI components
│   │       ├── hooks/       # Custom hooks
│   │       ├── models/      # Data models & Zod schemas
│   │       ├── pages/       # Page components
│   │       ├── services/    # API/Firebase services
│   │       ├── utils/       # Utility functions
│   │       └── viewmodels/  # Business logic hooks
│   ├── shared/              # Shared across modules
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   └── hooks/           # Shared hooks
│   └── router.tsx           # Route definitions
├── components/ui/           # shadcn/ui components
├── lib/
│   ├── services/            # External services (Firebase)
│   └── utils.ts             # Utilities
└── main.tsx                 # Entry point
```

---

## 🏗️ Architecture Guidelines

### MVVM Pattern (Model-View-ViewModel)

**Complete documentation**: [MODULE_GUIDELINE.md](./MODULE_GUIDELINE.md)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      VIEW       │◄──►│   VIEW MODEL    │◄──►│     MODEL       │
│   (Components)  │    │   (Hooks/VMs)   │    │  (Services/API) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Quick Rules

**MODEL Layer** 📊
- Data structures (interfaces, types)
- API calls and data fetching
- Zod validation schemas
- ❌ NO UI logic or JSX

**VIEW MODEL Layer** 🧠
- Business logic
- State management
- Data transformation
- Custom hooks with `use` prefix
- ❌ NO JSX returned from hooks

**VIEW Layer** 🎨
- UI rendering
- User interactions
- Presentational components (receive props)
- Container components (use ViewModels)
- ❌ NO direct API calls

### Example: TODO Module Structure

```typescript
// 1. MODEL - models/todo.model.ts
export interface Todo {
  id: string;
  title: string;
  status: TodoStatus;
}
export async function getTodos(): Promise<Todo[]> {
  return await api.get<Todo[]>('/todos');
}

// 2. VIEW MODEL - viewmodels/use-todos-list.ts
export function useTodosListViewModel() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const loadTodos = useCallback(async () => {
    const data = await getTodos();
    setTodos(data);
  }, []);
  return { todos, loadTodos };
}

// 3. VIEW - pages/todos-list.tsx
export function TodosListPage() {
  const { todos, loadTodos } = useTodosListViewModel();
  return <div>{todos.map(t => <TodoCard todo={t} />)}</div>;
}
```

**See [MODULE_GUIDELINE.md](./MODULE_GUIDELINE.md) for complete examples**

---

## 🎨 Theme System

**Complete documentation**: [THEME_GUIDELINE.md](./THEME_GUIDELINE.md)

### Color System

- **Format**: OKLCH color space (better contrast, accessibility)
- **Primary**: Professional Blue
- **Modes**: Light + Dark (automatic switching)
- **Location**: `src/index.css` (CSS variables)

### Quick Theme Reference

```css
/* Primary - Brand Color */
--primary: oklch(0.55 0.15 160);        /* Light mode */
--primary: oklch(0.6 0.15 160);         /* Dark mode */

/* Background */
--background: oklch(0.99 0.005 160);    /* Light mode */
--background: oklch(0.08 0.01 160);     /* Dark mode */

/* Card */
--card: oklch(1 0 0);                   /* Light mode */
--card: oklch(0.11 0.01 160);           /* Dark mode */
```

### Utility Classes

```tsx
// Status badges
<Badge className="status-active">Active</Badge>
<Badge className="status-pending">Pending</Badge>
<Badge className="status-error">Error</Badge>

// Effects
<Card className="card-hover">Content</Card>
<div className="glass">Glassmorphism</div>
<div className="bg-business-gradient">Gradient</div>
```

---

## 💻 Development Workflow

### Creating a New Module

**Step 1: Create MVVM Structure**

```bash
# Example: Creating a "todos" module
mkdir -p src/app/modules/todos/{models,viewmodels,components,pages,services}
touch src/app/modules/todos/index.ts
touch src/app/modules/todos/{models,viewmodels,components,pages,services}/index.ts
```

**Step 2: Implement in Order**

1. **MODEL first** - Define data structures and API functions
2. **VIEW MODEL** - Create business logic hooks
3. **VIEW last** - Build UI components

**Step 3: Wire Up**

```typescript
// 1. Add routes in src/app/router.tsx
{
  path: '/todos',
  element: <TodosListPage />
}

// 2. Add menu items in src/app/config/menu.ts
export const navMain: MenuItem[] = [
  {
    title: 'Todos',
    url: '/todos',
    icon: CheckSquare,
  }
];
```

### Adding a New Component

```bash
# For module-specific component
touch src/app/modules/todos/components/todo-card.tsx

# For shared component
touch src/app/shared/components/data-table.tsx

# For UI component (shadcn/ui)
npx shadcn@latest add dialog
```

### Firebase Setup

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Add Firebase config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# 3. Restart dev server
pnpm dev
```

**Setup UI**: The app shows a friendly setup screen when Firebase is not configured.

---

## 📝 Code Standards

### Naming Conventions

```typescript
// Components: PascalCase
TodoCard.tsx
UserProfile.tsx

// Files: kebab-case
todo-card.tsx
use-todos-list.ts

// Folders: lowercase
components/
viewmodels/

// Types/Interfaces: PascalCase
interface TodoData { }
type UserRole = 'admin' | 'user';

// ViewModels: use + PascalCase
useTodosListViewModel()
useAuthViewModel()

// API Functions: verb + noun
getTodos()
createTodo()
deleteTodo()
```

### TypeScript Rules

```typescript
// ✅ CORRECT: Strict typing
interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

// ✅ CORRECT: Use generic types
interface ApiResponse<T> {
  data: T;
  success: boolean;
}

// ❌ WRONG: Avoid any
function handleData(data: any) { // ❌
  return data.something;
}
```

### Import/Export Patterns

```typescript
// components/index.ts
export { TodoCard } from './todo-card';
export { TodoList } from './todo-list';

// models/index.ts
export * from './todo.model';

// Module index.ts
export * from './components';
export * from './models';
export * from './viewmodels';
```

### Error Handling

```typescript
// ✅ CORRECT: Handle in ViewModel
export function useTodosViewModel() {
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      setError(null);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast.error(message);
    }
  }, []);

  return { error, loadTodos };
}
```

---

## 🔧 Common Tasks

### Task 1: Add a New Page

```typescript
// 1. Create page component
// src/app/modules/todos/pages/todos-list.tsx
export function TodosListPage() {
  return <div>Todo List</div>;
}

// 2. Add route
// src/app/router.tsx
{
  path: '/todos',
  element: <TodosListPage />
}

// 3. Add to menu (optional)
// src/app/config/menu.ts
{ title: 'Todos', url: '/todos', icon: CheckSquare }
```

### Task 2: Add Form Validation

```typescript
// 1. Create Zod schema
// models/todo.schema.ts
export const TodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.nativeEnum(TodoPriority),
});

// 2. Use in ViewModel
const form = useForm<TodoFormData>({
  resolver: zodResolver(TodoSchema),
  defaultValues: { title: '', description: '' }
});

// 3. Handle submit
const handleSubmit = async (data: TodoFormData) => {
  const validated = TodoSchema.parse(data);
  await createTodo(validated);
};
```

### Task 3: Add a New API Endpoint

```typescript
// models/todo.model.ts
export async function getTodoById(id: string): Promise<Todo> {
  return await api.get<Todo>(`/todos/${id}`);
}

export async function updateTodo(id: string, data: UpdateTodoDto): Promise<Todo> {
  return await api.put<Todo>(`/todos/${id}`, data);
}
```

### Task 4: Add Optimistic Updates (ahooks)

```typescript
import { useRequest, useMemoizedFn } from 'ahooks';

const handleDelete = useMemoizedFn(async (id: string) => {
  const originalTodos = todos;

  try {
    // Optimistic update
    mutate(todos.filter((t) => t.id !== id));
    await deleteTodo(id);
    toast.success('Deleted successfully');
  } catch (err) {
    // Rollback on error
    mutate(originalTodos);
    toast.error('Delete failed');
  }
});
```

### Task 5: Change Theme Colors

```css
/* src/index.css */

/* Light mode */
:root {
  --primary: oklch(0.55 0.15 250);  /* Change hue to 250 for purple */
}

/* Dark mode */
.dark {
  --primary: oklch(0.6 0.18 250);
}
```

---

## 🐛 Troubleshooting

### Firebase Not Configured

**Symptom**: Setup screen appears on first run

**Solution**:
1. Copy `.env.example` to `.env`
2. Add Firebase credentials (from Firebase Console)
3. Restart dev server: `pnpm dev`

### TypeScript Errors

**Symptom**: Type errors in VS Code

**Solution**:
```bash
# Rebuild TypeScript
pnpm build

# Restart TS Server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Tailwind Classes Not Working

**Symptom**: CSS classes not applying

**Solution**:
1. Check if class is in `src/index.css`
2. Restart dev server
3. Clear cache: `rm -rf node_modules/.vite`

### Module Not Found Errors

**Symptom**: Cannot find module '@/...'

**Solution**:
1. Check `tsconfig.json` paths configuration
2. Verify import path matches file structure
3. Restart dev server

---

## 📖 Best Practices

### DO ✅

- Follow MVVM pattern strictly
- Use TypeScript strictly (no `any`)
- Handle errors in ViewModels
- Use Zod for validation
- Keep components small and focused
- Write descriptive component names
- Use ahooks for complex state management
- Add proper error messages for users

### DON'T ❌

- Call APIs directly in components
- Return JSX from ViewModels/hooks
- Put business logic in components
- Use `any` type
- Skip error handling
- Create deeply nested components
- Hardcode configuration values
- Ignore TypeScript errors

---

## 🎓 Learning Resources

### Internal Docs

1. **[MODULE_GUIDELINE.md](./MODULE_GUIDELINE.md)** - Complete MVVM guide with TODO app examples
2. **[THEME_GUIDELINE.md](./THEME_GUIDELINE.md)** - Theme customization guide
3. **[README.md](./README.md)** - Project setup and overview

### External Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [ahooks](https://ahooks.js.org)
- [Firebase Auth](https://firebase.google.com/docs/auth)

---

## 🤝 Working with Claude

### When Helping with This Project

1. **Always check** MODULE_GUIDELINE.md for architecture patterns
2. **Follow** the MVVM structure strictly
3. **Use** existing patterns from auth module as reference
4. **Maintain** consistent naming conventions
5. **Update** documentation when adding new features
6. **Test** code suggestions for type safety

### Example Prompts for Claude

```
"Create a new todos module following MVVM pattern"
→ Claude will create MODEL → VIEW MODEL → VIEW in correct order

"Add a new API endpoint for updating todos"
→ Claude will add it in models/todo.model.ts

"Create a form with validation for creating todos"
→ Claude will use Zod schema + React Hook Form

"Change primary color to purple"
→ Claude will update src/index.css OKLCH values

"Add optimistic updates to delete function"
→ Claude will use ahooks pattern from MODULE_GUIDELINE.md
```

---

## 📊 Project Stats

- **Architecture**: MVVM
- **Type Safety**: 100% TypeScript
- **Components**: shadcn/ui (40+ components)
- **Documentation**: 3 comprehensive guides
- **Modules**: 1 (Auth) - Extensible
- **Theme Modes**: 2 (Light + Dark)
- **Lines of Code**: ~5,000

---

## 🔄 Update History

**Version 1.0.0** - Initial Release
- ✅ Complete authentication module
- ✅ MVVM architecture
- ✅ Professional theme system
- ✅ Comprehensive documentation
- ✅ Firebase integration
- ✅ Dark/Light mode

---

## 📬 Support

For questions or issues:

1. Check documentation in this folder
2. Review code examples in MODULE_GUIDELINE.md
3. Check existing modules for patterns
4. Refer to external docs for libraries used

---

**Last Updated**: 2025-10-20
**Maintained By**: phuthuycoding
**Repository**: react-dashboard-template
