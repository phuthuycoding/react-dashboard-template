# React Dashboard Template - Module Guidelines

## 🏗️ **MVVM Architecture Pattern**

This project uses the **Model-View-ViewModel (MVVM)** pattern to separate logic and UI:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      VIEW       │◄──►│   VIEW MODEL    │◄──►│     MODEL       │
│   (Components)  │    │   (Hooks/VMs)   │    │  (Services/API) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **📂 MVVM Folder Structure**

```
module-name/
├── models/             # 🎯 MODEL - Data structures & API interfaces
│   ├── *.model.ts      # TypeScript interfaces, types, API functions
│   └── *.schema.ts     # Zod validation schemas
├── viewmodels/         # 🧠 VIEW MODEL - Business logic & state
│   └── use-*.ts        # Custom hooks containing business logic
├── components/         # 🎨 VIEW - UI Components (Presentational)
│   ├── *.tsx           # Reusable UI components
│   └── index.ts        # Component exports
├── pages/              # 📄 VIEW - Page Components (Container)
│   └── *.tsx           # Page-level components
├── services/           # 🔧 MODEL - External services
│   └── *.service.ts    # Third-party integrations, utilities
└── index.ts            # Module exports
```

## 🎯 **Layer Responsibilities**

### **📊 MODEL Layer**

**Purpose:** Data management, API calls, validation

- **`*.model.ts`**: Define interfaces, types, API functions
- **`*.schema.ts`**: Zod schemas for validation
- **Principle**: No UI logic, only data handling

### **🧠 VIEW MODEL Layer**

**Purpose:** Business logic, state management, data transformation

- **`use-*.ts`**: Custom hooks containing business logic
- **Principle**: Connect Model and View, no JSX

### **🎨 VIEW Layer**

**Purpose:** UI rendering, user interactions

- **`components/`**: Presentational components (receive props, render UI)
- **`pages/`**: Container components (use ViewModels)
- **Principle**: Only UI logic, no direct API calls

## 🔗 **API Calling and Data Flow**

### **1. API Calling Pattern**

```typescript
// ✅ CORRECT: Call API in MODEL
// models/todo.model.ts
export async function getTodos(): Promise<Todo[]> {
  const response = await api.get<Todo[]>('/todos');
  return response;
}

// ✅ CORRECT: Use API in VIEW MODEL
// viewmodels/use-todos-list.ts
export function useTodosListViewModel() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodos = useCallback(async () => {
    try {
      const data = await getTodos(); // Call from model
      setTodos(data);
    } catch (error) {
      // Handle error
    }
  }, []);

  return { todos, loadTodos };
}

// ✅ CORRECT: Use VIEW MODEL in COMPONENT
// pages/todos-list.tsx
export function TodosListPage() {
  const { todos, loadTodos } = useTodosListViewModel();

  return (
    <div>
      {todos.map(todo => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

### **2. Data Flow Direction**

```
User Action → VIEW → VIEW MODEL → MODEL → API
                ↑         ↑         ↑
            UI Update ← State ← Response
```

## 📋 **Development Guidelines**

### **1. Naming Conventions**

- **Components**: PascalCase (e.g., `TodoCard.tsx`)
- **Files**: kebab-case (e.g., `todo-card.tsx`)
- **Folders**: lowercase (e.g., `components/`)
- **Types**: PascalCase (e.g., `TodoData`)
- **ViewModels**: `use` prefix (e.g., `useTodosListViewModel`)
- **API Functions**: verb + noun (e.g., `getTodos`, `createTodo`)

## Router component

- Change menu at `../config/menu.ts`
- Add router component at ../router.tsx

### **2. Layer Details with Code Examples**

#### **📊 MODEL Layer Examples**

**`models/todo.model.ts`**

```typescript
import { api } from '@/lib/api-client';
import { z } from 'zod';

// 📋 Interface definitions
export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export enum TodoStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TodoPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface CreateTodoDto {
  title: string;
  description: string;
  priority: TodoPriority;
  dueDate?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: string;
}

// 🔍 Validation schemas
export const TodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  priority: z.nativeEnum(TodoPriority),
  dueDate: z.string().optional(),
});

// 🌐 API functions
export async function getTodos(): Promise<Todo[]> {
  return await api.get<Todo[]>('/todos');
}

export async function getTodoById(id: string): Promise<Todo> {
  return await api.get<Todo>(`/todos/${id}`);
}

export async function createTodo(data: CreateTodoDto): Promise<Todo> {
  const validated = TodoSchema.parse(data);
  return await api.post<Todo>('/todos', validated);
}

export async function updateTodo(id: string, data: UpdateTodoDto): Promise<Todo> {
  return await api.put<Todo>(`/todos/${id}`, data);
}

export async function deleteTodo(id: string): Promise<void> {
  return await api.delete(`/todos/${id}`);
}

export async function toggleTodoStatus(id: string): Promise<Todo> {
  return await api.patch<Todo>(`/todos/${id}/toggle`);
}
```

#### **🧠 VIEW MODEL Layer Examples**

**`viewmodels/use-todos-list.ts`** (With ahooks)

```typescript
import { useState } from 'react';
import { useRequest, useMemoizedFn, useDebounceFn } from 'ahooks';
import { toast } from 'sonner';
import { getTodos, deleteTodo, toggleTodoStatus, type Todo, TodoStatus } from '../models/todo.model';

export function useTodosListViewModel() {
  const [searchQuery, setSearchQuery] = useState('');

  // 🚀 useRequest - Auto loading states, error handling
  const {
    data: todos = [],
    loading: isLoading,
    error,
    refresh,
    mutate,
  } = useRequest(getTodos, {
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast.error(message);
    },
  });

  // 🗑️ Delete handler with useMemoizedFn (optimizes re-render)
  const handleDelete = useMemoizedFn(async (id: string) => {
    try {
      await deleteTodo(id);
      // Optimistic update - update UI immediately
      mutate(todos.filter((t) => t.id !== id));
      toast.success('Todo deleted successfully');
    } catch (err) {
      toast.error('Unable to delete todo');
      refresh(); // Refresh if error
    }
  });

  // ✅ Toggle todo status
  const handleToggleStatus = useMemoizedFn(async (id: string) => {
    try {
      const updatedTodo = await toggleTodoStatus(id);
      // Optimistic update
      mutate(todos.map((t) => (t.id === id ? updatedTodo : t)));
      toast.success('Todo status updated');
    } catch (err) {
      toast.error('Unable to update todo');
      refresh();
    }
  });

  // 🔍 Debounced search (performance optimization)
  const { run: debouncedSearch } = useDebounceFn(
    (query: string) => {
      setSearchQuery(query);
    },
    { wait: 300 },
  );

  // 🔍 Filtered todos with auto useMemo
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    // State
    todos: filteredTodos,
    isLoading,
    error,
    searchQuery,

    // Actions
    setSearchQuery: debouncedSearch,
    handleDelete,
    handleToggleStatus,
    refresh,
  };
}
```

**Advanced version with ahooks:**

```typescript
import { useState } from 'react';
import { useRequest, useMemoizedFn, useDebounceFn, useLocalStorageState } from 'ahooks';
import { toast } from 'sonner';
import { getTodos, deleteTodo, toggleTodoStatus, type Todo, TodoStatus, TodoPriority } from '../models/todo.model';

interface TodoFilters {
  status?: TodoStatus;
  priority?: TodoPriority;
}

export function useTodosListViewModel() {
  // 💾 Persistent search query
  const [searchQuery, setSearchQuery] = useLocalStorageState('todos-search', {
    defaultValue: '',
  });

  const [filters, setFilters] = useState<TodoFilters>({});
  const [viewMode, setViewMode] = useLocalStorageState<'grid' | 'list'>('todos-view-mode', {
    defaultValue: 'list',
  });

  // 🚀 Main data fetching with dependency
  const {
    data: todos = [],
    loading: isLoading,
    error,
    refresh,
    mutate,
  } = useRequest(getTodos, {
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast.error(message);
    },
    cacheKey: 'todos-list', // Cache for performance optimization
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // 🗑️ Delete with optimistic update
  const handleDelete = useMemoizedFn(async (id: string) => {
    const originalTodos = todos;

    try {
      // Optimistic update
      mutate(todos.filter((t) => t.id !== id));

      await deleteTodo(id);
      toast.success('Todo deleted successfully');
    } catch (err) {
      // Rollback if error
      mutate(originalTodos);
      toast.error('Unable to delete todo');
    }
  });

  // ✅ Toggle status with optimistic update
  const handleToggleStatus = useMemoizedFn(async (id: string) => {
    const originalTodos = todos;
    const todo = todos.find((t) => t.id === id);

    if (!todo) return;

    try {
      // Optimistic update
      const newStatus = todo.status === TodoStatus.COMPLETED
        ? TodoStatus.PENDING
        : TodoStatus.COMPLETED;

      mutate(todos.map((t) =>
        t.id === id ? { ...t, status: newStatus } : t
      ));

      await toggleTodoStatus(id);
      toast.success('Todo status updated');
    } catch (err) {
      // Rollback if error
      mutate(originalTodos);
      toast.error('Unable to update todo');
    }
  });

  // 🔍 Debounced search
  const { run: debouncedSearch } = useDebounceFn((query: string) => setSearchQuery(query), { wait: 300 });

  // 🎛️ Filter handlers
  const updateFilter = useMemoizedFn((key: keyof TodoFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  });

  const clearFilters = useMemoizedFn(() => {
    setFilters({});
  });

  // 🔍 Computed values
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !filters.status || todo.status === filters.status;
    const matchesPriority = !filters.priority || todo.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.status === TodoStatus.COMPLETED).length,
    inProgress: todos.filter((t) => t.status === TodoStatus.IN_PROGRESS).length,
    pending: todos.filter((t) => t.status === TodoStatus.PENDING).length,
    highPriority: todos.filter((t) => t.priority === TodoPriority.HIGH).length,
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return {
    // State
    todos: filteredTodos,
    isLoading,
    error,
    searchQuery,
    viewMode,
    filters,
    stats,
    activeFiltersCount,

    // Actions
    setSearchQuery: debouncedSearch,
    setViewMode,
    updateFilter,
    clearFilters,
    handleDelete,
    handleToggleStatus,
    refresh,
  };
}
```

#### **🎯 Recommended ahooks usage**

**✅ Use ahooks when:**

- Data fetching with loading/error states
- Debouncing user input
- Persistent state (localStorage/sessionStorage)
- Optimistic updates
- Performance optimization
- Complex state management

**❌ Don't need ahooks when:**

- Simple local state (1-2 useState)
- Static data that doesn't change
- Component is too simple

#### **🎨 VIEW Layer Examples**

**`components/todo-card.tsx`** (Presentational)

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { type Todo, TodoStatus, TodoPriority } from '../models/todo.model';

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onToggleStatus: (todo: Todo) => void;
}

export function TodoCard({ todo, onEdit, onDelete, onToggleStatus }: TodoCardProps) {
  const isCompleted = todo.status === TodoStatus.COMPLETED;

  const getPriorityColor = (priority: TodoPriority) => {
    switch (priority) {
      case TodoPriority.HIGH:
        return 'destructive';
      case TodoPriority.MEDIUM:
        return 'default';
      case TodoPriority.LOW:
        return 'secondary';
    }
  };

  return (
    <Card className={isCompleted ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => onToggleStatus(todo)}
              className="mt-1"
            />
            <div className="flex-1">
              <CardTitle className={isCompleted ? 'line-through' : ''}>
                {todo.title}
              </CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant={getPriorityColor(todo.priority)}>
                  {todo.priority}
                </Badge>
                <Badge variant="outline">
                  {todo.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {todo.description}
        </p>
        {todo.dueDate && (
          <p className="text-xs text-muted-foreground mb-4">
            Due: {new Date(todo.dueDate).toLocaleDateString()}
          </p>
        )}
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(todo)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(todo)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

**`pages/todos-list.tsx`** (Container)

```typescript
import { TodoCard } from '../components/todo-card';
import { useTodosListViewModel } from '../viewmodels/use-todos-list';
import { type Todo } from '../models/todo.model';

export function TodosListPage() {
  // 🧠 Use ViewModel
  const {
    todos,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleDelete,
    handleToggleStatus,
    stats,
  } = useTodosListViewModel();

  // 🛠️ Event handlers
  const handleEdit = (todo: Todo) => {
    // Navigate to edit page or open modal
    console.log('Edit todo:', todo.id);
  };

  const handleToggle = (todo: Todo) => {
    handleToggleStatus(todo.id);
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Todo Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-card rounded-lg">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold">{stats.inProgress}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <p className="text-sm text-muted-foreground">High Priority</p>
          <p className="text-2xl font-bold">{stats.highPriority}</p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search todos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 p-2 border rounded w-full"
      />

      {/* Loading */}
      {isLoading && <div>Loading...</div>}

      {/* Todos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {todos.map(todo => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onEdit={handleEdit}
            onDelete={(todo) => handleDelete(todo.id)}
            onToggleStatus={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}
```

### **3. Best Practices & Anti-Patterns**

#### **✅ CORRECT - Best Practices**

```typescript
// ✅ CORRECT: Clear separation of concerns
// MODEL: Only handle data and API
export async function getTodos(): Promise<Todo[]> {
  return await api.get<Todo[]>('/todos');
}

// VIEW MODEL: Contains business logic and state
export function useTodosViewModel() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodos = useCallback(async () => {
    const data = await getTodos();
    setTodos(data);
  }, []);

  return { todos, loadTodos };
}

// VIEW: Only render UI
export function TodosPage() {
  const { todos, loadTodos } = useTodosViewModel();
  return <div>{/* JSX */}</div>;
}
```

#### **❌ WRONG - Anti-Patterns**

```typescript
// ❌ WRONG: Direct API call in component
export function TodosPage() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // NEVER do this!
    api.get('/todos').then(setTodos);
  }, []);

  return <div>{/* JSX */}</div>;
}

// ❌ WRONG: Contains JSX in ViewModel
export function useTodosViewModel() {
  const [todos, setTodos] = useState([]);

  // NEVER return JSX from hook!
  return {
    todos,
    renderTodos: () => <div>{/* JSX */}</div> // ❌ WRONG!
  };
}

// ❌ WRONG: Business logic in component
export function TodosPage() {
  const [todos, setTodos] = useState([]);

  // This logic should be in ViewModel!
  const completedTodos = todos.filter(t =>
    t.status === TodoStatus.COMPLETED
  ).sort((a, b) => a.title.localeCompare(b.title));

  return <div>{/* JSX */}</div>;
}
```

### **4. Import/Export Pattern**

```typescript
// components/index.ts
export { TodoCard } from './todo-card';
export { TodoList } from './todo-list';
export { TodoForm } from './todo-form';

// models/index.ts
export * from './todo.model';

// Module index.ts
export * from './components';
export * from './models';
export * from './viewmodels';
export * from './pages';
```

### **5. Error Handling Pattern**

```typescript
// ✅ CORRECT: Error handling in ViewModel
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

### **6. TypeScript Standards**

```typescript
// ✅ CORRECT: Strict typing
interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

// ✅ CORRECT: Generic types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// ❌ WRONG: Avoid any
function handleData(data: any) {
  // ❌ Don't use any
  return data.something;
}
```

## 🔄 **Development Workflow**

### **🏗️ When creating a new module:**

#### **Step 1: Create MVVM structure**

```bash
# Create folders following MVVM pattern
mkdir -p todos/{models,viewmodels,components,pages,services}
touch todos/index.ts
touch todos/{models,viewmodels,components,pages,services}/index.ts
```

#### **Step 2: Implement following MVVM order**

**1. MODEL Layer first** 📊

```typescript
// models/todo.model.ts
export interface Todo {
  id: string;
  title: string;
  status: TodoStatus;
}

export async function getTodos(): Promise<Todo[]> {
  return await api.get<Todo[]>('/todos');
}
```

**2. VIEW MODEL Layer** 🧠

```typescript
// viewmodels/use-todos-list.ts
export function useTodosListViewModel() {
  const [todos, setTodos] = useState<Todo[]>([]);
  // Business logic...
  return { todos, loadTodos };
}
```

**3. VIEW Layer last** 🎨

```typescript
// components/todo-card.tsx
export function TodoCard({ todo }: { todo: Todo }) {
  return <div>{todo.title}</div>;
}

// pages/todos-list.tsx
export function TodosListPage() {
  const { todos } = useTodosListViewModel();
  return <div>{/* JSX */}</div>;
}
```
