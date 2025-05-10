import { KanoAnswer } from "../../../types";

export const classifyMoSCoWChoices = (
  choices: KanoAnswer[]
): { [key: string]: number[] } => {
  const classifyMoSCoW = (
    functional: number,
    dysfunctional: number
  ): string => {
    if (
      (functional === 4 && dysfunctional === 2) ||
      (functional === 4 && dysfunctional === 0)
    )
      return "Must";
    if (
      (functional === 2 && dysfunctional === 4) ||
      (functional === 0 && dysfunctional === 4)
    )
      return "Should";
    if (
      (functional === 4 && dysfunctional === -1) ||
      (functional === -1 && dysfunctional === 4)
    )
      return "Could";
    if (
      (functional === 2 && dysfunctional === 2) ||
      (functional === 2 && dysfunctional === 0) ||
      (functional === 0 && dysfunctional === 2) ||
      (functional === 0 && dysfunctional === 0)
    )
      return "Won't";
    return "Needs Analysis";
  };

  const featureMap: { [key: string]: number[] } = {};

  choices.forEach((choice) => {
    const curCategory = classifyMoSCoW(choice.positive, choice.negative);

    if (!featureMap[choice.title]) {
      featureMap[choice.title] = [0, 0, 0, 0];
    }

    switch (curCategory) {
      case "Must":
        featureMap[choice.title][0]++;
        break;
      case "Should":
        featureMap[choice.title][1]++;
        break;
      case "Could":
        featureMap[choice.title][2]++;
        break;
      case "Won't":
        featureMap[choice.title][3]++;
        break;
      default:
        break;
    }
  });

  return featureMap;
};
