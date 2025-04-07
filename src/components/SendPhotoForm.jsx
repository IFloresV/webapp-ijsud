import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

import { toast } from "sonner";

const MAX_FILE_SIZE_MB = 2;

const SendPhotoForm = () => {
   const [file, setFile] = useState(null);
   const [email, setEmail] = useState("");
   const [preview, setPreview] = useState("");
   const fileInputRef = useRef(null);

   const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];

      if (selectedFile) {
         const sizeMB = selectedFile.size / (1024 * 1024);
         console.log("sizeMB", sizeMB);
         console.log("MAX_FILE_SIZE_MB", MAX_FILE_SIZE_MB);
         if (sizeMB > MAX_FILE_SIZE_MB) {
            alert(`La imagen supera el límite de ${MAX_FILE_SIZE_MB} MB.`);
            e.target.value = "";
            setFile(null);
            setPreview("");
            return;
         }

         setFile(selectedFile);
         setPreview(URL.createObjectURL(selectedFile));
      }
   };
   const sendEmail = async (e) => {
      e.preventDefault();
      if (!file || !email) {
         toast.warning("Completa todos los campos");
         return;
      }
      try {
         if (file.size > 2 * 1024 * 1024) {
            toast.error("La imagen debe ser menor a 2MB");
            return;
         }

         const base64 = await resizeImage(file);

         const templateParams = {
            to_email: email,
            image_base64: base64,
         };

         await emailjs.send(
            import.meta.env.VITE_SERVICE_ID,
            import.meta.env.VITE_TEMPLATE_ID,
            templateParams,
            import.meta.env.VITE_PUBLIC_KEY,
         );

         toast.success("Factura enviada con éxito ✅");
         setFile(null);
         setEmail("");
         setPreview("");
         fileInputRef.current.value = "";
      } catch (err) {
         console.error(err);
         toast.error("Error al enviar la Factura 😞");
      }
   };

   const resizeImage = (file, maxWidth = 600) => {
      return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
               const canvas = document.createElement("canvas");
               const scaleSize = maxWidth / img.width;
               canvas.width = maxWidth;
               canvas.height = img.height * scaleSize;

               const ctx = canvas.getContext("2d");
               ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

               const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7);
               resolve(resizedBase64);
            };
            img.onerror = reject;
         };
         reader.onerror = reject;
         reader.readAsDataURL(file);
      });
   };

   return (
      <div className="w-full max-w-xs mx-auto px-4 sm:px-6 py-6 mt-10 bg-gray-100 shadow-lg rounded-xl border border-gray-300">
         <h2 className="text-2xl font-bold mb-4 text-center">Envia tu factura</h2>
         <form onSubmit={sendEmail} className="flex flex-col gap-4">
            <input
               type="email"
               placeholder="Correo del destinatario"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
               type="file"
               accept="image/*"
               onChange={handleFileChange}
               ref={fileInputRef}
               required
               capture="camera"
               className="border border-gray-300 p-2 rounded bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview && (
               <div className="flex justify-center">
                  <img src={preview} alt="Vista previa" className="max-w-full max-h-64 rounded shadow" />
               </div>
            )}
            <button
               type="submit"
               className="bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition"
            >
               Enviar
            </button>
         </form>
      </div>
   );
};

export default SendPhotoForm;
