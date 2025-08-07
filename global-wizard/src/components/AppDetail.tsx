import React, { useState, useRef } from "react";
import type { AppData, Labels } from "../types/types";

interface AppDetailProps {
  appName: string;
  appData: AppData;
  onSave: (appData: AppData) => void;
  onBack: () => void;
}

export const AppDetail: React.FC<AppDetailProps> = ({
  appName,
  appData,
  onSave,
  onBack,
}) => {
  const [config, setConfig] = useState(appData.config);
  const [labels, setLabels] = useState(appData.labels);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const [type, ...fieldParts] = id.split("-");
    const field = fieldParts.join("-");
    // Convert 'start-point' to 'startPoint' for the config object
    const configField = field
      .split("-")
      .map((part, index) =>
        index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join("");

    setConfig((prev) => ({
      ...prev,
      [`${type}${configField.charAt(0).toUpperCase()}${configField.slice(1)}`]:
        parseInt(value) || 0,
    }));
  };

  const handleLabelChange = (
    type: keyof Labels,
    point: number,
    value: string
  ) => {
    setLabels((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [point]: value,
      },
    }));
  };

  const handleGenerate = () => {
    onSave({ config, labels: { di: {}, do: {}, r: {} } });
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const parsedLabels: Labels = { di: {}, do: {}, r: {} };

        const parseSection = (type: keyof Labels) => {
          const regex = new RegExp(
            `\\[${type.toUpperCase()}\\]([\\s\\S]*?)\\[\\/${type.toUpperCase()}\\]`
          );
          const match = content.match(regex);
          if (match) {
            match[1]
              .trim()
              .split("\n")
              .forEach((line) => {
                if (!line.trim()) return;
                const [point, ...labelParts] = line.split(",");
                const label = labelParts.join(",");
                const pointNum = parseInt(point.trim());
                if (!isNaN(pointNum)) {
                  parsedLabels[type][pointNum] = label.trim();
                }
              });
          }
        };

        ["di", "do", "r"].forEach((type) => parseSection(type as keyof Labels));
        setLabels(parsedLabels);
      } catch (error) {
        console.error("Failed to parse imported file:", error);
        alert(
          "Error: Could not parse the file. Please ensure it is in the correct format."
        );
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
          <div className="md:col-span-1 flex items-end justify-start md:justify-end space-x-3">
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
              accept=".txt"
            />
          </div>

          <div className="md:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
            {/* DI Config */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h3 className="font-semibold text-slate-800 mb-3">
                Digital Inputs (DI)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="di-size"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Size
                  </label>
                  <input
                    type="number"
                    id="di-size"
                    value={config.diSize}
                    onChange={handleConfigChange}
                    min="0"
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="di-start-point"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Start Point
                  </label>
                  <input
                    type="number"
                    id="di-start-point"
                    value={config.diStartPoint}
                    onChange={handleConfigChange}
                    min="0"
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* DO Config */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h3 className="font-semibold text-slate-800 mb-3">
                Digital Outputs (DO)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="do-size"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Size
                  </label>
                  <input
                    type="number"
                    id="do-size"
                    value={config.doSize}
                    onChange={handleConfigChange}
                    min="0"
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="do-start-point"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Start Point
                  </label>
                  <input
                    type="number"
                    id="do-start-point"
                    value={config.doStartPoint}
                    onChange={handleConfigChange}
                    min="0"
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* R Config */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h3 className="font-semibold text-slate-800 mb-3">
                Registers (R)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="r-size"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Size
                  </label>
                  <input
                    type="number"
                    id="r-size"
                    value={config.rSize}
                    onChange={handleConfigChange}
                    min="0"
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="r-start-point"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Start Point
                  </label>
                  <input
                    type="number"
                    id="r-start-point"
                    value={config.rStartPoint}
                    onChange={handleConfigChange}
                    min="0"
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 mt-4">
            <button
              onClick={handleGenerate}
              className="w-full md:w-auto bg-slate-800 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-slate-900 transition-colors duration-200"
            >
              Generate Fields
            </button>
          </div>
        </div>

        {config.diSize === 0 && config.doSize === 0 && config.rSize === 0 ? (
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
            {/* DI Section */}
            {config.diSize > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  DI
                </h3>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-4 py-3 w-1/4">
                          Point
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Label
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: config.diSize }, (_, i) => {
                        const point = config.diStartPoint + i;
                        return (
                          <tr key={`di-${point}`} className="bg-white border-b">
                            <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">
                              {point}
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={labels.di[point] || ""}
                                onChange={(e) =>
                                  handleLabelChange("di", point, e.target.value)
                                }
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

            {/* DO Section */}
            {config.doSize > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  DO
                </h3>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-4 py-3 w-1/4">
                          Point
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Label
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: config.doSize }, (_, i) => {
                        const point = config.doStartPoint + i;
                        return (
                          <tr key={`do-${point}`} className="bg-white border-b">
                            <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">
                              {point}
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={labels.do[point] || ""}
                                onChange={(e) =>
                                  handleLabelChange("do", point, e.target.value)
                                }
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

            {/* R Section */}
            {config.rSize > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">R</h3>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-4 py-3 w-1/4">
                          Point
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Label
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: config.rSize }, (_, i) => {
                        const point = config.rStartPoint + i;
                        return (
                          <tr key={`r-${point}`} className="bg-white border-b">
                            <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">
                              {point}
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={labels.r[point] || ""}
                                onChange={(e) =>
                                  handleLabelChange("r", point, e.target.value)
                                }
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
        )}
      </div>
    </div>
  );
};
