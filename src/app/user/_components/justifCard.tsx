/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { User, Calendar, FileText, X } from "lucide-react";
import { format, toZonedTime } from "date-fns-tz";
import { fr } from "date-fns/locale";
import { useState } from "react";

export default function JustifCard(justif: any) {
  const formatFrenchDate = (isoString: any) => {
    const parisTime = toZonedTime(isoString, "Europe/Paris");
    return format(parisTime, "dd/MM/yyyy à HH:mm", {
      timeZone: "Europe/Paris",
      locale: fr,
    });
  };
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  return (
    <div className="bg-purple-100 inverted-radius2 dark:bg-slate-900 p-6 rounded-xl border  dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 group">
      {/* User Info */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-11 w-11 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center ring-2 ring-blue-100 dark:ring-slate-600">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Utilisateur
            </p>
          </div>
        </div>
      </div>

      {/* Justification content */}
      <div className="mb-5">
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Justification
        </h3>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {justif.justif.content || "Aucune justification fournie."}
          </p>
        </div>
      </div>

      {/* Attached Files */}
      <>
        {justif.justif.files?.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Fichiers joints
            </h3>
            <ul className="list-disc ml-4 space-y-1">
              {justif.justif.files.map((file: any, index: number) => (
                <li key={index}>
                  <button
                    onClick={() => setSelectedFile(file)}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    Voir le fichier {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedFile && (
          <FileModal
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
          />
        )}
      </>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Envoyé le {formatFrenchDate(justif.justif.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

const FileModal = ({ file, onClose }: { file: any; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 px-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Viewing File</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center">
          {file.url.endsWith(".pdf") ? (
            <iframe
              src={file.url}
              className="w-full h-[70vh] border rounded"
              title={`File Preview`}
            />
          ) : (
            <img
              src={file.url}
              alt="Preview"
              className="max-w-full max-h-[70vh] object-contain"
            />
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <a
            href={file.url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};
