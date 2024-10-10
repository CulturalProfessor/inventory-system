import { DashboardLayout } from "@toolpad/core/DashboardLayout";

import { AppProvider } from "@toolpad/core/AppProvider";
import React from "react";

 const App: React.FC = () => {
  return (
    <React.Fragment>
      <AppProvider>
        <DashboardLayout>Hello</DashboardLayout>
      </AppProvider>
    </React.Fragment>
  );
};

export default App;