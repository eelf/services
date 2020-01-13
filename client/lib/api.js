
export default class Api {
    url;
    proto;
    constructor(url, proto) {
        this.url = url;
        this.proto = proto;
    }
    msgToJson(msg) {
        let json = {};
        Object.entries(msg.constructor.ds).forEach(([tag, info]) => {
            let v;
            if (msg.fields[info.name] === undefined) return;
            if (isNaN(info.type)) {
                if (info.repeated) {
                    v = msg.fields[info.name].map(this.msgToJson);
                } else {
                    v = this.msgToJson(msg.fields[info.name]);
                }
            } else {
                v = msg.fields[info.name];
            }
            json[info.name] = v;
        });
        return json;
    }
    jsonToMsg(json, msg) {
        Object.entries(msg.constructor.ds).forEach(([tag, info]) => {
            let v;
            if (json[info.name] === undefined) return;
            if (info.repeated) {
                msg.fields[info.name] = [];
                json[info.name].forEach(e => {
                    if (isNaN(info.type)) {
                        v = new this.proto.messages[info.type];
                        this.jsonToMsg(e, v);
                    } else {
                        v = e;
                    }
                    msg.fields[info.name].push(v);
                });
                return;
            }
            if (isNaN(info.type)) {
                v = new this.proto.messages[info.type];
                this.jsonToMsg(json[info.name], v);
            } else {
                v = json[info.name];
            }
            msg.fields[info.name] = v;
        });
    }
    call(method, data, responseType) {
        let j = this.msgToJson(data);
        let json = JSON.stringify(j);

        return fetch(this.url, {credentials: 'include', method: 'POST', body: method + ' ' + json})
            .then(r => r.text())
            .then(t => {
                let i = t.indexOf(' ');
                let res = t.substr(0, i);
                t = t.substr(i);
                if (res != 'OK') {
                    throw t;
                }
                let json = JSON.parse(t);
                let msg = new responseType;
                this.jsonToMsg(json, msg);

                return new Promise((res, rej) => res(msg));
            });
    }
};
