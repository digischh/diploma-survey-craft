import { KanoAnswer } from "../../../types";

export const category = [
  "Важные",
  "Обязательные",
  "Интересные",
  "Сомнительные",
  "Безразличные",
  "Противоречивые",
];

export const summCat = (arr: number[]) => arr.reduce((sum, val) => sum + val, 0);

export const classifyKano = (
  functional: number,
  dysfunctional: number
): number => {
  if (functional === 4 && dysfunctional === 2) return 0;
  if (
    (functional === 4 && dysfunctional === 2) ||
    (functional === 4 && dysfunctional === 0)
  )
    return 1;

  if (
    (functional === 2 && dysfunctional === 4) ||
    (functional === 0 && dysfunctional === 4)
  )
    return 2;
  if (
    (functional === 4 && dysfunctional === -1) ||
    (functional === -1 && dysfunctional === 4)
  )
    return 3;

  if (
    (functional === 2 && dysfunctional === 2) ||
    (functional === 2 && dysfunctional === 0) ||
    (functional === 0 && dysfunctional === 2) ||
    (functional === 0 && dysfunctional === 0)
  )
    return 4;

  return 5;
};

export const classifyChoices = (
  choices: KanoAnswer[]
): { [key: string]: number[] } => {
  const featureMap: { [key: string]: number[] } = {};
  choices.forEach((choice) => {
    const curCategory = classifyKano(choice.positive, choice.negative);

    if (!featureMap[choice.title]) {
      featureMap[choice.title] = [0, 0, 0, 0, 0, 0];
    }
    featureMap[choice.title][curCategory]++;
  });
  return featureMap;
};
