// src/modules/qrcode/router/route.ts
import QRPage from '../pages/Index.vue';

const qrRoutes = [
  {
    path: '/qr-generator',
    name: 'QRPage',
    component: QRPage,
  }
];

export default qrRoutes;
