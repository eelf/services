import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'mobx-react';

import RouterComp from './lib/router-component';

import Store from './store';

const store = new Store();

render(
    <Provider store={store}>
        <RouterComp />
    </Provider>,
    document.getElementById('app'));
