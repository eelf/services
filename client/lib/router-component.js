import React from 'react';
import {observer, inject} from "mobx-react";

const Comp = ({store}) => {
    return store.view ? store.view : <div>loading</div>;
};

export default inject('store')(observer(Comp));
