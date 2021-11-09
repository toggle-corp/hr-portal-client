import React, { useMemo } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ApolloClient, ApolloProvider } from '@apollo/client';

import { RequestContext } from '#utils/request';
import {
    processUrls,
    processOptions,
    processResponse,
    processError,
    MeraContextInterface,
} from '#utils/request/mera';

import '@togglecorp/toggle-ui/build/index.css';
import apolloConfig from '#config/apollo';
import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import './styles.css';

import Multiplexer from './Multiplexer';

const apolloClient = new ApolloClient(apolloConfig);

const history = createBrowserHistory();

function Root() {
    const requestContextValue = useMemo((): MeraContextInterface => ({
        transformUrl: processUrls,
        transformOptions: processOptions,
        transformResponse: processResponse,
        transformError: processError,
    }), []);

    return (
        <Router history={history}>
            <ApolloProvider client={apolloClient}>
                <RequestContext.Provider value={requestContextValue}>
                    <Multiplexer />
                </RequestContext.Provider>
            </ApolloProvider>
        </Router>
    );
}

export default Root;
