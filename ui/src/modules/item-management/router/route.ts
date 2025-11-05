// src/modules/item/router/route.ts
import ItemPage from '../pages/Index.vue';
import FormPage from '../pages/Form.vue';

const itemRoutes = [
  {
    path: '/item-management',
    name: 'ItemPage',
    component: ItemPage,
  },
  {
    path: '/item-management/create',
    name: 'CreateItemPage',
    component: FormPage,  // New route for creating an item
  },
  {
    path: '/item-management/edit/:id',  // New route for editing an item
    name: 'EditItemPage',
    component: FormPage,  // Edit Item page (New)
  },
];

export default itemRoutes;
