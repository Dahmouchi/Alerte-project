/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, AlertCircle, Send, CloudUpload } from "lucide-react";
import { useState } from "react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { saveJustif } from "@/actions/user";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const MissingInformationSection = (al: any) => {
  const [justificationText, setJustificationText] = useState("");
  const [attachments, setAttachments] = useState<File[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 6, // Now allows files up to 6MB
    multiple: true,
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!session) return null;
    try {
      const justif = await saveJustif(
        al.al.id, // alertId
        session.user.id,
        justificationText, // content
        attachments // files
      );
      if (justif) {
        window.location.reload();
        toast.success("Justification envoyée avec succès !");
        router.refresh();
        setJustificationText("");
        setAttachments([]);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi de la justification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-4 p-6 mb-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
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

      <div className="space-y-4">
        <div>
          <label
            htmlFor="justification"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Justification / Informations complémentaires
          </label>
          <Textarea
            id="justification"
            value={justificationText}
            onChange={(e: any) => setJustificationText(e.target.value)}
            placeholder="Veuillez fournir les informations manquantes ou expliquer pourquoi elles ne sont pas disponibles..."
            className="min-h-[120px] bg-white  dark:bg-slate-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pièces jointes (optionnel)
          </label>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <FileUploader
                value={attachments}
                onValueChange={setAttachments}
                dropzoneOptions={dropZoneConfig}
                className="relative rounded-lg p-2 dark:bg-slate-800 "
              >
                <FileInput
                  id="fileInput"
                  className="outline-dashed outline-1 outline-slate-500 dark:outline-gray-200"
                >
                  <div className="flex items-center justify-center flex-col p-8 w-full ">
                    <CloudUpload className="text-gray-500 dark:text-gray-200 w-10 h-10" />
                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-200 ">
                      <span className="font-semibold">
                        Cliquez pour télécharger
                      </span>
                      &nbsp; ou glisser-déposer
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF
                    </p>
                  </div>
                </FileInput>
                <FileUploaderContent>
                  {attachments &&
                    attachments.length > 0 &&
                    attachments.map((file, i) => (
                      <FileUploaderItem key={i} index={i}>
                        <Paperclip className="h-4 w-4 stroke-current" />
                        <span>{file.name}</span>
                      </FileUploaderItem>
                    ))}
                </FileUploaderContent>
              </FileUploader>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSubmit}
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
      </div>
    </div>
  );
};
export default MissingInformationSection;
