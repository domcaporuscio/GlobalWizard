

// Sync local files state to global apps state whenever files change
// This hook should be placed after React is imported
// ...existing code...

import React, { useState, useRef } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { AppData, Labels } from "../types/types";
import type { Apps } from "../types/types";

// Defensive: ensure apps is always an object
const defaultConfig = {
  diSize: 16,
  diStartPoint: 1,
  diRack: 0,
  diSlot: 0,
  doSize: 16,
  doStartPoint: 1,
  doRack: 0,
  doSlot: 0,
  rSize: 16,
  rStartPoint: 1,
  flagsSize: 16,
  flagsStartPoint: 1,
  groupSize: 0,
  groupLength: 0,
  groupStartPoint: 0,
  groupRack: 0,
  groupSlot: 0,
  giLength: 0,
  giStartPoint: 0,
  giRack: 0,
  giSlot: 0,
  uiSize: 16,
  uiStartPoint: 1,
  uiRack: 0,
  uiSlot: 0,
  uoSize: 16,
  uoStartPoint: 1,
  uoRack: 0,
  uoSlot: 0,
};
const defaultLabels = { di: {}, do: {}, r: {}, flags: {}, userInputs: {}, ui: {}, uo: {} };

interface AppDetailProps {
  appName: string;
  appData: AppData;
  apps: Apps;
  setApps: (apps: Apps) => void;
  onBack: () => void;
}

const AppDetail: React.FC<AppDetailProps> = ({ appName, appData, apps, setApps, onBack }) => {
  // ...existing code...
  // Move handleGenerate above JSX usage
  const handleGenerate = () => {
    const newLabels: Labels = {
      di: {},
      do: {},
      r: {},
      flags: {},
      userInputs: {},
      ui: {},
      uo: {},
    };
    for (let i = 0; i < config.diSize; i++) {
      const point = config.diStartPoint + i;
      newLabels.di[point] = labels.di[point] || "";
    }
    for (let i = 0; i < config.doSize; i++) {
      const point = config.doStartPoint + i;
      newLabels.do[point] = labels.do[point] || "";
    }
    for (let i = 0; i < config.rSize; i++) {
      const point = config.rStartPoint + i;
      newLabels.r[point] = labels.r[point] || "";
    }
    for (let i = 0; i < config.flagsSize; i++) {
      const point = config.flagsStartPoint + i;
      newLabels.flags[point] = labels.flags[point] || "";
    }
    for (let i = 0; i < config.uiSize; i++) {
      const point = config.uiStartPoint + i;
      newLabels.ui[point] = labels.ui?.[point] || "";
    }
    for (let i = 0; i < config.uoSize; i++) {
      const point = config.uoStartPoint + i;
      newLabels.uo[point] = labels.uo?.[point] || "";
    }
    setLabels(newLabels);
    setApps({
      ...apps,
      [appName]: {
        ...((apps[appName] ?? { config: defaultConfig, labels: defaultLabels })),
        config,
        labels: newLabels,
        files,
      },
    });
  };
  // Use systemVariables directly from apps
  const systemVariables = apps[appName]?.systemVariables || [];

  // If app is missing, initialize it in apps (useEffect to avoid setState in render)
  React.useEffect(() => {
    if (!apps[appName]) {
      setApps({
        ...apps,
        [appName]: { config: defaultConfig, labels: { ...defaultLabels, userInputs: {} } },
      });
    }
  }, [apps, appName, setApps]);

  const currentAppData = apps[appName] || { config: defaultConfig, labels: defaultLabels };
  if (!currentAppData.labels.userInputs) currentAppData.labels.userInputs = {};
  if (!currentAppData.groupOutputs) {
    currentAppData.groupOutputs = [];
  }

  const [config, setConfig] = useState({
    ...((currentAppData.config ?? defaultConfig)),
    flagsSize: currentAppData.config?.flagsSize ?? defaultConfig.flagsSize,
    flagsStartPoint: currentAppData.config?.flagsStartPoint ?? defaultConfig.flagsStartPoint,
  diRack: currentAppData.config?.diRack ?? defaultConfig.diRack,
  diSlot: currentAppData.config?.diSlot ?? defaultConfig.diSlot,
  doRack: currentAppData.config?.doRack ?? defaultConfig.doRack,
  doSlot: currentAppData.config?.doSlot ?? defaultConfig.doSlot,
  groupSize: currentAppData.config?.groupSize ?? defaultConfig.groupSize,
  groupLength: currentAppData.config?.groupLength ?? defaultConfig.groupLength,
  groupStartPoint: currentAppData.config?.groupStartPoint ?? defaultConfig.groupStartPoint,
  groupRack: currentAppData.config?.groupRack ?? defaultConfig.groupRack,
  groupSlot: currentAppData.config?.groupSlot ?? defaultConfig.groupSlot,
  giLength: currentAppData.config?.giLength ?? defaultConfig.giLength,
  giStartPoint: currentAppData.config?.giStartPoint ?? defaultConfig.giStartPoint,
  giRack: currentAppData.config?.giRack ?? defaultConfig.giRack,
  giSlot: currentAppData.config?.giSlot ?? defaultConfig.giSlot,
  uiSize: currentAppData.config?.uiSize ?? defaultConfig.uiSize,
  uiStartPoint: currentAppData.config?.uiStartPoint ?? defaultConfig.uiStartPoint,
  uiRack: currentAppData.config?.uiRack ?? defaultConfig.uiRack,
  uiSlot: currentAppData.config?.uiSlot ?? defaultConfig.uiSlot,
  uoSize: currentAppData.config?.uoSize ?? defaultConfig.uoSize,
  uoStartPoint: currentAppData.config?.uoStartPoint ?? defaultConfig.uoStartPoint,
  uoRack: currentAppData.config?.uoRack ?? defaultConfig.uoRack,
  uoSlot: currentAppData.config?.uoSlot ?? defaultConfig.uoSlot,
  });

  // Move files/setFiles and labels/setLabels hooks here so all references are valid
  const [files, setFiles] = useState<Array<{ name: string; run: boolean }>>(apps[appName]?.files || []);
  // Sync local files state to global apps state whenever files change
  React.useEffect(() => {
    setApps({
      ...apps,
      [appName]: {
        ...((apps[appName] ?? { config: defaultConfig, labels: defaultLabels })),
        files,
      },
    });
  }, [files]);
  // ...existing code...

// ...existing code...
  const exportManifest = () => {
    console.log('Exporting manifest, files:', files);
    let manifestContent = "";
    // DI Section
    if (config.diSize > 0) {
      manifestContent += `[DI]\n`;
      manifestContent += `RACK: ${config.diRack}\n`;
      manifestContent += `SLOT: ${config.diSlot}\n`;
      manifestContent += `START: ${config.diStartPoint}\n`;
      manifestContent += `RANGE: ${config.diStartPoint} - ${config.diStartPoint + config.diSize - 1}\n`;
      for (let i = 0; i < config.diSize; i++) {
        const point = config.diStartPoint + i;
        manifestContent += `${point}, "${labels.di[point] || ""}"\n`;
      }
      manifestContent += `[\/DI]\n\n`;
    }
    // DO Section
    if (config.doSize > 0) {
      manifestContent += `[DO]\n`;
      manifestContent += `RACK:${config.doRack}\n`;
      manifestContent += `SLOT:${config.doSlot}\n`;
      manifestContent += `START:${config.doStartPoint}\n`;
      for (let i = 0; i < config.doSize; i++) {
        const point = config.doStartPoint + i;
        manifestContent += `${point},${labels.do[point] || ""}\n`;
      }
      manifestContent += `[\/DO]\n\n`;
    }
    // Registers Section
    if (config.rSize > 0) {
      manifestContent += `[Registers]\n`;
      manifestContent += `START: ${config.rStartPoint}\n`;
      for (let i = 0; i < config.rSize; i++) {
        const point = config.rStartPoint + i;
        manifestContent += `${point},"${labels.r[point] || ""}"\n`;
      }
      manifestContent += `[\/Registers]\n\n`;
    }
            {/* R Section */}
            {config.rSize > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">R</h3>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-4 py-3 w-1/4">Point</th>
                        <th scope="col" className="px-4 py-3">Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: config.rSize }, (_, i) => {
                        const point = config.rStartPoint + i;
                        return (
                          <tr key={`r-${point}`} className="bg-white border-b">
                            <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">{point}</td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={labels.r && labels.r[point] !== undefined ? labels.r[point] : ""}
                                onChange={(e) => handleLabelChange("r", point, e.target.value)}
                                className="w-full bg-transparent border-0 focus:ring-0 p-0 m-0 text-slate-700"
                                placeholder="Enter label..."
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
    if (appData.groupInputs && appData.groupInputs.length > 0) {
      manifestContent += `[GI]\n`;
      appData.groupInputs.forEach(gi => {
        manifestContent += `RACK: ${gi.rack}\n`;
        manifestContent += `SLOT: ${gi.slot}\n`;
        manifestContent += `START: ${gi.start}\n`;
        manifestContent += `LENGTH: ${gi.length}\n`;
        manifestContent += `RANGE: ${gi.number} - ${gi.number}\n`;
        manifestContent += `${gi.number}, "${gi.name}"\n`;
      });
      manifestContent += `[/GI]\n`;
    }
    // GO Section
    if (appData.groupOutputs && appData.groupOutputs.length > 0) {
      manifestContent += `[GO]\n`;
      appData.groupOutputs.forEach(go => {
        manifestContent += `RACK: ${go.rack}\n`;
        manifestContent += `SLOT: ${go.slot}\n`;
        manifestContent += `START: ${go.start}\n`;
        manifestContent += `LENGTH: ${go.length}\n`;
        manifestContent += `RANGE: ${go.number} - ${go.number}\n`;
        manifestContent += `${go.number}, "${go.name}"\n`;
      });
      manifestContent += `[/GO]\n`;
    }
    // Download as file
    const blob = new Blob([manifestContent.trim()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${appName}_manifest.dt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const [labels, setLabels] = useState({
  di: currentAppData.labels?.di ?? {},
  do: currentAppData.labels?.do ?? {},
  r: currentAppData.labels?.r ?? {},
  flags: currentAppData.labels?.flags ?? {},
  userInputs: currentAppData.labels?.userInputs ?? {},
  ui: currentAppData.labels?.ui ?? {},
  uo: currentAppData.labels?.uo ?? {},
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // id format: r-size, r-start-point, etc.
    let key = id.replace(/-(.)/g, (_, c) => c.toUpperCase()); // r-size -> rSize
    const newConfig = {
      ...config,
      [key]: Number(value),
    };
    setConfig(newConfig);
    setApps({
      ...apps,
      [appName]: {
        ...((apps[appName] ?? { config: defaultConfig, labels: defaultLabels })),
        config: newConfig,
        labels,
      },
    });
  };

  const handleLabelChange = (section: keyof Labels, point: number, value: string) => {
    // Only update label value, not export manifest here
    setLabels(prev => {
      const updated = { ...prev };
      updated[section][point] = value;
      setApps({
        ...apps,
        [appName]: {
          ...apps[appName],
          labels: updated,
        },
      });
      return updated;
    });
};

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Parse manifest file
      const sectionRegex = /\[(\/?[A-Z_]+)\]/g;
      let match;
      const sections: Record<string, string> = {};
      let lastIndex = 0;
      let lastSection = "";
      // Find all sections and their content
      while ((match = sectionRegex.exec(text)) !== null) {
        if (lastSection) {
          sections[lastSection] = text.substring(lastIndex, match.index).trim();
        }
        lastSection = match[1].replace("/", "");
        lastIndex = sectionRegex.lastIndex;
      }
      if (lastSection) {
        sections[lastSection] = text.substring(lastIndex).trim();
      }

      // Helper to parse key-value pairs
      function parseLabels(content: string) {
        const lines = content.split(/\r?\n/);
        const labels: Record<number, string> = {};
        lines.forEach(line => {
          const m = line.match(/^(\d+),\s*"?(.*?)"?$/);
          if (m) {
            labels[Number(m[1])] = m[2];
          }
        });
        return labels;
      }

      // Helper to parse config values
      function parseConfig(content: string, keys: string[]) {
        const config: Record<string, number> = {};
        keys.forEach(key => {
          const m = content.match(new RegExp(`${key}:\s*(\d+)`));
          if (m) config[key] = Number(m[1]);
        });
        return config;
      }

      // Parse DI
      let newConfig = { ...config };
      let newLabels = { ...labels };
            // Parse SETVAR
  let newSystemVariables: { key: string; value: string }[] = [];
  //     if (sections["SETVAR"]) {
  //       newSystemVariables = sections["SETVAR"].split(/\r?\n/).filter(Boolean).map(line => {
  //         const m = line.match(/^(.*?),"(.*?)"$/);
  //         if (m) return { key: m[1], value: m[2] };
  //         return null;
  //       }).filter(Boolean);
  //     }


      // ...existing code...
      // Parse SETVAR and add to systemVariables (after sections is defined)
      let newSetVars: { key: string; value: string }[] = [];
      if (sections["SETVAR"]) {
        const setvarLines: string[] = sections["SETVAR"].split(/\r?\n/).filter(Boolean);
        setvarLines.forEach((line: string) => {
          // Match $KEY = VALUE (allow spaces around =)
          const m = line.match(/^([^=]+)=\s*(.*)$/);
          if (m) {
            const key = m[1].trim();
            const value = m[2].trim();
            newSystemVariables.push({ key, value });
          }
        });
      }



      if (sections["DI"]) {
        newLabels.di = parseLabels(sections["DI"]);
        const diConfig = parseConfig(sections["DI"], ["RACK", "SLOT", "START"]);
        if (diConfig["RACK"] !== undefined) newConfig.diRack = diConfig["RACK"];
        if (diConfig["SLOT"] !== undefined) newConfig.diSlot = diConfig["SLOT"];
        if (diConfig["START"] !== undefined) newConfig.diStartPoint = diConfig["START"];
        newConfig.diSize = Object.keys(newLabels.di).length;
      }
      // Parse DO
      if (sections["DO"]) {
        newLabels.do = parseLabels(sections["DO"]);
        const doConfig = parseConfig(sections["DO"], ["RACK", "SLOT", "START"]);
        if (doConfig["RACK"] !== undefined) newConfig.doRack = doConfig["RACK"];
        if (doConfig["SLOT"] !== undefined) newConfig.doSlot = doConfig["SLOT"];
        if (doConfig["START"] !== undefined) newConfig.doStartPoint = doConfig["START"];
        newConfig.doSize = Object.keys(newLabels.do).length;
      }
      // Parse R
      if (sections["R"] || sections["Registers"]) {
        const rSection = sections["R"] || sections["Registers"];
        let rStartPoint = 1;
        let rLabels: Record<number, string> = {};
        rSection.split(/\r?\n/).forEach(line => {
          if (line.startsWith("START:")) {
            rStartPoint = Number(line.split(":")[1].trim());
          } else {
            const m = line.match(/^(\d+),\s*"?(.*?)"?$/);
            if (m) {
              rLabels[Number(m[1])] = m[2];
            }
          }
        });
        newLabels.r = rLabels;
        newConfig.rSize = Object.keys(rLabels).length;
        newConfig.rStartPoint = rStartPoint;
      }
      // Parse FLAGS
      if (sections["FLAGS"]) {
        newLabels.flags = parseLabels(sections["FLAGS"]);
        newConfig.flagsSize = Object.keys(newLabels.flags).length;
        const flagsConfig = parseConfig(sections["FLAGS"], ["START"]);
        if (flagsConfig["START"] !== undefined) newConfig.flagsStartPoint = flagsConfig["START"];
      }
      // Parse UI
      if (sections["UI"]) {
        newLabels.ui = parseLabels(sections["UI"]);
        const uiConfig = parseConfig(sections["UI"], ["RACK", "SLOT", "START"]);
        if (uiConfig["RACK"] !== undefined) newConfig.uiRack = uiConfig["RACK"];
        if (uiConfig["SLOT"] !== undefined) newConfig.uiSlot = uiConfig["SLOT"];
        if (uiConfig["START"] !== undefined) newConfig.uiStartPoint = uiConfig["START"];
        newConfig.uiSize = Object.keys(newLabels.ui).length;
      }
      // Parse UO
      if (sections["UO"]) {
        newLabels.uo = parseLabels(sections["UO"]);
        const uoConfig = parseConfig(sections["UO"], ["RACK", "SLOT", "START"]);
        if (uoConfig["RACK"] !== undefined) newConfig.uoRack = uoConfig["RACK"];
        if (uoConfig["SLOT"] !== undefined) newConfig.uoSlot = uoConfig["SLOT"];
        if (uoConfig["START"] !== undefined) newConfig.uoStartPoint = uoConfig["START"];
        newConfig.uoSize = Object.keys(newLabels.uo).length;
      }
      // Parse FILES
  let newFiles: { name: string; run: boolean }[] = [];
      if (sections["FILES"]) {
        newFiles = sections["FILES"].split(/\r?\n/).filter(Boolean).map(line => {
          const run = line.includes("RUN");
          return { name: line.replace(" RUN", "").trim(), run };
        });
      }

      // Parse GI
  let newGIInputs: { number: number; name: string; rack: number; slot: number; start: number; length: number }[] = [];
      if (sections["GI"]) {
        const giLines = sections["GI"].split(/\r?\n/).filter(Boolean);
        let currentGI: any = {};
        giLines.forEach(line => {
          if (line.startsWith("RACK:")) currentGI.rack = Number(line.split(":")[1]);
          else if (line.startsWith("SLOT:")) currentGI.slot = Number(line.split(":")[1]);
          else if (line.startsWith("START:")) currentGI.start = Number(line.split(":")[1]);
          else if (line.startsWith("LENGTH:")) currentGI.length = Number(line.split(":")[1]);
          else if (line.match(/^\d+,/)) {
            const m = line.match(/^(\d+),\s*"?(.*?)"?$/);
            if (m) {
              currentGI.number = Number(m[1]);
              currentGI.name = m[2];
              newGIInputs.push({ ...currentGI });
              currentGI = {};
            }
          }
        });
      }
      // Parse GO
  let newGOOutputs: { number: number; name: string; rack: number; slot: number; start: number; length: number }[] = [];
      if (sections["GO"]) {
        const goLines = sections["GO"].split(/\r?\n/).filter(Boolean);
        let currentGO: any = {};
        goLines.forEach(line => {
          if (line.startsWith("RACK:")) currentGO.rack = Number(line.split(":")[1]);
          else if (line.startsWith("SLOT:")) currentGO.slot = Number(line.split(":")[1]);
          else if (line.startsWith("START:")) currentGO.start = Number(line.split(":")[1]);
          else if (line.startsWith("LENGTH:")) currentGO.length = Number(line.split(":")[1]);
          else if (line.match(/^\d+,/)) {
            const m = line.match(/^(\d+),\s*"?(.*?)"?$/);
            if (m) {
              currentGO.number = Number(m[1]);
              currentGO.name = m[2];
              newGOOutputs.push({ ...currentGO });
              currentGO = {};
            }
          }
        });
      }

      // Update state
  setConfig(newConfig);
  setLabels(newLabels);
  setGIInputs(newGIInputs);
  setGOOutputs(newGOOutputs);
      setFiles(newFiles);
      setGIInputs(newGIInputs);
      setGOOutputs(newGOOutputs);
      setApps({
        ...apps,
        [appName]: {
          ...apps[appName],
          config: {
            ...defaultConfig,
            ...newConfig,
          },
          labels: newLabels,
          files: newFiles,
          systemVariables: [...newSystemVariables, ...newSetVars],
          groupInputs: newGIInputs,
          groupOutputs: newGOOutputs,
        },
      });
    };
    reader.readAsText(file);
  };

  // Sync local state with global apps state when imported or changed
  React.useEffect(() => {
    const currentAppData = apps[appName] || { config: defaultConfig, labels: defaultLabels, files: [], systemVariables: [] };
    setConfig({
      ...currentAppData.config,
      flagsSize: currentAppData.config?.flagsSize ?? defaultConfig.flagsSize,
      flagsStartPoint: currentAppData.config?.flagsStartPoint ?? defaultConfig.flagsStartPoint,
      diRack: currentAppData.config?.diRack ?? defaultConfig.diRack,
      diSlot: currentAppData.config?.diSlot ?? defaultConfig.diSlot,
      doRack: currentAppData.config?.doRack ?? defaultConfig.doRack,
      doSlot: currentAppData.config?.doSlot ?? defaultConfig.doSlot,
      groupSize: currentAppData.config?.groupSize ?? defaultConfig.groupSize,
      groupLength: currentAppData.config?.groupLength ?? defaultConfig.groupLength,
      groupStartPoint: currentAppData.config?.groupStartPoint ?? defaultConfig.groupStartPoint,
      groupRack: currentAppData.config?.groupRack ?? defaultConfig.groupRack,
      groupSlot: currentAppData.config?.groupSlot ?? defaultConfig.groupSlot,
      giLength: currentAppData.config?.giLength ?? defaultConfig.giLength,
      giStartPoint: currentAppData.config?.giStartPoint ?? defaultConfig.giStartPoint,
      giRack: currentAppData.config?.giRack ?? defaultConfig.giRack,
      giSlot: currentAppData.config?.giSlot ?? defaultConfig.giSlot,
    });
    setLabels({
      di: currentAppData.labels?.di ?? {},
      do: currentAppData.labels?.do ?? {},
      r: currentAppData.labels?.r ?? {},
      flags: currentAppData.labels?.flags ?? {},
      userInputs: currentAppData.labels?.userInputs ?? {},
      ui: currentAppData.labels?.ui ?? {},
      uo: currentAppData.labels?.uo ?? {},
    });
    setFiles(currentAppData.files ?? []);
    setGIInputs(currentAppData.groupInputs ?? []);
    setGOOutputs(currentAppData.groupOutputs ?? []);
    // systemVariables is now managed via apps/appName, no local state update needed
  }, [apps, appName]);

  // GI Inputs state
  const [GIInputs, setGIInputs] = useState<Array<{ number: number; name: string; rack: number; slot: number; start: number; length: number }>>([]);
  const [GOOutputs, setGOOutputs] = useState<Array<{ number: number; name: string; rack: number; slot: number; start: number; length: number }>>([]);

  // Persist GIInputs to localStorage
  const [persistedGIInputs, setPersistedGIInputs] = useLocalStorage<Array<{ number: number; name: string; rack: number; slot: number; start: number; length: number }>>(
    `GIInputs_${appName}`,
    []
  );
  // Persist GOOutputs to localStorage
  const [persistedGOOutputs, setPersistedGOOutputs] = useLocalStorage<Array<{ number: number; name: string; rack: number; slot: number; start: number; length: number }>>(
    `GOOutputs_${appName}`,
    []
  );


  // On mount, load GIInputs and GOOutputs from localStorage if available
  React.useEffect(() => {
    if (persistedGIInputs.length > 0) {
      setGIInputs(persistedGIInputs);
    }
    if (persistedGOOutputs.length > 0) {
      setGOOutputs(persistedGOOutputs);
    }
    // eslint-disable-next-line
  }, [appName]);

  // (Removed duplicate GIInputs effect. Persistence for GI and GO is handled together above.)

  // On mount, load GIInputs from localStorage if available
  React.useEffect(() => {
    if (persistedGIInputs.length > 0) {
      setGIInputs(persistedGIInputs);
    }
    // eslint-disable-next-line
  }, [appName]);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-screen-2xl">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors duration-200"
          >
            ← Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Editing: {appName}
          </h1>
        </div>
        <p className="text-slate-600 mt-2">
          Define, label, import, and export your digital I/O and Register
          configurations for this app.
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-b border-slate-200 pb-8 mb-8">
          <div className="md:col-span-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Configuration
            </h2>
          </div>
          <div className="md:col-span-1 flex flex-col items-end justify-start md:justify-end space-y-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200"
            >
              Import
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              className="hidden"
              accept=".dt"
            />
            <button
              onClick={handleGenerate}
              className="w-full bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-slate-900 transition-colors duration-200"
            >
              Generate Fields
            </button>
            <button
              onClick={exportManifest}
              className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors duration-200"
            >
              Export Manifest
            </button>
          </div>
          <div className="md:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
            {/* DI Config */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h3 className="font-semibold text-slate-800 mb-3">Digital Inputs (DI)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="di-size" className="block text-sm font-medium text-slate-700">Size</label>
                  <input type="number" id="di-size" value={config.diSize} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="di-start-point" className="block text-sm font-medium text-slate-700">Start Point</label>
                  <input type="number" id="di-start-point" value={config.diStartPoint} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="di-rack" className="block text-sm font-medium text-slate-700">Rack</label>
                  <input type="number" id="di-rack" value={config.diRack} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="di-slot" className="block text-sm font-medium text-slate-700">Slot</label>
                  <input type="number" id="di-slot" value={config.diSlot} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>
            </div>

            {/* DI Section */}
            {config.diSize > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">DI</h3>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-4 py-3 w-1/4">Point</th>
                        <th scope="col" className="px-4 py-3">Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: config.diSize }, (_, i) => {
                        const point = config.diStartPoint + i;
                        return (
                          <tr key={`di-${point}`} className="bg-white border-b">
                            <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">{point}</td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={labels.di[point] || ""}
                                onChange={(e) => handleLabelChange("di", point, e.target.value)}
                                className="w-full bg-transparent border-0 focus:ring-0 p-0 m-0 text-slate-700"
                                placeholder="Enter label..."
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}





            
            {/* DO Config */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h3 className="font-semibold text-slate-800 mb-3">Digital Outputs (DO)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="do-size" className="block text-sm font-medium text-slate-700">Size</label>
                  <input type="number" id="do-size" value={config.doSize} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="do-start-point" className="block text-sm font-medium text-slate-700">Start Point</label>
                  <input type="number" id="do-start-point" value={config.doStartPoint} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="do-rack" className="block text-sm font-medium text-slate-700">Rack</label>
                  <input type="number" id="do-rack" value={config.doRack} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="do-slot" className="block text-sm font-medium text-slate-700">Slot</label>
                  <input type="number" id="do-slot" value={config.doSlot} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>
            </div>


            {/* DO Section */}
            {config.doSize > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">DO</h3>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-4 py-3 w-1/4">Point</th>
                        <th scope="col" className="px-4 py-3">Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: config.doSize }, (_, i) => {
                        const point = config.doStartPoint + i;
                        return (
                          <tr key={`do-${point}`} className="bg-white border-b">
                            <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">{point}</td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={labels.do[point] || ""}
                                onChange={(e) => handleLabelChange("do", point, e.target.value)}
                                className="w-full bg-transparent border-0 focus:ring-0 p-0 m-0 text-slate-700"
                                placeholder="Enter label..."
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}



             {/* UI Config */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h3 className="font-semibold text-slate-800 mb-3">User Inputs (UI)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ui-size" className="block text-sm font-medium text-slate-700">Size</label>
                  <input type="number" id="ui-size" value={config.uiSize} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="ui-start-point" className="block text-sm font-medium text-slate-700">Start Point</label>
                  <input type="number" id="ui-start-point" value={config.uiStartPoint} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="ui-rack" className="block text-sm font-medium text-slate-700">Rack</label>
                  <input type="number" id="ui-rack" value={config.uiRack} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="ui-slot" className="block text-sm font-medium text-slate-700">Slot</label>
                  <input type="number" id="ui-slot" value={config.uiSlot} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>
            </div>


            {/* UI Section */}
            {config.uiSize > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">UI</h3>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-4 py-3 w-1/4">Point</th>
                        <th scope="col" className="px-4 py-3">Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: config.uiSize }, (_, i) => {
                        const point = config.uiStartPoint + i;
                        return (
                          <tr key={`ui-${point}`} className="bg-white border-b">
                            <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">{point}</td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={labels.ui[point] || ""}
                                onChange={(e) => handleLabelChange("ui", point, e.target.value)}
                                className="w-full bg-transparent border-0 focus:ring-0 p-0 m-0 text-slate-700"
                                placeholder="Enter label..."
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}




            {/* User Outputs (UO) Section */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h3 className="font-semibold text-slate-800 mb-3">User Outputs (UO)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="uo-size" className="block text-sm font-medium text-slate-700">Size</label>
                  <input type="number" id="uo-size" value={config.uoSize} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="uo-start-point" className="block text-sm font-medium text-slate-700">Start Point</label>
                  <input type="number" id="uo-start-point" value={config.uoStartPoint} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="uo-rack" className="block text-sm font-medium text-slate-700">Rack</label>
                  <input type="number" id="uo-rack" value={config.uoRack} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="uo-slot" className="block text-sm font-medium text-slate-700">Slot</label>
                  <input type="number" id="uo-slot" value={config.uoSlot} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>
            </div>

            {/* UO Section */}
            {config.uoSize > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">UO</h3>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-4 py-3 w-1/4">Point</th>
                        <th scope="col" className="px-4 py-3">Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: config.uoSize }, (_, i) => {
                        const point = config.uoStartPoint + i;
                        return (
                          <tr key={`uo-${point}`} className="bg-white border-b">
                            <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">{point}</td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={labels.uo[point] || ""}
                                onChange={(e) => handleLabelChange("uo", point, e.target.value)}
                                className="w-full bg-transparent border-0 focus:ring-0 p-0 m-0 text-slate-700"
                                placeholder="Enter label..."
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


{/* UO Section */}
            {/* UO section removed as requested */}


            {/* Group Inputs (GI) Config */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h3 className="font-semibold text-slate-800 mb-3">Group Inputs (GI)</h3>
              <div className="mb-4">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => setGIInputs([...GIInputs, { number: GIInputs.length + 1, name: '', rack: 0, slot: 0, start: 0, length: 0 }])}
                >
                  Add Group Input
                </button>
              </div>
              {GIInputs.map((gi, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <div style={{height: '2.5rem'}} />}
                  <div className="p-4 bg-white rounded shadow">
                    {/* Number row - bold label and input */}
                    <div className="flex items-center mb-2">
                      <label className="font-bold text-slate-800 mr-4 min-w-[90px]" htmlFor={`gi-number-${idx}`}>Number</label>
                      <input
                        id={`gi-number-${idx}`}
                        type="number"
                        value={gi.number}
                        onChange={e => {
                          const newInputs = [...GIInputs];
                          newInputs[idx].number = Number(e.target.value);
                          setGIInputs(newInputs);
                        }}
                        className="font-bold p-2 border-2 border-indigo-500 rounded w-32"
                      />
                    </div>
                    {/* Name row */}
                    <div className="flex items-center mb-2">
                      <label className="text-slate-700 mr-4 min-w-[90px]" htmlFor={`gi-name-${idx}`}>Name</label>
                      <input
                        id={`gi-name-${idx}`}
                        type="text"
                        value={gi.name}
                        onChange={e => {
                          const newInputs = [...GIInputs];
                          newInputs[idx].name = e.target.value;
                          setGIInputs(newInputs);
                        }}
                        className="p-2 border rounded w-64"
                      />
                    </div>
                    {/* Rack row */}
                    <div className="flex items-center mb-2">
                      <label className="text-slate-700 mr-4 min-w-[90px]" htmlFor={`gi-rack-${idx}`}>Rack</label>
                      <input
                        id={`gi-rack-${idx}`}
                        type="number"
                        value={gi.rack ?? 0}
                        onChange={e => {
                          const newInputs = [...GIInputs];
                          newInputs[idx].rack = Number(e.target.value);
                          setGIInputs(newInputs);
                        }}
                        className="p-2 border rounded w-32"
                      />
                    </div>
                    {/* Slot row */}
                    <div className="flex items-center mb-2">
                      <label className="text-slate-700 mr-4 min-w-[90px]" htmlFor={`gi-slot-${idx}`}>Slot</label>
                      <input
                        id={`gi-slot-${idx}`}
                        type="number"
                        value={gi.slot ?? 0}
                        onChange={e => {
                          const newInputs = [...GIInputs];
                          newInputs[idx].slot = Number(e.target.value);
                          setGIInputs(newInputs);
                        }}
                        className="p-2 border rounded w-32"
                      />
                    </div>
                    {/* Start row */}
                    <div className="flex items-center mb-2">
                      <label className="text-slate-700 mr-4 min-w-[90px]" htmlFor={`gi-start-${idx}`}>Start</label>
                      <input
                        id={`gi-start-${idx}`}
                        type="number"
                        value={gi.start ?? 0}
                        onChange={e => {
                          const newInputs = [...GIInputs];
                          newInputs[idx].start = Number(e.target.value);
                          setGIInputs(newInputs);
                        }}
                        className="p-2 border rounded w-32"
                      />
                    </div>
                    {/* Length row */}
                    <div className="flex items-center">
                      <label className="text-slate-700 mr-4 min-w-[90px]" htmlFor={`gi-length-${idx}`}>Length</label>
                      <input
                        id={`gi-length-${idx}`}
                        type="number"
                        value={gi.length ?? 0}
                        onChange={e => {
                          const newInputs = [...GIInputs];
                          newInputs[idx].length = Number(e.target.value);
                          setGIInputs(newInputs);
                        }}
                        className="p-2 border rounded w-32"
                      />
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
            {/* Group Outputs (GO) Config */}
            <div className="p-4 bg-slate-50 rounded-lg border mt-8">
              <h3 className="font-semibold text-slate-800 mb-3">Group Outputs (GO)</h3>
              <div className="mb-4">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => setGOOutputs([...GOOutputs, { number: GOOutputs.length + 1, name: '', rack: 0, slot: 0, start: 0, length: 0 }])}
                >
                  Add Group Output
                </button>
              </div>
              {GOOutputs.map((go, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <div style={{height: '2.5rem'}} />}
                  <div className="p-4 bg-white rounded shadow">
                    {/* Number row - bold label and input */}
                    <div className="flex items-center mb-2">
                      <label className="font-bold text-slate-800 mr-4 min-w-[90px]" htmlFor={`go-number-${idx}`}>Number</label>
                      <input
                        id={`go-number-${idx}`}
                        type="number"
                        value={go.number}
                        onChange={e => {
                          const newOutputs = [...GOOutputs];
                          newOutputs[idx].number = Number(e.target.value);
                          setGOOutputs(newOutputs);
                        }}
                        className="font-bold p-2 border-2 border-green-500 rounded w-32"
                      />
                    </div>
                    {/* Name row */}
                    <div className="flex items-center mb-2">
                      <label className="text-slate-700 mr-4 min-w-[90px]" htmlFor={`go-name-${idx}`}>Name</label>
                      <input
                        id={`go-name-${idx}`}
                        type="text"
                        value={go.name}
                        onChange={e => {
                          const newOutputs = [...GOOutputs];
                          newOutputs[idx].name = e.target.value;
                          setGOOutputs(newOutputs);
                        }}
                        className="p-2 border rounded w-64"
                      />
                    </div>
                    {/* Rack row */}
                    <div className="flex items-center mb-2">
                      <label className="text-slate-700 mr-4 min-w-[90px]" htmlFor={`go-rack-${idx}`}>Rack</label>
                      <input
                        id={`go-rack-${idx}`}
                        type="number"
                        value={go.rack ?? 0}
                        onChange={e => {
                          const newOutputs = [...GOOutputs];
                          newOutputs[idx].rack = Number(e.target.value);
                          setGOOutputs(newOutputs);
                        }}
                        className="p-2 border rounded w-32"
                      />
                    </div>
                    {/* Slot row */}
                    <div className="flex items-center mb-2">
                      <label className="text-slate-700 mr-4 min-w-[90px]" htmlFor={`go-slot-${idx}`}>Slot</label>
                      <input
                        id={`go-slot-${idx}`}
                        type="number"
                        value={go.slot ?? 0}
                        onChange={e => {
                          const newOutputs = [...GOOutputs];
                          newOutputs[idx].slot = Number(e.target.value);
                          setGOOutputs(newOutputs);
                        }}
                        className="p-2 border rounded w-32"
                      />
                    </div>
                    {/* Start row */}
                    <div className="flex items-center mb-2">
                      <label className="text-slate-700 mr-4 min-w-[90px]" htmlFor={`go-start-${idx}`}>Start</label>
                      <input
                        id={`go-start-${idx}`}
                        type="number"
                        value={go.start ?? 0}
                        onChange={e => {
                          const newOutputs = [...GOOutputs];
                          newOutputs[idx].start = Number(e.target.value);
                          setGOOutputs(newOutputs);
                        }}
                        className="p-2 border rounded w-32"
                      />
                    </div>
                    {/* Length row */}
                    <div className="flex items-center">
                      <label className="text-slate-700 mr-4 min-w-[90px]" htmlFor={`go-length-${idx}`}>Length</label>
                      <input
                        id={`go-length-${idx}`}
                        type="number"
                        value={go.length ?? 0}
                        onChange={e => {
                          const newOutputs = [...GOOutputs];
                          newOutputs[idx].length = Number(e.target.value);
                          setGOOutputs(newOutputs);
                        }}
                        className="p-2 border rounded w-32"
                      />
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
            {/* R Config */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h3 className="font-semibold text-slate-800 mb-3">Registers (R)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="r-size" className="block text-sm font-medium text-slate-700">Size</label>
                  <input type="number" id="r-size" value={config.rSize} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="r-start-point" className="block text-sm font-medium text-slate-700">Start Point</label>
                  <input type="number" id="r-start-point" value={config.rStartPoint} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>
              {/* R Section Table (immediately below R config) */}
              {config.rSize > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">R</h3>
                  <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    <table className="w-full text-sm text-left text-slate-500">
                      <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                        <tr>
                          <th scope="col" className="px-4 py-3 w-1/4">Point</th>
                          <th scope="col" className="px-4 py-3">Label</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: config.rSize }, (_, i) => {
                          const point = config.rStartPoint + i;
                          return (
                            <tr key={`r-${point}`} className="bg-white border-b">
                              <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">{point}</td>
                              <td className="px-4 py-2">
                                <input
                                  type="text"
                                  value={labels.r && labels.r[point] !== undefined ? labels.r[point] : ""}
                                  onChange={(e) => handleLabelChange("r", point, e.target.value)}
                                  className="w-full bg-transparent border-0 focus:ring-0 p-0 m-0 text-slate-700"
                                  placeholder="Enter label..."
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            {/* Flags Config */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h3 className="font-semibold text-slate-800 mb-3">Flags</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="flags-size" className="block text-sm font-medium text-slate-700">Size</label>
                  <input type="number" id="flags-size" value={config.flagsSize} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="flags-start-point" className="block text-sm font-medium text-slate-700">Start Point</label>
                  <input type="number" id="flags-start-point" value={config.flagsStartPoint} onChange={handleConfigChange} min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
  {/* Buttons below configuration grid removed; only shown at top next to Import */}
        {/* Table Sections */}
        {(config.diSize === 0 && config.doSize === 0 && config.rSize === 0 && config.flagsSize === 0) ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-slate-900">
              No Fields Generated
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Configure and click "Generate Fields" to start labeling.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">            
            
            {/* Flags Section */}
            {config.flagsSize > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Flags</h3>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-4 py-3 w-1/4">Flag</th>
                        <th scope="col" className="px-4 py-3">Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: config.flagsSize }, (_, i) => {
                        const point = config.flagsStartPoint + i;
                        return (
                          <tr key={`flags-${point}`} className="bg-white border-b">
                            <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">{point}</td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={labels.flags[point] || ""}
                                onChange={(e) => handleLabelChange("flags", point, e.target.value)}
                                className="w-full bg-transparent border-0 focus:ring-0 p-0 m-0 text-slate-700"
                                placeholder="Enter label..."
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* System Variables Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">System Variables</h3>
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                <table className="w-full text-sm text-left text-slate-500">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                    <tr>
                      <th scope="col" className="px-4 py-3 w-1/4">Key</th>
                      <th scope="col" className="px-4 py-3">Value</th>
                      <th scope="col" className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemVariables.map((variable, idx) => (
                      <tr key={`sysvar-${idx}`} className="bg-white border-b">
                        <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">
                          <input
                            type="text"
                            value={variable.key}
                            onChange={e => {
                                const newVars = [...systemVariables];
                                newVars[idx].key = e.target.value;
                                setApps({
                                  ...apps,
                                  [appName]: {
                                    ...apps[appName],
                                    systemVariables: newVars,
                                  },
                                });
                              }}
                            placeholder="Key"
                            className="w-full bg-transparent border-0 focus:ring-0 p-0 m-0 text-slate-700"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={variable.value}
                            onChange={e => {
                                const newVars = [...systemVariables];
                                newVars[idx].value = e.target.value;
                                setApps({
                                  ...apps,
                                  [appName]: {
                                    ...apps[appName],
                                    systemVariables: newVars,
                                  },
                                });
                              }}
                            placeholder="Value"
                            className="w-full bg-transparent border-0 focus:ring-0 p-0 m-0 text-slate-700"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => {
                                const newVars = systemVariables.filter((_, i) => i !== idx);
                                setApps({
                                  ...apps,
                                  [appName]: {
                                    ...apps[appName],
                                    systemVariables: newVars,
                                  },
                                });
                              }}
                            className="text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={() => setApps({
                    ...apps,
                    [appName]: {
                      ...apps[appName],
                      systemVariables: [...systemVariables, { key: "", value: "" }],
                    },
                  })}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Add Variable
                </button>
              </div>
            </div>
            {/* FILES Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Files</h3>
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                <table className="w-full text-sm text-left text-slate-500">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                    <tr>
                      <th scope="col" className="px-4 py-3 w-1/4">File Name</th>
                      <th scope="col" className="px-4 py-3">Run</th>
                      <th scope="col" className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, idx) => (
                      <tr key={`file-${idx}`} className="bg-white border-b">
                        <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">
                          <input
                            type="text"
                            value={file.name}
                            onChange={e => {
                              const newFiles = [...files];
                              newFiles[idx].name = e.target.value;
                              setFiles(newFiles);
                            }}
                            placeholder="File name"
                            className="w-full bg-transparent border-0 focus:ring-0 p-0 m-0 text-slate-700"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={file.run}
                            onChange={e => {
                              const newFiles = [...files];
                              newFiles[idx].run = e.target.checked;
                              setFiles(newFiles);
                            }}
                            className="mr-1"
                          />
                          Run
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => {
                              const newFiles = files.filter((_, i) => i !== idx);
                              setFiles(newFiles);
                            }}
                            className="text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={() => setFiles([...files, { name: "", run: false }])}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Add File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AppDetail;
