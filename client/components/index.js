import React from 'react';
import routes from "./../routes";

export const ServicesList = ({store}) => {
    return <div>ServicesList
        <ul>
            {store.services.map(service => <li key={service} className="clickable"
                                               onClick={() => store.router.pushstate(routes.service, {service})}>{service}</li>)}
        </ul>
    </div>
};

export const MethodsList = ({store}) => {
    return <div>MethodsList
        <ul>
            {store.methods.map(([name, args]) => <li key={name} className="clickable">{name}({args.join(', ')})</li>)}
        </ul>
    </div>;
};
