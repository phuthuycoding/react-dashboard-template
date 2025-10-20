# 🎨 React Dashboard Theme Guideline

## 📋 **Overview**

Modern theme system with focus on:

- **Flexible color palette** - Customizable primary/secondary colors
- **Modern UI** - Built with Tailwind CSS v4
- **Dark/Light mode** - Full theme switching support
- **Accessibility** - OKLCH color space for better contrast

---

## 🎨 **Color Palette**

### **Primary Colors**

```css
/* Light Mode */
--primary: oklch(0.55 0.15 160); /* Main brand color */
--primary-foreground: oklch(0.98 0.01 160); /* Text on primary */

/* Dark Mode */
--primary: oklch(0.6 0.15 160); /* Lighter shade for dark mode */
--primary-foreground: oklch(0.05 0.01 160); /* Text on primary */
```

**Usage:**

- Primary buttons
- Brand elements
- Active states
- Call-to-action elements

### **Secondary Colors**

```css
/* Light Mode */
--secondary: oklch(0.95 0.02 160); /* Very light teal */
--secondary-foreground: oklch(0.25 0.08 160); /* Dark teal text */

/* Dark Mode */
--secondary: oklch(0.15 0.02 160); /* Dark teal */
--secondary-foreground: oklch(0.85 0.02 160); /* Light teal text */
```

**Usage:**

- Secondary buttons
- Card backgrounds
- Subtle highlights

### **Background Colors**

```css
/* Light Mode */
--background: oklch(0.99 0.005 160); /* Almost white with slight teal tint */
--foreground: oklch(0.15 0.02 160); /* Dark text */

/* Dark Mode */
--background: oklch(0.08 0.01 160); /* Very dark with teal tint */
--foreground: oklch(0.9 0.01 160); /* Light text */
```

### **Chart Colors**

```css
--chart-1: oklch(0.55 0.15 160); /* Primary */
--chart-2: oklch(0.6 0.12 180); /* Secondary */
--chart-3: oklch(0.7 0.18 140); /* Tertiary */
--chart-4: oklch(0.8 0.15 80); /* Quaternary */
--chart-5: oklch(0.45 0.12 200); /* Quinary */
```

---

## 🧩 **Component Styles**

### **Cards**

```tsx
// Standard card với hover effect
<Card className="card-hover">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

**CSS Class:**

```css
.card-hover {
  @apply transition-all duration-200 hover:shadow-lg hover:scale-[1.02];
}
```

### **Buttons**

```tsx
// Primary button (emerald theme)
<Button>Primary Action</Button>

// Secondary button
<Button variant="secondary">Secondary</Button>

// Outline button
<Button variant="outline">Outline</Button>

// Destructive button (red)
<Button variant="destructive">Delete</Button>
```

### **Typography**

```tsx
// Main heading with gradient text
<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
  Dashboard Title
</h1>

// Subtitle
<p className="text-muted-foreground mt-2">
  Your application description
</p>

// Section heading
<h2 className="text-2xl font-semibold mb-6">Section Title</h2>
```

---

## 📊 **Dashboard Layout Pattern**

### **Page Structure**

```tsx
export default function PageName() {
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Page Title
          </h1>
          <p className="text-muted-foreground mt-2">Page description</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">{/* Stat cards here */}</div>

      {/* Main Content */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Content Section</h2>
        {/* Content grid */}
      </div>
    </div>
  );
}
```

### **Stats Card Pattern**

```tsx
<Card className="card-hover">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Metric Name</CardTitle>
    <Icon className="h-4 w-4 text-primary" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">Value</div>
    <p className="text-xs text-muted-foreground">Change description</p>
  </CardContent>
</Card>
```

---

## 🎯 **Icon Usage**

### **Lucide Icons**

```tsx
import {
  Home, // Home/Dashboard
  Users, // Users
  Settings, // Settings
  Bell, // Notifications
  Search, // Search
  Menu, // Menu
  X, // Close
  ChevronRight, // Navigation
} from 'lucide-react';
```

### **Icon Color Guidelines**

```tsx
// Primary icons (brand color)
<Home className="h-4 w-4 text-primary" />

// Status icons
<Check className="h-4 w-4 text-green-500" />    // Success
<AlertCircle className="h-4 w-4 text-amber-500" /> // Warning
<XCircle className="h-4 w-4 text-red-500" />    // Error
```

---

## 🔄 **Status Colors**

### **Common Status Styles**

```css
/* Success - Green */
.status-success {
  @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200;
}

/* Warning - Amber */
.status-warning {
  @apply bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200;
}

/* Info - Blue */
.status-info {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200;
}

/* Error - Red */
.status-error {
  @apply bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200;
}
```

---

## 📱 **Responsive Grid System**

### **Standard Grid Patterns**

```tsx
// Stats cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Content cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

// Two column layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

// Form layout
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```

---

## 🌙 **Dark Mode Guidelines**

### **Theme Toggle Component**

```tsx
import { ThemeToggle } from '@/app/shared/components';

// Always place in header
<div className="flex items-center justify-between mb-8">
  <div>{/* Page title */}</div>
  <ThemeToggle />
</div>;
```

### **Dark Mode Color Adjustments**

- **Backgrounds**: Darker với subtle teal tint
- **Text**: Lighter colors với good contrast
- **Cards**: Slightly lighter than background
- **Borders**: More subtle, less contrast

---

## 🎨 **Custom CSS Classes**

### **Animation Classes**

```css
.card-hover {
  @apply transition-all duration-200 hover:shadow-lg hover:scale-[1.02];
}

.fade-in {
  @apply animate-in fade-in duration-300;
}

.slide-up {
  @apply animate-in slide-in-from-bottom-4 duration-300;
}
```

### **Gradient Text**

```css
.gradient-text {
  @apply bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent;
}
```

---

## 📋 **Component Checklist**

### **Khi tạo component mới:**

- [ ] Sử dụng semantic color tokens (`text-primary`, `bg-secondary`)
- [ ] Thêm dark mode support
- [ ] Responsive design (mobile-first)
- [ ] Hover states và transitions
- [ ] Proper icon usage với consistent sizing
- [ ] Vietnamese text content
- [ ] Accessibility considerations

### **Page Layout Checklist:**

- [ ] Header với gradient title
- [ ] ThemeToggle trong header
- [ ] Proper spacing (`p-6`, `mb-8`, `gap-6`)
- [ ] Grid system cho responsive
- [ ] Consistent card styling
- [ ] Loading states
- [ ] Error handling

---

## 🔧 **Development Tips**

### **Color Usage:**

1. **Primary**: Main actions, brand elements
2. **Secondary**: Supporting elements, backgrounds
3. **Muted**: Subtle text, disabled states
4. **Accent**: Highlights, hover states
5. **Destructive**: Errors, delete actions

### **Spacing Scale:**

- `gap-4`: Small spacing (16px)
- `gap-6`: Standard spacing (24px)
- `gap-8`: Large spacing (32px)
- `p-6`: Page padding (24px)
- `mb-8`: Section margins (32px)

### **Typography Scale:**

- `text-3xl font-bold`: Page titles
- `text-2xl font-semibold`: Section titles
- `text-sm font-medium`: Card titles
- `text-xs text-muted-foreground`: Descriptions

---

## 🎯 **Examples**

### **Basic Card**

```tsx
<Card className="card-hover">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="text-lg">Card Title</CardTitle>
      <Badge className="status-success">Active</Badge>
    </div>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span>Additional info</span>
    </div>
  </CardContent>
</Card>
```

### **Stats Dashboard**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <Card className="card-hover">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Items</CardTitle>
      <Icon className="h-4 w-4 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">24</div>
      <p className="text-xs text-muted-foreground">+2 from last month</p>
    </CardContent>
  </Card>
</div>
```

---

## 🎨 **Customization Tips**

1. **Change Primary Color**: Update `--primary` values in theme configuration
2. **Add Custom Colors**: Define new CSS variables following OKLCH format
3. **Component Variants**: Extend shadcn/ui components with custom variants
4. **Typography**: Adjust font sizes and weights in Tailwind config

---

**Status:** ✅ Theme guideline complete - Ready for UI development
