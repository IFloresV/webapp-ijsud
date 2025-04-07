import React from "react";

import SendPhotoForm from "@components/SendPhotoForm";
import Notification from "./components/Notification";

const App = () => {
   return (
      <>
         <Notification />
         <SendPhotoForm />
      </>
   );
};

export default App;
