import React, { useMemo, useEffect, useCallback } from 'react';
import { ApolloProvider as OldApolloProvider } from 'react-apollo';
import { ApolloProvider, useClientBuilder } from '@src/apollo';
import { observer, appStore, userStore } from '@src/store';
import AppRouter from '@src/router';

export default observer(() => {
    const client = useClientBuilder(userStore.me?.token);

    return (
        <OldApolloProvider client={client}>
            <ApolloProvider client={client}>
                <AppRouter />
            </ApolloProvider>
        </OldApolloProvider>
    );
});
