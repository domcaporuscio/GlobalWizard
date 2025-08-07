export interface AppConfig {
  diSize: number;
  diStartPoint: number;
  doSize: number;
  doStartPoint: number;
  rSize: number;
  rStartPoint: number;
}

export interface Labels {
  di: { [key: number]: string };
  do: { [key: number]: string };
  r: { [key: number]: string };
}

export interface AppData {
  config: AppConfig;
  labels: Labels;
}

export interface Apps {
  [key: string]: AppData;
}
