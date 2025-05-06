export const getRandomColor = (index: number): string => {
  const colors = [
    "#4caf50",
    "#2196f3",
    "#ff9800",
    "#f44336",
    "#8bc34a",
    "#03a9f4",
    "#e91e63",
    "#ffeb3b",
  ];
  return colors[index % colors.length];
};
