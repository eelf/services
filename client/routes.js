
import {ServicesList, MethodsList} from './components';
import React from 'react';
import {observer, inject} from 'mobx-react';

const injector = inject('store');

export default {
    index: {
        default: true,
        path: '/',
        component: React.createElement(injector(observer(ServicesList))),
        enter: (route, args, store) => store.getServices()
    },
    service: {
        path: '/service/{service:string}',
        component: React.createElement(injector(observer(MethodsList))),
        enter: (route, args, store) => store.chooseService(args.service),
    }
};
