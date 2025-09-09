import React from "react";
import AppDetail from "./AppDetail";
import type { Apps, AppConfig, Labels } from "../types/types";
import JSZip from "jszip";

interface AppManagementProps {
  apps: Apps;
  setApps: (apps: Apps) => void;
  onSelectApp: (appName: string) => void;
}

const AppManagement: React.FC<AppManagementProps> = ({ apps, setApps, onSelectApp }) => {
  const [newAppName, setNewAppName] = React.useState("");
  // Edit Flags state removed
  const [selectedApp, setSelectedApp] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddApp = () => {
    if (!newAppName.trim()) {
      alert("Please enter a valid app name.");
      return;
    }
    if (apps[newAppName]) {
      alert("An app with this name already exists.");
      return;
    }
    setApps({
      ...apps,
      [newAppName]: {
        config: {
          diSize: 16,
          diStartPoint: 1,
          diRack: 0,
          diSlot: 0,
          doSize: 16,
          doStartPoint: 1,
          doRack: 0,
          doSlot: 0,
          uiSize: 16,
          uiStartPoint: 1,
          uiRack: 0,
          uiSlot: 0,
          uoSize: 16,
          uoStartPoint: 1,
          uoRack: 0,
          uoSlot: 0,
          rSize: 16,
          rStartPoint: 1,
          flagsSize: 16,
          flagsStartPoint: 1,
          groupSize: 0,
          groupLength: 0,
          groupStartPoint: 1,
          groupRack: 0,
          groupSlot: 0,
          giLength: 0,
          giStartPoint: 1,
          giRack: 0,
          giSlot: 0,
        },
        labels: { di: {}, do: {}, ui: {}, uo: {}, r: {}, flags: {}, userInputs: {} },
        files: [],
        systemVariables: [],
      },
    });
    setNewAppName("");
  };

  // Edit Flags handlers removed

  const handleDeleteApp = (appName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the app "${appName}"? This cannot be undone.`
      )
    ) {
      const newApps = { ...apps };
      delete newApps[appName];
      setApps(newApps);
    }
  };

  const handleExportAll = async () => {
    const zip = new JSZip();
    const rootFolder = zip.folder("Apps");
    Object.entries(apps).forEach(([appName, appData]) => {
      const appFolder = rootFolder!.folder(appName);
      let manifestContent = "";

      // 1. SETVAR
      if (appData.systemVariables && appData.systemVariables.length > 0) {
        manifestContent += `[SETVAR]\n`;
        appData.systemVariables.forEach(({ key, value }) => {
          manifestContent += `${key} = ${value}\n`;
        });
        manifestContent += `[\/SETVAR]\n\n`;
      }

      // 2. FILES
      if (appData.files && appData.files.length > 0) {
        manifestContent += `[FILES]\n`;
        appData.files.forEach(file => {
          manifestContent += `${file.name}${file.run ? " RUN" : ""}\n`;
        });
        manifestContent += `[\/FILES]\n\n`;
      }

      // 3. DI
      const diLabels = appData.labels.di || {};
      if (Object.keys(diLabels).length > 0) {
        manifestContent += `[DI]\n`;
        const config = appData.config;
        manifestContent += `RACK: ${config.diRack}\n`;
        manifestContent += `SLOT: ${config.diSlot}\n`;
        manifestContent += `START: ${config.diStartPoint}\n`;
        manifestContent += `RANGE: ${config.diStartPoint} - ${config.diStartPoint + config.diSize - 1}\n`;
        Object.entries(diLabels)
          .sort(([a], [b]) => Number(a) - Number(b))
          .forEach(([point, label]) => {
            manifestContent += `${point},"${label}"\n`;
          });
        manifestContent += `[/DI]\n\n`;
      }

      // 4. DO
      const doLabels = appData.labels.do || {};
      if (Object.keys(doLabels).length > 0) {
        manifestContent += `[DO]\n`;
        const config = appData.config;
        manifestContent += `RACK: ${config.doRack}\n`;
        manifestContent += `SLOT: ${config.doSlot}\n`;
        manifestContent += `START: ${config.doStartPoint}\n`;
        manifestContent += `RANGE: ${config.doStartPoint} - ${config.doStartPoint + config.doSize - 1}\n`;
        Object.entries(doLabels)
          .sort(([a], [b]) => Number(a) - Number(b))
          .forEach(([point, label]) => {
            manifestContent += `${point},"${label}"\n`;
          });
        manifestContent += `[/DO]\n\n`;
      }


      // 5. GI
      const groupInputs = appData.groupInputs || [];
      if (groupInputs.length > 0) {
        manifestContent += `[GI]\n`;
        groupInputs.forEach(gi => {
          manifestContent += `RACK: ${gi.rack}\n`;
          manifestContent += `SLOT: ${gi.slot}\n`;
          manifestContent += `START: ${gi.start}\n`;
          manifestContent += `LENGTH: ${gi.length}\n`;
          manifestContent += `RANGE: ${gi.number} - ${gi.number}\n`;
          manifestContent += `${gi.number}, "${gi.name}"\n`;
        });
        manifestContent += `[/GI]\n`;
      }

      // 6. GO
      const groupOutputs = appData.groupOutputs || [];
      if (groupOutputs.length > 0) {
        manifestContent += `[GO]\n`;
        groupOutputs.forEach(go => {
          manifestContent += `RACK: ${go.rack}\n`;
          manifestContent += `SLOT: ${go.slot}\n`;
          manifestContent += `START: ${go.start}\n`;
          manifestContent += `LENGTH: ${go.length}\n`;
          manifestContent += `RANGE: ${go.number} - ${go.number}\n`;
          manifestContent += `${go.number}, "${go.name}"\n`;
        });
        manifestContent += `[/GO]\n`;
      }


      // 7. UI
      const uiLabels = appData.labels.ui || {};
      if (Object.keys(uiLabels).length > 0) {
        manifestContent += `[UI]\n`;
        const config = appData.config;
        manifestContent += `RACK: ${config.uiRack}\n`;
        manifestContent += `SLOT: ${config.uiSlot}\n`;
        manifestContent += `START: ${config.uiStartPoint}\n`;
        manifestContent += `RANGE: ${config.uiStartPoint} - ${config.uiStartPoint + config.uiSize - 1}\n`;
        Object.entries(uiLabels)
          .sort(([a], [b]) => Number(a) - Number(b))
          .forEach(([point, label]) => {
            manifestContent += `${point},"${label}"\n`;
          });
        manifestContent += `[/UI]\n\n`;
      }

      // 8. UO
      const uoLabels = appData.labels.uo || {};
      if (Object.keys(uoLabels).length > 0) {
        manifestContent += `[UO]\n`;
        const config = appData.config;
        manifestContent += `RACK: ${config.uoRack}\n`;
        manifestContent += `SLOT: ${config.uoSlot}\n`;
        manifestContent += `START: ${config.uoStartPoint}\n`;
        manifestContent += `RANGE: ${config.uoStartPoint} - ${config.uoStartPoint + config.uoSize - 1}\n`;
        Object.entries(uoLabels)
          .sort(([a], [b]) => Number(a) - Number(b))
          .forEach(([point, label]) => {
            manifestContent += `${point},"${label}"\n`;
          });
        manifestContent += `[/UO]\n\n`;
      }

      // 9. Flags
      const flagLabels = appData.labels.flags || {};
      if (Object.keys(flagLabels).length > 0) {
        manifestContent += `[FLAGS]\n`;
        Object.entries(flagLabels)
          .sort(([a], [b]) => Number(a) - Number(b))
          .forEach(([point, label]) => {
            manifestContent += `${point},"${label}"\n`;
          });
        manifestContent += `[/FLAGS]\n\n`;
      }

      // 10. Registers
      const rLabels = appData.labels.r || {};
      if (Object.keys(rLabels).length > 0) {
        manifestContent += `[Registers]\n`;
        Object.entries(rLabels)
          .sort(([a], [b]) => Number(a) - Number(b))
          .forEach(([point, label]) => {
            manifestContent += `${point},"${label}"\n`;
          });
        manifestContent += `[/Registers]\n\n`;
      }

      appFolder!.file("manifest.dt", manifestContent.trim());
    });
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Apps_Export.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import All Apps handler
  const handleImportAll = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const JSZipMod = await import('jszip');
      const zip = await JSZipMod.default.loadAsync(file);
      const rootFolder = zip.folder('Apps');
      if (!rootFolder) throw new Error('Invalid zip structure: missing Apps folder');
      const newApps: Apps = { ...apps };
      // Find all manifest.dt files anywhere in the zip
      const manifestFiles = Object.values(zip.files)
        .filter(f => !f.dir && f.name.toLowerCase().endsWith('manifest.dt'));
      for (const fileObj of manifestFiles) {
        const manifestFile = zip.file(fileObj.name);
        if (!manifestFile) {
          console.warn('Manifest file not found for:', fileObj.name);
          continue;
        }
        const manifestContent = await manifestFile.async('string');
        // Extract appName from file path
        let appName = '';
        // Try folder structure: .../appName/manifest.dt
        const folderMatch = fileObj.name.match(/([^/]+)\/manifest\.dt$/);
        if (folderMatch) {
          appName = folderMatch[1];
        } else {
          // Try flat file: .../appName_manifest.dt
          const flatMatch = fileObj.name.match(/([^/]+)_manifest\.dt$/);
          if (flatMatch) {
            appName = flatMatch[1];
          } else {
            // Fallback: use filename
            appName = fileObj.name.split('/').pop()?.replace(/_manifest\.dt$/, '').replace(/manifest\.dt$/, '') || '';
          }
        }
        if (!appName) {
          console.error('Could not extract app name from:', fileObj.name);
          continue;
        }
        if (newApps[appName]) {
          console.warn('App already exists and will be overwritten:', appName);
        }
        if (!manifestContent.trim()) {
          console.error('Manifest file is empty for:', appName);
          continue;
        }
        console.log('Importing app:', appName, 'from', fileObj.name);
        // Default config and labels
        const config: AppConfig = {
          diSize: 16, diStartPoint: 1, diRack: 0, diSlot: 0,
          doSize: 16, doStartPoint: 1, doRack: 0, doSlot: 0,
          uiSize: 16, uiStartPoint: 1, uiRack: 0, uiSlot: 0,
          uoSize: 16, uoStartPoint: 1, uoRack: 0, uoSlot: 0,
          rSize: 16, rStartPoint: 1,
          flagsSize: 16, flagsStartPoint: 1,
          groupSize: 0, groupLength: 0, groupStartPoint: 0, groupRack: 0, groupSlot: 0,
          giLength: 0, giStartPoint: 0, giRack: 0, giSlot: 0
        };
        const labels: Labels = { di: {}, do: {}, r: {}, flags: {}, ui: {}, uo: {}, userInputs: {} };
        let files: Array<{ name: string; run: boolean }> = [];
        let systemVariables: Array<{ key: string; value: string }> = [];
        let currentSection = '';
        // Section parsing for all exported manifest sections
        let giBuffer: any = null, goBuffer: any = null;
        let groupInputs: any[] = [], groupOutputs: any[] = [];
        manifestContent.split(/\r?\n/).forEach(line => {
          if (line.startsWith('[') && line.endsWith(']')) {
            currentSection = line.replace(/\[|\]/g, '').toLowerCase();
            giBuffer = null;
            goBuffer = null;
          } else if (line && currentSection) {
            if (currentSection === 'di') {
              if (line.startsWith('RACK:')) config.diRack = Number(line.split(':')[1].trim());
              else if (line.startsWith('SLOT:')) config.diSlot = Number(line.split(':')[1].trim());
              else if (line.startsWith('START:')) config.diStartPoint = Number(line.split(':')[1].trim());
              else if (line.startsWith('RANGE:')) {
                const [start, end] = line.split(':')[1].trim().split(' - ').map(Number);
                config.diSize = end - start + 1;
              } else {
                const match = line.match(/^(\d+),"(.*)"$/);
                if (match) labels.di[Number(match[1])] = match[2];
              }
            } else if (currentSection === 'do') {
              if (line.startsWith('RACK:')) config.doRack = Number(line.split(':')[1].trim());
              else if (line.startsWith('SLOT:')) config.doSlot = Number(line.split(':')[1].trim());
              else if (line.startsWith('START:')) config.doStartPoint = Number(line.split(':')[1].trim());
              else if (line.startsWith('RANGE:')) {
                const [start, end] = line.split(':')[1].trim().split(' - ').map(Number);
                config.doSize = end - start + 1;
              } else {
                const match = line.match(/^(\d+),"(.*)"$/);
                if (match) labels.do[Number(match[1])] = match[2];
              }
            } else if (currentSection === 'ui') {
              if (line.startsWith('RACK:')) config.uiRack = Number(line.split(':')[1].trim());
              else if (line.startsWith('SLOT:')) config.uiSlot = Number(line.split(':')[1].trim());
              else if (line.startsWith('START:')) config.uiStartPoint = Number(line.split(':')[1].trim());
              else if (line.startsWith('RANGE:')) {
                const [start, end] = line.split(':')[1].trim().split(' - ').map(Number);
                config.uiSize = end - start + 1;
              } else {
                const match = line.match(/^(\d+),"(.*)"$/);
                if (match) labels.ui[Number(match[1])] = match[2];
              }
            } else if (currentSection === 'uo') {
              if (line.startsWith('RACK:')) config.uoRack = Number(line.split(':')[1].trim());
              else if (line.startsWith('SLOT:')) config.uoSlot = Number(line.split(':')[1].trim());
              else if (line.startsWith('START:')) config.uoStartPoint = Number(line.split(':')[1].trim());
              else if (line.startsWith('RANGE:')) {
                const [start, end] = line.split(':')[1].trim().split(' - ').map(Number);
                config.uoSize = end - start + 1;
              } else {
                const match = line.match(/^(\d+),"(.*)"$/);
                if (match) labels.uo[Number(match[1])] = match[2];
              }
            } else if (currentSection === 'gi') {
              if (!giBuffer) giBuffer = {};
              if (line.startsWith('RACK:')) giBuffer.rack = Number(line.split(':')[1].trim());
              else if (line.startsWith('SLOT:')) giBuffer.slot = Number(line.split(':')[1].trim());
              else if (line.startsWith('START:')) giBuffer.start = Number(line.split(':')[1].trim());
              else if (line.startsWith('LENGTH:')) giBuffer.length = Number(line.split(':')[1].trim());
              else if (line.match(/^\d+,/)) {
                const m = line.match(/^(\d+),\s*"?(.*?)"?$/);
                if (m) {
                  giBuffer.number = Number(m[1]);
                  giBuffer.name = m[2];
                  groupInputs.push({ ...giBuffer });
                  giBuffer = {};
                }
              }
            } else if (currentSection === 'go') {
              if (!goBuffer) goBuffer = {};
              if (line.startsWith('RACK:')) goBuffer.rack = Number(line.split(':')[1].trim());
              else if (line.startsWith('SLOT:')) goBuffer.slot = Number(line.split(':')[1].trim());
              else if (line.startsWith('START:')) goBuffer.start = Number(line.split(':')[1].trim());
              else if (line.startsWith('LENGTH:')) goBuffer.length = Number(line.split(':')[1].trim());
              else if (line.match(/^\d+,/)) {
                const m = line.match(/^(\d+),\s*"?(.*?)"?$/);
                if (m) {
                  goBuffer.number = Number(m[1]);
                  goBuffer.name = m[2];
                  groupOutputs.push({ ...goBuffer });
                  goBuffer = {};
                }
              }
            } else if (currentSection === 'r' || currentSection === 'registers') {
              const match = line.match(/^(\d+),"(.*)"$/);
              if (match) labels.r[Number(match[1])] = match[2];
              // Set rSize to the largest point number found in labels.r
              const rPoints = Object.keys(labels.r).map(Number);
              if (rPoints.length > 0) {
                // This will be re-evaluated for each line, but only the largest matters
                config.rSize = Math.max(...rPoints);
              }
            } else if (currentSection === 'flags') {
              const match = line.match(/^(\d+),"(.*)"$/);
              if (match) labels.flags[Number(match[1])] = match[2];
            } else if (currentSection === 'files') {
              const fileMatch = line.match(/^(.*?)( RUN)?$/);
              if (fileMatch) files.push({ name: fileMatch[1], run: !!fileMatch[2] });
            } else if (currentSection === 'setvar') {
              const setvarMatch = line.match(/^(.*?) = (.*)$/);
              if (setvarMatch) systemVariables.push({ key: setvarMatch[1].trim(), value: setvarMatch[2].trim() });
            }
          }
        });
        // Assign GI/GO arrays to app object
  newApps[appName] = { config, labels, files, systemVariables, groupInputs, groupOutputs };
      }
      setApps(newApps);
      alert('Import successful!');
    } catch (error) {
      console.error('Error importing apps:', error);
      alert('Error importing apps. Please check the console for details.');
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <h2>App Management</h2>
      <div>
        <input
          type="text"
          value={newAppName}
          onChange={(e) => setNewAppName(e.target.value)}
          placeholder="Enter new app name"
        />
        <button onClick={handleAddApp}>Add App</button>
      </div>
      <div>
        <h3>Existing Apps</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(apps).map((appName) => (
            <div
              key={appName}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <h3 className="text-xl font-semibold mb-4">{appName}</h3>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => onSelectApp(appName)}
                  className="flex-grow px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Select
                </button>
                {/* Edit Flags button removed */}
                <button
                  onClick={() => handleDeleteApp(appName)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <button onClick={handleExportAll}>Export All Apps</button>
        <input
          type="file"
          accept=".zip"
          onChange={handleImportAll}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Import All Apps (ZIP)
        </button>
      </div>
  {/* Edit Flags modal removed */}
      {selectedApp && (
        <AppDetail
          appName={selectedApp}
          appData={{
            ...apps[selectedApp],
            systemVariables: apps[selectedApp].systemVariables || [],
          }}
          apps={{
            ...apps,
            [selectedApp]: {
              ...apps[selectedApp],
              systemVariables: apps[selectedApp].systemVariables || [],
            },
          }}
          setApps={setApps}
          onBack={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};

export default AppManagement;
