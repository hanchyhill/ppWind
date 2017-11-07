const routers = [{
    path: '/',
    meta: {
        title: ''
    },
    component: (resolve) => require(['./views/pp.vue'], resolve)
}];
export default routers;