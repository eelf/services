import FastRoute from "fast-route";

export default class {
    routes;
    default;
    fast_route;
    store;
    constructor(routes, store) {
        this.routes = routes;
        Object.entries(routes).forEach(([k, v]) => v.name = k); // add name property to route, used in calls to history api
        this.store = store;//
        this.fast_route = new FastRoute;

        Object.entries(routes).forEach(([k, v]) => {
            this.fast_route.addRoute('GET', v.path, k);
            if (v.default) this.default = k;
        });
        window.addEventListener('popstate', this.popstate.bind(this), false);
    }
    popstate(ev) {
        let page = ev.state && ev.state.page || this.default;
        let args = ev.state && ev.state.args || {};

        let p = this.routes[page].enter(page, args, this.store);
        if (p instanceof Promise) {
            // console.log('route.enter is promise');
            p.then(() => {
                // console.log('route.enter promise fulfiled', this.routes[page].component, this.store);
                this.store.view = this.routes[page].component
            });
        } else {
            // console.log('route.enter is not promise', this.store.view, this.routes[page].component);
            this.store.view = this.routes[page].component;
        }
    }
    pushstate(route, args) {
        history.pushState({page: route.name, args}, '', this.pageToUrl(route, args));
        this.popstate({state: {page: route.name, args}});
    }
    pageToUrl(route, args) {
        return route.path.replace(/{([a-zA-Z_]\w*)(|:(\w*))}/g, (...param) => {
            return args[param[1]];
        });
    };
    urlToPage(url) {
        let res = this.fast_route.dispatch('GET', url);
        if (res.status !== 200) {
            // console.log(res);
            throw ['unknown url', url, JSON.stringify(res)];
        }
        return {page: res.handler, args: Object.values(res.params || {})}
    }
}
