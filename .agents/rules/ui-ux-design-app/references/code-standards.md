# Quy ước code — React + TypeScript + Tailwind + shadcn/ui

## 1. Cấu trúc thư mục

```
src/
  components/
    ui/            # shadcn primitives — KHÔNG sửa logic, chỉ chỉnh variant/token
    common/        # dùng lại toàn app: PageHeader, DataTable, EmptyState, StatusBadge…
    <feature>/     # component theo nghiệp vụ: orders/OrderTable.tsx
  layouts/         # AppShell, AuthLayout, MarketingLayout
  hooks/           # useDebounce, useMediaQuery, useDisclosure…
  lib/             # utils.ts (cn), format.ts, constants.ts
  styles/          # globals.css chứa token
```

Quy tắc đặt tên: component `PascalCase.tsx`, hook `useCamelCase.ts`, util `camelCase.ts`.
File > 300 dòng → tách. Component > 150 dòng → tách sub-component.

---

## 2. Mười luật code bắt buộc

1. Class động **luôn** qua `cn()` (`clsx` + `tailwind-merge`). Không nối chuỗi class bằng `+`
2. Biến thể component dùng **`cva`**, không rải `if` trong JSX
3. Chỉ dùng class Tailwind ánh xạ token. **Cấm** `text-[#2563EB]`, `p-[13px]`, `z-[9999]`
4. Thứ tự class chuẩn hoá bằng `prettier-plugin-tailwindcss` (bắt buộc cài)
5. Dùng `asChild` (Radix Slot) khi cần đổi thẻ gốc, không `cloneElement` thủ công
6. Mọi list phải có `key` ổn định (id) — **không dùng index**
7. State UI cục bộ (mở/đóng modal) không đưa vào global store
8. Ảnh luôn có `width`/`height` hoặc `aspect-ratio` để chống CLS; `loading="lazy"` cho ảnh dưới màn
9. Icon dùng `lucide-react`, `className="size-4"` (16) / `size-5` (20) / `size-6` (24), `strokeWidth` 1.75–2
10. `localStorage` chỉ lưu preference (theme, density, cột hiển thị) — không lưu dữ liệu nghiệp vụ

---

## 3. `cn()` — bắt buộc có

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 4. Mẫu `cva` chuẩn (Button)

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium " +
  "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none " +
  "disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        md: "h-9 px-4",
        lg: "h-11 px-6 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
```

---

## 5. Mẫu `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1440px" } },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)", sm: "var(--shadow-sm)", md: "var(--shadow-md)",
        lg: "var(--shadow-lg)", xl: "var(--shadow-xl)",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
        decelerate: "cubic-bezier(0.05, 0.7, 0.1, 1)",
      },
      zIndex: {
        sticky: "10", header: "20", nav: "30", overlay: "40",
        modal: "50", dropdown: "60", toast: "70", tooltip: "80", palette: "90",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

## 6. Mẫu component chuẩn

### PageHeader

```tsx
export function PageHeader({ title, description, children }: {
  title: string; description?: string; children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border px-6 py-6 lg:px-8
                    sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}
```

### EmptyState

```tsx
export function EmptyState({ icon: Icon, title, description, action }: {
  icon: LucideIcon; title: string; description?: string; action?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
```

### TableSkeleton

```tsx
export function TableSkeleton({ rows = 8, cols = 6 }) {
  return (
    <div className="divide-y divide-border" aria-busy="true" aria-label="Đang tải dữ liệu">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex h-11 items-center gap-3 px-3">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c}
                 className="h-3.5 flex-1 animate-pulse rounded bg-muted"
                 style={{ maxWidth: c === 0 ? 40 : undefined }} />
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

## 7. Performance

| Vấn đề | Giải pháp |
|--------|-----------|
| CLS do ảnh | `width`/`height` hoặc `aspect-ratio` cố định |
| CLS do font | `font-display: swap` + preload font chính |
| Danh sách > 200 dòng | `@tanstack/react-virtual` |
| Re-render thừa | `React.memo` cho row component, `useCallback` cho handler truyền xuống |
| Bundle lớn | `React.lazy` theo route, tree-shake icon (import named từ `lucide-react`) |
| Animation giật | Chỉ `transform`/`opacity`, thêm `will-change` khi cần |
| Search gõ liên tục | Debounce 300ms, huỷ request cũ bằng `AbortController` |

Ngân sách: LCP < 2.5s · CLS < 0.1 · INP < 200ms.

---

## 8. Công cụ bắt buộc trong repo

```
prettier-plugin-tailwindcss    # sắp xếp class tự động
eslint-plugin-jsx-a11y         # bắt lỗi a11y khi lint
@axe-core/react                # kiểm a11y lúc dev
tailwind-merge + clsx          # cn()
class-variance-authority       # cva
tailwindcss-animate            # animation preset cho Radix
```

Rule ESLint nên bật: `jsx-a11y/alt-text`, `jsx-a11y/anchor-is-valid`,
`jsx-a11y/click-events-have-key-events`, `jsx-a11y/no-static-element-interactions`,
`jsx-a11y/label-has-associated-control`.
