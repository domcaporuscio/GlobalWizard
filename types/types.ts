export interface AppConfig {
  diSize: number;
  diStartPoint: number;
  diRack: number;
  diSlot: number;
  doSize: number;
  doStartPoint: number;
  doRack: number;
  doSlot: number;

  uiSize: number;
  uiStartPoint: number;
  uiRack: number;
  uiSlot: number;

  uoSize: number;
  uoStartPoint: number;
  uoRack: number;
  uoSlot: number;

  rSize: number;
  rStartPoint: number;
  flagsSize: number;
  flagsStartPoint: number;
  groupSize: number;
  groupLength: number;
  groupStartPoint: number;
  groupRack: number;
  groupSlot: number;
  giLength: number;
  giStartPoint: number;
  giRack: number;
  giSlot: number;
}

export interface Labels {
  di: { [key: number]: string };
  do: { [key: number]: string };
  ui: { [key: number]: string };
  uo: { [key: number]: string };
  r: { [key: number]: string };
  flags: { [key: number]: string };
  userInputs: { [key: number]: string };
}

export interface AppData {
  config: AppConfig;
  labels: Labels;
  files?: Array<{ name: string; run: boolean }>;
  systemVariables?: Array<{ key: string; value: string }>;
  groupInputs?: Array<{ number: number; name: string; rack: number; slot: number; start: number; length: number }>;
  groupOutputs?: Array<{ number: number; name: string; rack: number; slot: number; start: number; length: number }>;
}

export interface Apps {
  [key: string]: AppData;
}
