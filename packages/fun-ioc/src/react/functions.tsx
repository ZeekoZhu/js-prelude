import React, { PropsWithChildren } from 'react';

import {
  IServiceCollection,
  IServiceProvider,
  IServiceToken,
  ServiceProvider,
} from '../lib';

export const useServiceProvider = (services: IServiceCollection) => {
  const [provider] = React.useState(() => services.buildServiceProvider());
  React.useEffect(() => {
    return () => {
      provider.dispose();
    };
  }, []);
  return provider;
};
const FunIocContext = React.createContext<IServiceProvider>(
  {} as ServiceProvider,
);

export const ServiceContainer = (
  props: PropsWithChildren<{
    services: IServiceCollection;
  }>,
) => {
  const sp = useServiceProvider(props.services);
  return (
    <FunIocContext.Provider value={sp}>{props.children}</FunIocContext.Provider>
  );
};

export const createServiceContainer = (services: IServiceCollection) => {
  return (props: PropsWithChildren) => (
    <ServiceContainer services={services}>{props.children}</ServiceContainer>
  );
};

export const useService = <T,>(serviceToken: IServiceToken<T>) => {
  const sp = React.useContext(FunIocContext);
  return sp.getService<T>(serviceToken);
};
