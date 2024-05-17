import { assembleBackendCategoryTree } from './categories';

const raw = {
  '45': {
    name: 'general',
    color: '#32ff00',
    children: {
      '47': {
        name: 'depense',
        color: '#None',
        children: {
          '15': {
            name: 'courses',
            color: '#None',
          },
          '18': {
            name: 'divers',
            color: '#None',
          },
        },
      },
      '46': {
        name: 'impot',
        color: '#None',
        children: {
          '29': {
            name: 'impot locaux',
            color: '#None',
          },
          '17': {
            name: 'taxe habitation',
            color: '#None',
          },
          '16': {
            name: 'isf',
            color: '#None',
          },
        },
      },
    },
  },
  '49': {
    name: 'Abonnements',
    color: '#c8ff00',
    children: {
      '24': {
        name: 'Internet',
        color: '#None',
      },
      '14': {
        name: 'Abonnements TV',
        color: '#None',
      },

      '1': {
        name: 'EDF',
        color: '#None',
      },
    },
  },
  '50': {
    name: 'Dépenses',
    color: '#00ffcf',
  },
};

it('tree to options', () => {
  const result = assembleBackendCategoryTree(raw);

  const expected = [
    {
      id: '45',
      data: {
        name: 'general',
        color: '#32ff00',
      },
      children: [
        {
          id: '46',
          data: {
            name: 'impot',
            color: '#None',
          },
          children: [
            {
              id: '16',
              data: {
                name: 'isf',
                color: '#None',
              },
              children: [],
            },

            {
              id: '17',
              data: {
                name: 'taxe habitation',
                color: '#None',
              },
              children: [],
            },
            {
              id: '29',
              data: {
                name: 'impot locaux',
                color: '#None',
              },
              children: [],
            },
          ],
        },
        {
          id: '47',
          data: {
            name: 'depense',
            color: '#None',
          },
          children: [
            {
              id: '15',
              data: {
                name: 'courses',
                color: '#None',
              },
              children: [],
            },
            {
              id: '18',
              data: {
                name: 'divers',
                color: '#None',
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: '49',
      data: {
        name: 'Abonnements',
        color: '#c8ff00',
      },
      children: [
        {
          id: '1',
          data: {
            name: 'EDF',
            color: '#None',
          },
          children: [],
        },
        {
          id: '14',
          data: {
            name: 'Abonnements TV',
            color: '#None',
          },
          children: [],
        },
        {
          id: '24',
          data: {
            name: 'Internet',
            color: '#None',
          },
          children: [],
        },
      ],
    },
    {
      id: '50',
      data: {
        name: 'Dépenses',
        color: '#00ffcf',
      },
      children: [],
    },
  ];

  expect(result).toStrictEqual(expected);
});
