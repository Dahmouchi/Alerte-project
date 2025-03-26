"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const DarkModeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setTheme(theme === "dark" ? "light" : "dark")
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents hydration mismatch

  return (
    <div>
      <>
        <label className="themeSwitcherThree relative inline-flex cursor-pointer select-none items-center">
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
         
          <div className="shadow-card flex h-[40px] p-2 w-[40px] items-center justify-center rounded-md border-[1px] dark:border-slate-500 border-slate-300">
          {theme === "dark" ? <Sun /> : <Moon />}
          </div>
        </label>
      </>
    </div>
  );
};

export default DarkModeSwitcher;
