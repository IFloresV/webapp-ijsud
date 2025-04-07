import React from "react";
import { Toaster } from "sonner";

const Notification = ({ position = "top-right" }) => {
   return (
      <Toaster
         expand={true}
         position={position}
         richColors
         closeButton
         duration={5000}
         pauseWhenPageIsHidden
         style={{ zIndex: 9999 }}
         onClick={(e) => e.stopPropagation()}
      />
   );
};

export default Notification;
