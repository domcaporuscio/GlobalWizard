import React, { useState } from "react";
import AppManagement from "./components/AppManagement";
import AppDetail from "./components/AppDetail";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Apps, AppData } from "./types/types";
import "./App.css";

export const App: React.FC = () => {
  const [apps, setApps] = useLocalStorage<Apps>("ioLabelerApps", {});
  const [currentApp, setCurrentApp] = useState<string | null>(null);

  const handleSelectApp = (appName: string) => {
    setCurrentApp(appName);
  };

  // No longer needed, AppDetail updates apps directly

  return (
    <div className="bg-slate-100 text-slate-800 min-h-screen">
      {currentApp ? (
        <AppDetail
          appName={currentApp}
          appData={apps[currentApp]}
          apps={apps}
          setApps={setApps}
          onBack={() => setCurrentApp(null)}
        />
      ) : (
        <AppManagement
          apps={apps}
          setApps={setApps}
          onSelectApp={handleSelectApp}
        />
      )}
    </div>
  );
};

export default App;
