export interface ILogger {
  env?: EnvTypes;
  isVerbose: boolean;
  logger: winston.Logger;

  setEnv: (env: EnvTypes) => void;
  setVerbose: (isVerbose: boolean) => void;
  loggerInit: () => winston.Logger;

  info: (message: string, ...optionalParams: unknown[]) => void;
  error: (message: string, ...optionalParams: unknown[]) => void;
}
