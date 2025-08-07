import React, { useState } from "react";
import type { Apps } from "../types/types";
import JSZip from "jszip";

interface AppManagementProps {
  apps: Apps;
  setApps: (apps: Apps) => void;
  onSelectApp: (appName: string) => void;
}

export const AppManagement: React.FC<AppManagementProps> = ({
  apps,
  setApps,
  onSelectApp,
}) => {
  const [newAppName, setNewAppName] = useState("");

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
          doSize: 16,
          doStartPoint: 1,
          rSize: 16,
          rStartPoint: 1,
        },
        labels: { di: {}, do: {}, r: {} },
      },
    });
    setNewAppName("");
  };

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

      ["di", "do", "r"].forEach((type) => {
        const labels = appData.labels[type as keyof typeof appData.labels];
        if (Object.keys(labels).length > 0) {
          manifestContent += `[${type.toUpperCase()}]\n`;
          Object.entries(labels)
            .sort(([a], [b]) => Number(a) - Number(b))
            .forEach(([point, label]) => {
              manifestContent += `${point},${label}\n`;
            });
          manifestContent += `[/${type.toUpperCase()}]\n\n`;
        }
      });

      appFolder!.file("manifest.txt", manifestContent.trim());
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

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newAppName}
            onChange={(e) => setNewAppName(e.target.value)}
            placeholder="Enter new app name"
            className="flex-grow p-2 border rounded"
          />
          <button
            onClick={handleAddApp}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add App
          </button>
        </div>

        {Object.keys(apps).length > 0 && (
          <button
            onClick={handleExportAll}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Export All Apps
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(apps).map(([appName]) => (
          <div
            key={appName}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-4">{appName}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onSelectApp(appName)}
                className="flex-grow px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
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
  );
};
