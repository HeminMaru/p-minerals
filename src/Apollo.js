import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
//import Utils from './Utils';

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
}

const getApolloClient = (uri, headers) => {
    return new ApolloClient({
        link: new HttpLink({
            uri: uri,
            headers: headers
        }),
        cache: new InMemoryCache(),
        defaultOptions: defaultOptions
    });
}

const create = () => {

    if (true) { //process.env.REACT_APP_SKIP_AUTH_FOR_DEVELOPMENT) {
        return getApolloClient(process.env.REACT_APP_GRAPHQL_URL, {
            "x-hasura-admin-secret": `${process.env.REACT_APP_HASURA_ADMIN_SECRET}`
        })
    }


};

const client = create();

const Apollo = {
    query: (query, queryvars, callback, showError) => client.query({ query, variables: queryvars }).then(callback).catch(showError),
    mutate: (mutation, queryvars, callback, showError) => client.mutate({ mutation: mutation, variables: queryvars }).then(callback).catch(showError)
};

export default Apollo;