import { useState } from "react";
import { toast } from "react-toastify";

export const useLoadCSSFile = (event: React.ChangeEvent<HTMLInputElement>) => {
  const [customStyle, setCustomStyle] = useState<HTMLStyleElement | null>(null);

  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    if (customStyle) {
      document.head.removeChild(customStyle);
    }

    const newStyle = document.createElement("style");
    newStyle.innerHTML = e.target?.result as string;
    document.head.appendChild(newStyle);
    setCustomStyle(newStyle);
    console.log("CSS файл успешно загружен и применен.");
    toast.success("CSS файл успешно загружен и применен");
  };

  reader.onerror = () => {
    console.error("Ошибка при чтении CSS файла");
    toast.warn("Ошибка при чтении CSS файла");
  };

  reader.readAsText(file);
};
