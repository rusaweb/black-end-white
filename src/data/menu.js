/*
 * Main and demo navigation arrays
 *
 * 'to' attribute points to the route name, not the path url
 */

export default {
  main: [
    // {
    //   name: 'Панель управления',
    //   to: 'admin',
    //   icon: 'fa fa-desktop',
    // },
    {
      name: 'Потребители',
      heading: true,
      roles: ["ADMINISTRATOR", "OPERATOR"]
    },
    {
      name: 'Лиды',
      to: 'leads',
      icon: 'fa fa-user-clock',
      roles: ["ADMINISTRATOR", "OPERATOR"]
    },
    {
      name: 'Клиенты',
      to: 'clients-operator',
      icon: 'fa fa-user-group',
      roles: ["ADMINISTRATOR", "OPERATOR"]
    },
    {
      name: 'Клиенты (Administrator)',
      to: 'clients-administrator',
      icon: 'fa fa-user-group',
      roles: ["ADMINISTRATOR"]
    },
    {
      name: 'Химчистка',
      heading: true,
      roles: ["PACKAGER", "ADMINISTRATOR", "TECHNOLOGIST", "OPERATOR"]
    },
    {
      name: 'Заказы (User)',
      to: 'order-user',
      icon: 'fa fa-bag-shopping',
    },
    {
      name: 'Заказы',
      to: 'order-operator',
      icon: 'fa fa-bag-shopping',
      roles: ["ADMINISTRATOR", "OPERATOR"]
    },
    // {
    //   name: 'Заказы (Courier)',
    //   to: 'order-courier',
    //   icon: 'fa fa-bag-shopping',
    //   sub: [
    //     {
    //       name: 'Привезти',
    //       to: 'get-order-courier',
    //     },
    //     {
    //       name: 'Отвезти',
    //       to: 'push-order-courier',
    //     },
    //   ],
    // },
    // {
    //   name: 'Заказы (Technologist)',
    //   to: 'order-technologist',
    //   icon: 'fa fa-bag-shopping',
    // },
    {
      name: 'Специалисты',
      to: 'specialists',
      icon: 'fa-solid fa-hand-sparkles',
      roles: ["ADMINISTRATOR", "TECHNOLOGIST"]
    },
    {
      name: 'Упаковщик',
      to: 'packager',
      icon: 'fa-solid fa-box',
      roles: ["ADMINISTRATOR", "PACKAGER"]
    },
    {
      name: 'Обследование',
      to: 'survey',
      icon: 'fa fa-barcode',
      roles: ["ADMINISTRATOR", "OPERATOR"]
    },
    {
      name: 'Обследование (Специалист)',
      to: 'survey-technologist',
      icon: 'fa fa-barcode',
      roles: ["ADMINISTRATOR", "TECHNOLOGIST"]
    },
    {
      name: 'Сотрудники',
      to: 'users',
      icon: 'fa fa-users',
      roles: ["ADMINISTRATOR"]
    },
    {
      name: 'Склад (Administrator)',
      to: 'stocks-administrator',
      icon: 'fa fa-cubes',
      roles: ["ADMINISTRATOR"]
    },
    {
      name: 'Склад',
      to: 'stocks-technologist',
      icon: 'fa fa-cubes',
      roles: ["ADMINISTRATOR", "TECHNOLOGIST"]
    },
    // {
    //   name: 'Отчеты',
    //   heading: true,
    // },
    {
      name: 'Расходы',
      to: 'consumption',
      icon: 'fa-solid fa-arrow-trend-down',
      roles: ["ADMINISTRATOR"]
    },
    {
      name: 'Теги',
      to: '',
      icon: 'fa-solid fa-tag',
      roles: ["ADMINISTRATOR", "OPERATOR"],
      sub: [
        {
          name: 'Цвет',
          to: 'tag-color',
        },
        {
          name: 'Пол',
          to: 'tag-sex',
        },
        {
          name: 'Дефекты',
          to: 'tag-defect',
        },
      ]
    },
    {
      name: 'Администрация',
      heading: true,
      roles: ["ADMINISTRATOR"]
    },
    {
      name: 'Статистика',
      to: 'analytics',
      icon: 'fa-solid fa-chart-column',
      roles: ["ADMINISTRATOR"]
    },
    {
      name: 'Промо-Коды',
      to: 'promo-code',
      icon: 'fa-solid fa-rectangle-ad',
      roles: ["ADMINISTRATOR"]
    },
    {
      name: 'Акксессуары',
      to: 'accessory',
      icon: 'fa-solid fa-hat-wizard',
      roles: ["ADMINISTRATOR"]
    },
    {
      name: 'Настройки',
      to: 'settings',
      icon: 'fa fa-gear',
      roles: ["ADMINISTRATOR"],
      sub: [
        {
          name: 'Вещи',
          to: '',
          sub: [
            {
              name: 'Категории',
              to: 'order-item-category',
            },
            {
              name: 'Дополнительная обработка',
              to: 'additional-processing',
            },
            {
              name: 'Список вещей',
              to: 'order-item-type',
            },
          ]
        },
        {
          name: 'Вешалки',
          to: '',
          sub: [
            {
              name: 'Категории',
              to: 'hanger-category',
            },
            {
              name: 'Список',
              to: 'hanger-list',
            },
          ]
        },
        {
          name: 'Этапы',
          to: 'order-item-step',
        },
        {
          name: 'Дополнительные услуги',
          to: 'additional-services',
        },
        {
          name: 'Тарифы',
          to: 'tariffs',
        },
        {
          name: 'Статусы',
          to: 'status',
        },
        {
          name: 'Ещё',
          to: 'more',
        },
      ],
    },
  ],
};
