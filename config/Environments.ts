export type Environment = {
    appHost: string;
  };
  
  const DEV: Environment = {
    appHost: 'dev.3snet.info',
  };
  
  // TODO: add other environments

  export const environments: Map<string, Environment> = new Map(
    Object.entries({
      DEV,
    }),
  );
  