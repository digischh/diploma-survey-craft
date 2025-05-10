export const getBarColors = (): {
  barColors: string[];
  barBorderColors: string[];
} => {
  const rootStyles = getComputedStyle(document.documentElement);
  const barColors = [];
  const barBorderColors = [];

  for (let i = 1; i <= 10; i++) {
    barColors.push(rootStyles.getPropertyValue(`--bar-color-${i}`).trim());
    barBorderColors.push(
      rootStyles.getPropertyValue(`--bar-border-color-${i}`).trim()
    );
  }

  return { barColors, barBorderColors };
};
