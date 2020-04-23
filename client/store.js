import {observable} from "mobx";
import Api from "./lib/api";
import Router from "./lib/router";

import routes from "./routes";

import * as proto from "./proto/s_pb";
import * as svc from "./proto/s_grpc_pb";

export default class {
    @observable view;

    @observable services = [];

    @observable methods = [];

    s;
    router;
    constructor() {
        const api = new Api('/api.php');
        this.s = new svc.Services(api);
        this.router = new Router(routes, this);
        this.router.popstate({state: this.router.urlToPage(location.pathname)});
    }

    getServices() {
        return this.s.List(new proto.ListRequest(), proto.ListResponse)
            .then(sl => {
                this.services = sl.getServiceList();
            });
    }

    chooseService(service) {
        return this.s.Service(new proto.ServiceRequest({name: service}), proto.ServiceResponse)
            .then(sd => {
                this.methods = sd.getMethList().map(m => [m.getName(), m.getArgsList()]);
            });
    }
};
