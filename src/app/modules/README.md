# EV Charging Station Management - Module Guidelines

## 🏗️ **MVVM Architecture Pattern**

Dự án sử dụng **Model-View-ViewModel (MVVM)** pattern để tách biệt logic và UI:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      VIEW       │◄──►│   VIEW MODEL    │◄──►│     MODEL       │
│   (Components)  │    │   (Hooks/VMs)   │    │  (Services/API) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **📂 Cấu trúc thư mục theo MVVM**

```
module-name/
├── models/             # 🎯 MODEL - Data structures & API interfaces
│   ├── *.model.ts      # TypeScript interfaces, types, API functions
│   └── *.schema.ts     # Zod validation schemas
├── viewmodels/         # 🧠 VIEW MODEL - Business logic & state
│   └── use-*.ts        # Custom hooks chứa logic nghiệp vụ
├── components/         # 🎨 VIEW - UI Components (Presentational)
│   ├── *.tsx           # Reusable UI components
│   └── index.ts        # Component exports
├── pages/              # 📄 VIEW - Page Components (Container)
│   └── *.tsx           # Page-level components
├── services/           # 🔧 MODEL - External services
│   └── *.service.ts    # Third-party integrations, utilities
└── index.ts            # Module exports
```

## 🎯 **Nhiệm vụ của từng Layer**

### **📊 MODEL Layer**

**Chức năng:** Quản lý dữ liệu, API calls, validation

- **`*.model.ts`**: Định nghĩa interfaces, types, API functions
- **`*.schema.ts`**: Zod schemas cho validation
- **Nguyên tắc**: Không chứa UI logic, chỉ xử lý dữ liệu

### **🧠 VIEW MODEL Layer**

**Chức năng:** Business logic, state management, data transformation

- **`use-*.ts`**: Custom hooks chứa logic nghiệp vụ
- **Nguyên tắc**: Kết nối Model và View, không chứa JSX

### **🎨 VIEW Layer**

**Chức năng:** UI rendering, user interactions

- **`components/`**: Presentational components (nhận props, render UI)
- **`pages/`**: Container components (sử dụng ViewModels)
- **Nguyên tắc**: Chỉ chứa UI logic, không gọi API trực tiếp

## 🔗 **Cách gọi API và Data Flow**

### **1. API Calling Pattern**

```typescript
// ✅ ĐÚNG: Gọi API trong MODEL
// models/station.model.ts
export async function getStations(): Promise<Station[]> {
  const response = await api.get<Station[]>('/stations');
  return response;
}

// ✅ ĐÚNG: Sử dụng API trong VIEW MODEL
// viewmodels/use-stations-list.ts
export function useStationsListViewModel() {
  const [stations, setStations] = useState<Station[]>([]);

  const loadStations = useCallback(async () => {
    try {
      const data = await getStations(); // Gọi từ model
      setStations(data);
    } catch (error) {
      // Handle error
    }
  }, []);

  return { stations, loadStations };
}

// ✅ ĐÚNG: Sử dụng VIEW MODEL trong COMPONENT
// pages/stations-list.tsx
export function StationsListPage() {
  const { stations, loadStations } = useStationsListViewModel();

  return (
    <div>
      {stations.map(station => (
        <StationCard key={station.id} station={station} />
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

- **Components**: PascalCase (e.g., `StationCard.tsx`)
- **Files**: kebab-case (e.g., `station-card.tsx`)
- **Folders**: lowercase (e.g., `components/`)
- **Types**: PascalCase (e.g., `StationData`)
- **ViewModels**: `use` prefix (e.g., `useStationsListViewModel`)
- **API Functions**: verb + noun (e.g., `getStations`, `createStation`)

## Router component

- Thay đổi menu tại `../config/menu.ts`
- Add router component tại ../router.tsx

### **2. Chi tiết các Layer với Code Examples**

#### **📊 MODEL Layer Examples**

**`models/station.model.ts`**

```typescript
import { api } from '@/lib/api-client';
import { z } from 'zod';

// 📋 Interface definitions
export interface Station {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: StationStatus;
  connectors: number;
}

export enum StationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

// 🔍 Validation schemas
export const StationSchema = z.object({
  name: z.string().min(1, 'Tên trạm không được để trống'),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().min(1),
  }),
  connectors: z.number().min(1),
});

// 🌐 API functions
export async function getStations(): Promise<Station[]> {
  return await api.get<Station[]>('/stations');
}

export async function createStation(data: CreateStationDto): Promise<Station> {
  const validated = StationSchema.parse(data);
  return await api.post<Station>('/stations', validated);
}

export async function updateStation(id: string, data: UpdateStationDto): Promise<Station> {
  return await api.put<Station>(`/stations/${id}`, data);
}

export async function deleteStation(id: string): Promise<void> {
  return await api.delete(`/stations/${id}`);
}
```

#### **🧠 VIEW MODEL Layer Examples**

**`viewmodels/use-stations-list.ts`** (Với ahooks)

```typescript
import { useState } from 'react';
import { useRequest, useMemoizedFn, useDebounceFn } from 'ahooks';
import { toast } from 'sonner';
import { getStations, deleteStation, type Station } from '../models/station.model';

export function useStationsListViewModel() {
  const [searchQuery, setSearchQuery] = useState('');

  // 🚀 useRequest - Auto loading states, error handling
  const {
    data: stations = [],
    loading: isLoading,
    error,
    refresh,
    mutate,
  } = useRequest(getStations, {
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      toast.error(message);
    },
  });

  // 🗑️ Delete handler với useMemoizedFn (tối ưu re-render)
  const handleDelete = useMemoizedFn(async (id: string) => {
    try {
      await deleteStation(id);
      // Optimistic update - cập nhật UI ngay lập tức
      mutate(stations.filter((s) => s.id !== id));
      toast.success('Xóa trạm thành công');
    } catch (err) {
      toast.error('Không thể xóa trạm');
      refresh(); // Refresh nếu có lỗi
    }
  });

  // 🔍 Debounced search (tối ưu performance)
  const { run: debouncedSearch } = useDebounceFn(
    (query: string) => {
      setSearchQuery(query);
    },
    { wait: 300 },
  );

  // 🔍 Filtered stations với useMemo tự động
  const filteredStations = stations.filter((station) => station.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return {
    // State
    stations: filteredStations,
    isLoading,
    error,
    searchQuery,

    // Actions
    setSearchQuery: debouncedSearch,
    handleDelete,
    refresh,
  };
}
```

**Phiên bản nâng cao với ahooks:**

```typescript
import { useState } from 'react';
import { useRequest, useMemoizedFn, useDebounceFn, useLocalStorageState, useUpdateEffect } from 'ahooks';
import { toast } from 'sonner';
import { getStations, deleteStation, type Station, type StationFilters } from '../models/station.model';

export function useStationsListViewModel() {
  // 💾 Persistent search query
  const [searchQuery, setSearchQuery] = useLocalStorageState('stations-search', {
    defaultValue: '',
  });

  const [filters, setFilters] = useState<StationFilters>({});
  const [viewMode, setViewMode] = useLocalStorageState<'grid' | 'list'>('stations-view-mode', {
    defaultValue: 'grid',
  });

  // 🚀 Main data fetching với dependency
  const {
    data: stations = [],
    loading: isLoading,
    error,
    refresh,
    mutate,
  } = useRequest(() => getStations(filters), {
    refreshDeps: [filters], // Auto refresh khi filters thay đổi
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      toast.error(message);
    },
    cacheKey: 'stations-list', // Cache để tối ưu performance
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });

  // 🗑️ Delete với optimistic update
  const handleDelete = useMemoizedFn(async (id: string) => {
    const originalStations = stations;

    try {
      // Optimistic update
      mutate(stations.filter((s) => s.id !== id));

      await deleteStation(id);
      toast.success('Xóa trạm thành công');
    } catch (err) {
      // Rollback nếu có lỗi
      mutate(originalStations);
      toast.error('Không thể xóa trạm');
    }
  });

  // 🔍 Debounced search
  const { run: debouncedSearch } = useDebounceFn((query: string) => setSearchQuery(query), { wait: 300 });

  // 🎛️ Filter handlers
  const updateFilter = useMemoizedFn((key: keyof StationFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  });

  const clearFilters = useMemoizedFn(() => {
    setFilters({});
  });

  // 🔍 Computed values
  const filteredStations = stations.filter((station) => station.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const stats = {
    total: stations.length,
    active: stations.filter((s) => s.status === 'ACTIVE').length,
    maintenance: stations.filter((s) => s.status === 'MAINTENANCE').length,
    totalConnectors: stations.reduce((sum, s) => sum + s.connectors, 0),
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return {
    // State
    stations: filteredStations,
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
    refresh,
  };
}
```

#### **🎯 Khuyến nghị sử dụng ahooks**

**✅ Nên dùng ahooks khi:**

- Data fetching với loading/error states
- Debouncing user input
- Persistent state (localStorage/sessionStorage)
- Optimistic updates
- Performance optimization
- Complex state management

**❌ Không cần ahooks khi:**

- Simple local state (1-2 useState)
- Static data không thay đổi
- Component quá đơn giản

#### **🎨 VIEW Layer Examples**

**`components/station-card.tsx`** (Presentational)

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Station } from '../models/station.model';

interface StationCardProps {
  station: Station;
  onEdit: (station: Station) => void;
  onDelete: (station: Station) => void;
}

export function StationCard({ station, onEdit, onDelete }: StationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{station.name}</CardTitle>
        <Badge variant={station.status === 'ACTIVE' ? 'default' : 'secondary'}>
          {station.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {station.location.address}
        </p>
        <p className="text-sm mb-4">
          {station.connectors} cổng sạc
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(station)}>
            Chỉnh sửa
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(station)}
          >
            Xóa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

**`pages/stations-list.tsx`** (Container)

```typescript
import { StationCard } from '../components/station-card';
import { useStationsListViewModel } from '../viewmodels/use-stations-list';
import { type Station } from '../models/station.model';

export function StationsListPage() {
  // 🧠 Sử dụng ViewModel
  const {
    stations,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleDelete
  } = useStationsListViewModel();

  // 🛠️ Event handlers
  const handleEdit = (station: Station) => {
    // Navigate to edit page or open modal
    console.log('Edit station:', station.id);
  };

  if (error) {
    return <div className="text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý trạm sạc</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Tìm kiếm trạm..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 p-2 border rounded"
      />

      {/* Loading */}
      {isLoading && <div>Loading...</div>}

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map(station => (
          <StationCard
            key={station.id}
            station={station}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
```

### **3. Best Practices & Anti-Patterns**

#### **✅ ĐÚNG - Best Practices**

```typescript
// ✅ ĐÚNG: Tách biệt concerns rõ ràng
// MODEL: Chỉ xử lý dữ liệu và API
export async function getStations(): Promise<Station[]> {
  return await api.get<Station[]>('/stations');
}

// VIEW MODEL: Chứa business logic và state
export function useStationsViewModel() {
  const [stations, setStations] = useState<Station[]>([]);

  const loadStations = useCallback(async () => {
    const data = await getStations();
    setStations(data);
  }, []);

  return { stations, loadStations };
}

// VIEW: Chỉ render UI
export function StationsPage() {
  const { stations, loadStations } = useStationsViewModel();
  return <div>{/* JSX */}</div>;
}
```

#### **❌ SAI - Anti-Patterns**

```typescript
// ❌ SAI: Gọi API trực tiếp trong component
export function StationsPage() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    // KHÔNG BAO GIỜ làm thế này!
    api.get('/stations').then(setStations);
  }, []);

  return <div>{/* JSX */}</div>;
}

// ❌ SAI: Chứa JSX trong ViewModel
export function useStationsViewModel() {
  const [stations, setStations] = useState([]);

  // KHÔNG BAO GIỜ return JSX từ hook!
  return {
    stations,
    renderStations: () => <div>{/* JSX */}</div> // ❌ SAI!
  };
}

// ❌ SAI: Business logic trong component
export function StationsPage() {
  const [stations, setStations] = useState([]);

  // Logic này nên ở trong ViewModel!
  const filteredStations = stations.filter(s =>
    s.status === 'ACTIVE'
  ).sort((a, b) => a.name.localeCompare(b.name));

  return <div>{/* JSX */}</div>;
}
```

### **4. Import/Export Pattern**

```typescript
// components/index.ts
export { StationCard } from './station-card';
export { StationGrid } from './station-grid';
export { StationForm } from './station-form';

// models/index.ts
export * from './station.model';
export * from './connector.model';

// Module index.ts
export * from './components';
export * from './models';
export * from './viewmodels';
export * from './pages';
```

### **5. Error Handling Pattern**

```typescript
// ✅ ĐÚNG: Error handling trong ViewModel
export function useStationsViewModel() {
  const [error, setError] = useState<string | null>(null);

  const loadStations = useCallback(async () => {
    try {
      setError(null);
      const data = await getStations();
      setStations(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(message);
      toast.error(message);
    }
  }, []);

  return { error, loadStations };
}
```

### **6. TypeScript Standards**

```typescript
// ✅ ĐÚNG: Strict typing
interface StationCardProps {
  station: Station;
  onEdit: (station: Station) => void;
  onDelete: (id: string) => void;
}

// ✅ ĐÚNG: Generic types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// ❌ SAI: Tránh any
function handleData(data: any) {
  // ❌ Không dùng any
  return data.something;
}
```

## 🔄 **Development Workflow**

### **🏗️ Khi tạo module mới:**

#### **Bước 1: Tạo cấu trúc MVVM**

```bash
# Tạo thư mục theo MVVM pattern
mkdir -p module-name/{models,viewmodels,components,pages,services}
touch module-name/index.ts
touch module-name/{models,viewmodels,components,pages,services}/index.ts
```

#### **Bước 2: Implement theo thứ tự MVVM**

**1. MODEL Layer trước** 📊

```typescript
// models/entity.model.ts
export interface Entity {
  id: string;
  name: string;
}

export async function getEntities(): Promise<Entity[]> {
  return await api.get<Entity[]>('/entities');
}
```

**2. VIEW MODEL Layer** 🧠

```typescript
// viewmodels/use-entity-list.ts
export function useEntityListViewModel() {
  const [entities, setEntities] = useState<Entity[]>([]);
  // Business logic...
  return { entities, loadEntities };
}
```

**3. VIEW Layer cuối** 🎨

```typescript
// components/entity-card.tsx
export function EntityCard({ entity }: { entity: Entity }) {
  return <div>{entity.name}</div>;
}

// pages/entity-list.tsx
export function EntityListPage() {
  const { entities } = useEntityListViewModel();
  return <div>{/* JSX */}</div>;
}
```
