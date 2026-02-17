import Highcharts, { Chart, SelectEventObject, XAxisOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FC, useContext } from 'react';
import { AppContext } from '../../Pages/AppContext';
import { treeFlatten } from '../../exportable/Hierarchie/Tree';
import { Echeance } from '../../interfaces/extraits';
import { categoryDrilldown } from '../../helpers/charts';

interface Props {
  name: string;
  values: Echeance[];
}

export const GraphPrevisions: FC<Props> = ({ name, values }) => {
  const { state, dispatch } = useContext(AppContext);
  const categories = treeFlatten(state.availableCategories);
  const colors = treeFlatten(state.categoryColors);
  const series = [
    {
      name,
      type: 'pie',
      data: categoryDrilldown(
        values.map((e) => ({
          name: categories.find((c) => c.id === e.categoryId)?.data.name,
          color: colors.find((c) => c.id === e.categoryId)?.data.color,
          y: Math.abs(e.amount),
        })),
      ),
    },
  ];

  const getHighChartsSettings = (): Highcharts.Options => {
    return {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        style: {
          color: '#FFFFFF',
        },
        events: {},
      },
      title: {
        floating: true,
        text: '',
        style: {
          color: '#FFFFFF',
        },
      },
      plotOptions: {
        pie: {},
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      time: {
        timezone: 'Europe/Paris',
      },
      series: [],
    };
  };

  const settings = getHighChartsSettings();

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={{ ...settings, series }} />
    </>
  );
};
