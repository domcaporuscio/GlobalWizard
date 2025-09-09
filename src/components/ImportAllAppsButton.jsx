import React from 'react';
// ...existing imports (if any)...

const ImportAllAppsButton = ({ onImport }) => {
  const handleImport = () => {
    if (onImport) {
      onImport();
    }
    // You can add file input logic here if needed
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleImport}
    >
      Import All Apps
    </button>
  );
};

export default ImportAllAppsButton;
