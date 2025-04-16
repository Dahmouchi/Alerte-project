import { ClipboardList, Mic, Type, Shield, Lock, Mail, User, FileText } from 'lucide-react';

export default function DocumentationPage() {
  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-200 mb-4">Guide d&apos;Utilisation - Signalement d&apos;Alerte</h1>
        <p className="text-lg text-gray-600 dark:text-gray-100">
          Notre plateforme vous permet de soumettre des alertes de manière sécurisée et confidentielle.
        </p>
      </div>

      {/* Security Section */}
      <section className="mb-16 p-6 bg-blue-50 dark:bg-slate-950 rounded-xl border border-blue-100">
        <div className="flex items-center mb-4">
          <Shield className="w-8 h-8 text-blue-600  mr-3" />
          <h2 className="text-2xl font-semibold text-blue-800">Sécurité et Confidentialité</h2>
        </div>
        <ul className="space-y-4 pl-2">
          <li className="flex items-start">
            <Lock className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <span>Tous les signalements sont protégés par <strong>chiffrement de bout en bout</strong></span>
          </li>
          <li className="flex items-start">
            <div className="w-5 h-5 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-sm">1</span>
            </div>
            <span>Un <strong>CAPTCHA</strong> est requis pour prévenir les soumissions automatisées</span>
          </li>
          <li className="flex items-start">
            <div className="w-5 h-5 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-sm">2</span>
            </div>
            <span>Option d&apos;<strong>anonymat complet</strong> disponible</span>
          </li>
        </ul>
      </section>

      {/* Process Steps */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
          <ClipboardList className="w-6 h-6 mr-2 text-emerald-600" />
          Processus de Signalement
        </h2>

        <div className="space-y-12">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 bg-white p-6 dark:bg-slate-950  rounded-lg shadow-sm border border-gray-100">
              <div className="bg-emerald-100 dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-emerald-700 font-bold text-xl dark:text-emerald-300">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choix du Mode de Signalement</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Type className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Alerte Écrite</p>
                    <p className="text-sm text-gray-500">Formulaire détaillé avec champs structurés</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mic className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Alerte Audio</p>
                    <p className="text-sm text-gray-500">Enregistrement vocal avec option d&apos;anonymisation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-2/3 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <img src="/mode-selection.png" alt="Choix du mode" className="rounded border shadow-sm" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 bg-white dark:bg-slate-950  p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-emerald-100 dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-emerald-700 font-bold text-xl dark:text-emerald-300">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Remplissage du Formulaire</h3>
              
              <h4 className="font-medium mt-4 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Pour les alertes écrites:
              </h4>
              <ul className="space-y-2 text-sm pl-6 list-disc text-gray-600">
                <li>Sélection de la catégorie via des cartes interactives</li>
                <li>Résumé du signalement (2000 caractères max)</li>
                <li>Date et lieu des faits</li>
                <li>Personnes impliquées (facultatif)</li>
                <li>Pièces jointes (images, documents, audio)</li>
              </ul>

              <h4 className="font-medium mt-4 mb-2 flex items-center">
                <Mic className="w-4 h-4 mr-2" />
                Pour les alertes audio:
              </h4>
              <ul className="space-y-2 text-sm pl-6 list-disc text-gray-600">
                <li>Enregistrement vocal (max 5 minutes)</li>
                <li>Option de modulation vocale pour anonymisation</li>
                <li>Transcription automatique pour vérification</li>
              </ul>
            </div>
            <div className="md:w-2/3 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <img src="/form-example.png" alt="Exemple de formulaire" className="rounded border shadow-sm" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 bg-white dark:bg-slate-950  p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-emerald-100 dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-emerald-700 font-bold text-xl dark:text-emerald-300">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Confidentialité et Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Options de contact</p>
                    <ul className="text-sm text-gray-500 list-disc pl-5 mt-1">
                      <li>Contact direct (email/téléphone)</li>
                      <li>Boîte de dialogue anonyme</li>
                      <li>Aucun contact</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Conditions de protection</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Case à cocher obligatoire pour accepter le traitement sécurisé de vos données
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-2/3 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <img src="/privacy-options.png" alt="Options de confidentialité" className="rounded border shadow-sm" />
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 bg-white dark:bg-slate-950  p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-emerald-100 dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-emerald-700 font-bold text-xl dark:text-emerald-300">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Finalisation</h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  Après soumission, vous recevrez un <strong>code de suivi unique</strong> qui vous permettra de:
                </p>
                <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                  <li>Suivre l&apos;avancement du traitement de votre alerte</li>
                  <li>Ajouter des informations complémentaires</li>
                  <li>Communiquer de manière sécurisée avec notre équipe</li>
                </ul>
                <p className="text-sm bg-yellow-50 dark:bg-yellow-800 p-3 rounded border border-yellow-100 mt-3">
                  <strong>Important:</strong> Conservez précieusement ce code, c&apos;est votre seul moyen d&apos;accéder à votre signalement si vous n&apos;avez pas créé de compte.
                </p>
              </div>
            </div>
            <div className="md:w-2/3 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <img src="/confirmation.png" alt="Page de confirmation" className="rounded border shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-white dark:bg-slate-950  rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Questions Fréquentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg">Puis-je rester complètement anonyme ?</h3>
            <p className="text-gray-600 mt-1">
              Oui, vous pouvez choisir l&apos;option Contact anonyme qui permet de communiquer via une boîte de dialogue sécurisée sans révéler votre identité.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-lg">Comment fonctionne la modulation vocale ?</h3>
            <p className="text-gray-600 mt-1">
              Notre système transforme votre voix en temps réel pour la rendre méconnaissable, tout en conservant l&apos;intelligibilité du message. Vous pouvez écouter le résultat avant soumission.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-lg">Quels types de fichiers puis-je joindre ?</h3>
            <p className="text-gray-600 mt-1">
              Vous pouvez ajouter des images (JPG, PNG), documents (PDF, DOCX) et enregistrements audio (MP3, WAV). Taille maximale par fichier: 10MB.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}