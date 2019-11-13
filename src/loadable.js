import React from 'react';
import Loadable from 'react-loadable';

const LoadableComponent = (component) => Loadable({
    loader: component,
    loading: () => <div>Loading...</div>
})

export default LoadableComponent;