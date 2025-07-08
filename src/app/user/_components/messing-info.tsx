/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, AlertCircle, Send, CloudUpload } from "lucide-react";
import { useRef, useState } from "react";
import { saveJustif } from "@/actions/user";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


interface MissingInformationSectionProps {
  al: any;
  onReload: () => void;
}

const MissingInformationSection = ({ al, onReload }: MissingInformationSectionProps) => {  
  const [justificationText, setJustificationText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length === 0) return;

    // Convert FileList to array and filter valid files
    const newFiles = Array.from(selectedFiles).filter((file) => {
      // Validate file size (6MB max)
      if (file.size > 6 * 1024 * 1024) {
        setError(`File ${file.name} is too large (max 6MB)`);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset to allow selecting same file again
      fileInputRef.current.click();
    }
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!session) return null;
    try {
      await saveJustif(
        al.id, // alertId
        session.user.id,
        justificationText, // content
        files // files
      );
        toast.success("Justification envoyée avec succès !");
        onReload();
        router.refresh();
        window.location.href ="/user/dashboard";
        setJustificationText("");
        setFiles([]);  
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi de la justification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-4 p-6 mb-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Pièces jointes (optionnel)
      </label>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Justification</label>
          <Textarea
            id="justification"
            value={justificationText}
            onChange={(e: any) => setJustificationText(e.target.value)}
            placeholder="Veuillez fournir les informations manquantes ou expliquer pourquoi elles ne sont pas disponibles..."
            className="min-h-[120px] bg-white  dark:bg-slate-700"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Attachments</label>
          <div className="space-y-4">
            <div
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={triggerFileInput}
            >
              <CloudUpload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-400">
                SVG, PNG, JPG, GIF or PDF (max 6MB)
              </p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept=".png,.jpg,.jpeg,.gif,.svg,.pdf"
                className="hidden"
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            {files.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Selected files:</h4>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center">
                        <Paperclip className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            disabled={!justificationText || isSubmitting}
            className="gap-2 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Envoyer
              </>
            )}
          </Button>
        </div>
      </form>
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
            Informations supplémentaires
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Cette alerte nécessite des informations supplémentaires.
          </p>
        </div>
      </div>
    </div>
  );
};
export default MissingInformationSection;
