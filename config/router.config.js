export default [
  {
    path: '/',
    redirect: '/scaffold/homePage',
  },
  {
    path: '/scaffold',
    component: '../layouts',
    routes: [
      {
        path: './homePage',
        component: './base/index',
      },
      {
        path: './searchPage',
        component: './home/searchPage',
      },
      {
        path: './knowledge',
        component: './graph/knowledge',
      },
      {
        path: './kgPage',
        component: './newKg/index',
      },
      {
        path: './collection',
        component: './collection/index',
      },
    ],
  },
]
