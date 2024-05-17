export interface FormatServiceInterface {
  getMonthName: (n: number) => string;
  renderDateOperation: (date: Date) => string;
  renderMonth: (date: Date | null) => string;
  renderMonthFromSimplified: (simplified: string) => string;
  renderMontant: (value: number) => string;
}

const FormatService = function (): FormatServiceInterface {
  const monthName = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  const getMonthName = (n: number): string => {
    return monthName[n - 1];
  };

  const renderDateOperation = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderMonth = (date: Date | null): string => {
    if (null === date) {
      return '';
    }
    let format = date
      .toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      .split(' ');
    return format[1] + ' ' + format[2];
  };

  /**
   * Formatte le mois à partir d'une chaine de type 'YYYY-mm'
   */
  const renderMonthFromSimplified = (simplified: string): string => {
    let y_m = simplified.split('-');
    return getMonthName(parseInt(y_m[1])) + ' ' + y_m[0];
  };

  const renderMontant = (value: number): string => {
    function numberWithCommas(x: number) {
      return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    return numberWithCommas(value).replace('-', '- ');
  };

  return {
    getMonthName,
    renderDateOperation,
    renderMonth,
    renderMonthFromSimplified,
    renderMontant,
  };
};

export default FormatService;
