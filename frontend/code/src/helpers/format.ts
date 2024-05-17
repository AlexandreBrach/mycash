const monthName = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const getMonthName = (n: number) => monthName[n - 1];

export const renderDateOperation = (date: Date) =>
  date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const renderMonth = (date: Date) => {
  let format = date
    .toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .split(" ");
  return format[1] + " " + format[2];
};

/**
 * Formatte le mois à partir d'une chaine de type 'YYYY-mm'
 */
export const renderMonthFromSimplified = (simplified: string) => {
  let y_m = simplified.split("-");
  return getMonthName(parseInt(y_m[1])) + " " + y_m[0];
};
