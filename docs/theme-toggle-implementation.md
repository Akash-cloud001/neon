# Theme Toggle Implementation

This document outlines the implementation of the theme toggle functionality in the application.

## 1. Theme Management

- **`next-themes` package:** The theme is managed using the `next-themes` package, which provides a simple way to switch between light, dark, and system themes.

- **`ThemeProvider` component:** A `ThemeProvider` component was created in `src/components/theme-provider.tsx`. This component wraps the entire application in `src/app/layout.tsx` and provides the theme context to all child components.

  **`src/components/theme-provider.tsx`**
  ```tsx
  "use client"

  import * as React from "react"
  import { ThemeProvider as NextThemesProvider } from "next-themes"
  import { type ThemeProviderProps } from "next-themes/dist/types"

  export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
  }
  ```

- **`layout.tsx` integration:** The `ThemeProvider` is integrated into the root layout as follows:

  **`src/app/layout.tsx`**
  ```tsx
  import { ThemeProvider } from "@/components/theme-provider";

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en" className="dark">
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* ... rest of the layout */}
          </ThemeProvider>
        </body>
      </html>
    );
  }
  ```

## 2. Theme Toggle Button

- **`side-bar.tsx`:** The theme toggle button is implemented in the `SidebarTrigger` component in `src/components/ui/sidebar.tsx`.

- **Dropdown Menu:** The button is a dropdown menu that allows the user to select between light, dark, and system themes.

- **`useTheme` hook:** The `useTheme` hook from `next-themes` is used to get and set the current theme.

  **`src/components/ui/sidebar.tsx`**
  ```tsx
  import { Moon, Sun } from "lucide-react"
  import { useTheme } from "next-themes"

  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  function SidebarTrigger() {
    const { setTheme } = useTheme()

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  ```

## 3. Tailwind CSS Configuration

- **`tailwind.config.ts`:** A `tailwind.config.ts` file was created to enable dark mode in Tailwind CSS.

- **`darkMode: 'class'`:** The `darkMode` option is set to `'class'`, which means that the theme is applied based on the class of the `html` element.

  **`tailwind.config.ts`**
  ```ts
  import type { Config } from 'tailwindcss'

  const config: Config = {
    darkMode: 'class',
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  export default config
  ```

## 4. Applying the Theme

When the theme is changed, the `next-themes` package adds a class to the `html` element. For example, if the theme is set to `dark`, the `html` element will have the class `dark`.

Tailwind CSS then uses this class to apply the dark mode styles. For example, to change the background color of an element in dark mode, you can use the `dark:` utility class:

```html
<div class="bg-white dark:bg-black">
  <!-- ... -->
</div>
```

## 5. Adding New Themes

To add a new theme, you need to:

1.  **Add the theme to the `DropdownMenu` in `side-bar.tsx`:**

    ```tsx
    <DropdownMenuItem onClick={() => setTheme("your-new-theme")}>
      Your New Theme
    </DropdownMenuItem>
    ```

2.  **Add the theme to the `tailwind.config.ts` file:**

    You can add a new theme by extending the `theme` object in the `tailwind.config.ts` file. For example, to add a new theme called `funky`, you can do the following:

    ```ts
    const config: Config = {
      darkMode: 'class',
      content: [/* ... */],
      theme: {
        extend: {
          colors: {
            funky: {
              primary: '#ff00ff',
              secondary: '#00ffff',
            },
          },
        },
      },
      plugins: [],
    }
    ```
