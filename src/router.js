const routers = [{
    path: '/',
    meta: {
        title: 'PP法强风预报'
    },
    component: (resolve) => require(['./views/pp.vue'], resolve)
}];
export default routers;