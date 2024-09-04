import * as functions from "./functions"

const themeConfig = {
  app: {
    appName: '',
    // appLogoImage: require('@src/assets/logo.png').default
    appLogoImage: "https://cdn11.bigcommerce.com/s-5h8rqg02f8/images/stencil/250x100/subtract_1617795361__77099.original.png"
  },
  layout: {
    isRTL: false,
    skin: 'light', // light, dark, bordered, semi-dark
    routerTransition: 'fadeIn', // fadeIn, fadeInLeft, zoomIn, none or check this for more transition https://animate.style/
    type: 'vertical', // vertical, horizontal
    contentWidth: 'full', // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: false
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: 'floating', // static , sticky , floating, hidden
      backgroundColor: 'white' // BS color options [primary, success, etc]
    },
    footer: {
      type: 'static' // static, sticky, hidden
    },
    customizer: false,
    scrollTop: true // Enable scroll to top button,
  },
   backendUrl: "http://localhost:7000/api/",
   //backendUrl: "https://ishan.projectdemo.company/api",
   //backendUrl: "https://ishantechnologies.com/api",
  maxBulkOrders: 1000,
  functions
}

export default themeConfig