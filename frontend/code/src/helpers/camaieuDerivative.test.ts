import { camaieuDerivative } from './categories';

it('camaieu generation', () => {
  const result = camaieuDerivative({ color: '#FF0000' }, 6, 0);

  const expected = [
    { color: '#ED1212' },
    { color: '#DB2424' },
    { color: '#C83737' },
    { color: '#B64949' },
    { color: '#A45B5B' },
    { color: '#926D6D' },
  ];

  expect(result).toStrictEqual(expected);
});
