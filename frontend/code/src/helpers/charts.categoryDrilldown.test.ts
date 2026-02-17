it('category drill down', () => {
  const color = [
    {
      id: '45',
      data: {
        color: '#00acff',
      },
    },
    {
      id: '47',
      data: {
        color: '#2A9DD5',
      },
    },
    {
      id: '18',
      data: {
        color: '#71BEE3',
      },
    },
    {
      id: '15',
      data: {
        color: '#B8DEF1',
      },
    },
    {
      id: '46',
      data: {
        color: '#558EAA',
      },
    },
    {
      id: '16',
      data: {
        color: '#80AABF',
      },
    },
    {
      id: '17',
      data: {
        color: '#AAC7D4',
      },
    },
    {
      id: '29',
      data: {
        color: '#D5E3EA',
      },
    },
    {
      id: '50',
      data: {
        color: '#ff8d00',
      },
    },
    {
      id: '13',
      data: {
        color: '#E68A19',
      },
    },
    {
      id: '33',
      data: {
        color: '#CC8833',
      },
    },
    {
      id: '32',
      data: {
        color: '#B3854D',
      },
    },
    {
      id: '51',
      data: {
        color: '#998266',
      },
    },
    {
      id: '49',
      data: {
        color: '#4800ff',
      },
    },
    {
      id: '14',
      data: {
        color: '#5319E6',
      },
    },
    {
      id: '24',
      data: {
        color: '#5E33CC',
      },
    },
    {
      id: '1',
      data: {
        color: '#694DB3',
      },
    },
    {
      id: '6',
      data: {
        color: '#746699',
      },
    },
    {
      id: '48',
      data: {
        color: '#bcff00',
      },
    },
    {
      id: '38',
      data: {
        color: '#B0E619',
      },
    },
    {
      id: '39',
      data: {
        color: '#A4CC33',
      },
    },
    {
      id: '41',
      data: {
        color: '#98B34D',
      },
    },
    {
      id: '40',
      data: {
        color: '#8C9966',
      },
    },
    {
      id: '44',
      data: {
        color: '#44ff00',
      },
    },
    {
      id: '12',
      data: {
        color: '#53DF20',
      },
    },
    {
      id: '11',
      data: {
        color: '#62BF40',
      },
    },
    {
      id: '21',
      data: {
        color: '#719F60',
      },
    },
  ];

  const availableCategories = [
    {
      id: '45',
      data: {
        name: 'Apports',
      },
      children: [
        {
          id: '47',
          data: {
            name: 'Bonnie',
          },
          children: [
            {
              id: '18',
              data: {
                name: 'Paye Bonnie',
              },
              children: [],
            },
            {
              id: '15',
              data: {
                name: 'Pour Bonnie',
              },
              children: [],
            },
          ],
        },
        {
          id: '46',
          data: {
            name: 'Clyde',
          },
          children: [
            {
              id: '16',
              data: {
                name: 'Pour Clyde',
              },
              children: [],
            },
            {
              id: '17',
              data: {
                name: 'Paye Clyde',
              },
              children: [],
            },
            {
              id: '29',
              data: {
                name: 'Transport Clyde',
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: '50',
      data: {
        name: 'Dépenses',
      },
      children: [
        {
          id: '13',
          data: {
            name: 'Munitions',
          },
          children: [],
        },
        {
          id: '33',
          data: {
            name: 'Diverses',
          },
          children: [],
        },
        {
          id: '32',
          data: {
            name: 'Essence',
          },
          children: [],
        },
        {
          id: '51',
          data: {
            name: 'Stock',
          },
          children: [],
        },
      ],
    },
    {
      id: '49',
      data: {
        name: 'Abonnements',
      },
      children: [
        {
          id: '14',
          data: {
            name: 'Abonnements TV',
          },
          children: [],
        },
        {
          id: '24',
          data: {
            name: 'Internet',
          },
          children: [],
        },
        {
          id: '1',
          data: {
            name: 'EDF',
          },
          children: [],
        },
      ],
    },
    {
      id: '44',
      data: {
        name: 'Impôts et Allocs',
      },
      children: [
        {
          id: '12',
          data: {
            name: 'Taxe Habitation',
          },
          children: [],
        },
        {
          id: '11',
          data: {
            name: 'Impôt foncier',
          },
          children: [],
        },
      ],
    },
  ];

  const amount = [
    {
      amount: -100,
      override: false,
      categoryId: '13',
      date: {
        date: '2026-02-01T00:00:00.000Z',
      },
    },
    {
      amount: -200,
      override: false,
      categoryId: '23',
      date: {
        date: '2026-02-01T00:00:00.000Z',
      },
    },
    {
      amount: -300,
      override: false,
      categoryId: '4',
      date: {
        date: '2026-02-01T00:00:00.000Z',
      },
    },
    {
      amount: -120,
      override: false,
      categoryId: '11',
      date: {
        date: '2026-02-01T00:00:00.000Z',
      },
    },
    {
      amount: -240,
      override: false,
      categoryId: '2',
      date: {
        date: '2026-02-01T00:00:00.000Z',
      },
    },
    {
      amount: -360,
      override: false,
      categoryId: '6',
      date: {
        date: '2026-02-01T00:00:00.000Z',
      },
    },
    {
      amount: -150,
      override: false,
      categoryId: '20',
      date: {
        date: '2026-02-01T00:00:00.000Z',
      },
    },
    {
      amount: -250,
      override: false,
      categoryId: '25',
      date: {
        date: '2026-02-01T00:00:00.000Z',
      },
    },
    {
      amount: -350,
      override: false,
      categoryId: '5',
      date: {
        date: '2026-02-01T00:00:00.000Z',
      },
    },
    {
      amount: -175,
      override: false,
      categoryId: '36',
      date: {
        date: '2026-02-01T00:00:00.000Z',
      },
    },
    {
      amount: -275,
      override: false,
      categoryId: '26',
      date: {
        date: '2026-02-01T00:00:00.000Z',
      },
    },
    {
      amount: -375,
      override: false,
      categoryId: '24',
      date: {
        date: '2026-02-01T00:00:00.000Z',
      },
    },
  ];

  const expected = (data = [
    {
      y: 61.04,
      color: colors[2],
      drilldown: {
        name: 'Apports',
        categories: ['Bonnie', 'Paye Bonnie', 'Pour Bonnie', 'Chrome v94.0', 'Chrome v93.0'],
        data: [
          36.89, 18.16, 0.54, 0.7, 0.8, 0.41, 0.31, 0.13, 0.14, 0.1, 0.35, 0.17, 0.18, 0.17, 0.21, 0.1, 0.16, 0.43,
          0.11, 0.16, 0.15, 0.14, 0.11, 0.13, 0.12,
        ],
      },
    },
    {
      y: 9.47,
      color: colors[3],
      drilldown: {
        name: 'Safari',
        categories: [
          'Safari v15.3',
          'Safari v15.2',
          'Safari v15.1',
          'Safari v15.0',
          'Safari v14.1',
          'Safari v14.0',
          'Safari v13.1',
          'Safari v13.0',
          'Safari v12.1',
        ],
        data: [0.1, 2.01, 2.29, 0.49, 2.48, 0.64, 1.17, 0.13, 0.16],
      },
    },
    {
      y: 9.32,
      color: colors[5],
      drilldown: {
        name: 'Edge',
        categories: ['Edge v97', 'Edge v96', 'Edge v95'],
        data: [6.62, 2.55, 0.15],
      },
    },
    {
      y: 8.15,
      color: colors[1],
      drilldown: {
        name: 'Firefox',
        categories: [
          'Firefox v96.0',
          'Firefox v95.0',
          'Firefox v94.0',
          'Firefox v91.0',
          'Firefox v78.0',
          'Firefox v52.0',
        ],
        data: [4.17, 3.33, 0.11, 0.23, 0.16, 0.15],
      },
    },
    {
      y: 11.02,
      color: colors[6],
      drilldown: {
        name: 'Other',
        categories: ['Other'],
        data: [11.02],
      },
    },
  ]);
});
