import {observable} from "mobx";
import Api from "./lib/api";
import proto from "../proto/proto";
import Router from "./lib/router";
import routes from "./routes";

export default class {
    @observable view;

    @observable services = [];

    @observable methods = [];

    s;
    router;
    constructor() {
        const api = new Api('/api.php', proto);
        this.s = new proto.services['eelf.svc.Services'](api);
        this.router = new Router(routes, this);
        this.router.popstate({state: this.router.urlToPage(location.pathname)});
    }

    getServices() {
        return this.s.List(new proto.messages['google.protobuf.Empty']())
            .then(sl => {
                /** @type sl ServicesList */
                this.services = sl.getService();
            })
            .catch(e => {
            });
    }

    chooseService(service) {
        return this.s.Service((new proto.messages['eelf.svc.ServiceName']).setName(service))
            .then(sd => {
                /** @type ServiceDescriptor sd */
                this.methods = sd.getMeth().map(m => [m.getName(), m.getArgs()]);
            })
            .catch(e => {
            });
    }
};
