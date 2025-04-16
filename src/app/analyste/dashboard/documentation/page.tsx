import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle, XCircle, Mail, User, ClipboardList, FileText, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Documentation du Système de Gestion des Alertes
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Guide pour les Analystes et Responsables du processus de signalement
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Carte Analyste */}
        <Card className="border-blue-200 dark:border-blue-800 dark:bg-slate-950">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/30 rounded-t-lg p-4 border-b">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">
                Compte Analyste
              </h2>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Accès</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Accès complet à toutes les alertes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ClipboardList className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Responsabilités Principales</h3>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-1">
                  <li>Analyser les faits et évaluer la recevabilité des alertes</li>
                  <li>Mener les investigations nécessaires</li>
                  <li>Documenter les conclusions et preuves</li>
                  <li>Soumettre le travail pour validation par un Responsable</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Restrictions</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Ne peut pas clôturer une alerte seul - validation par un Responsable requise
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte Responsable */}
        <Card className="border-purple-200 dark:border-purple-800 dark:bg-slate-950">
          <CardHeader className="bg-purple-50 dark:bg-purple-900/30 rounded-t-lg p-4 border-b">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-200">
                Compte Responsable
              </h2>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Accès</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Supervision de toutes les alertes et du travail des analystes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ClipboardList className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Responsabilités Principales</h3>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-1">
                  <li>Vérifier le travail de l&apos;analyste et valider les décisions</li>
                  <li>Confirmer la recevabilité de l&apos;alerte après évaluation initiale</li>
                  <li>Approuver les mesures finales et la clôture</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Restrictions</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Ne peut pas clôturer une alerte seul - double validation (Analyste + Responsable) requise
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Processus */}
      <Card className="mb-8 dark:bg-slate-950">
        <CardHeader className="bg-slate-50 dark:bg-slate-800 rounded-t-lg p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <FileText className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            Processus de Traitement des Alertes
          </h2>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          {/* Étape 1 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <Badge className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white">
                1
              </Badge>
              <div className="w-px h-full bg-slate-200 dark:bg-slate-700 my-2"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                Notification de l&apos;Alerte
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Lorsqu&apos;une alerte est soumise, des notifications par email sont automatiquement envoyées à :
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>L&apos;Administrateur (Référent du dispositif)</li>
                <li>Un ou plusieurs Analystes</li>
                <li>Un ou plusieurs Responsables</li>
              </ul>
            </div>
          </div>

          {/* Étape 2 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <Badge className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white">
                2
              </Badge>
              <div className="w-px h-full bg-slate-200 dark:bg-slate-700 my-2"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Attribution de l&apos;Alerte
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                L&apos;alerte apparaît dans la liste des signalements en attente. L&apos;analyste doit :
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Ouvrir l&apos;alerte</li>
                <li>Sélectionner son nom dans une liste déroulante pour s&apos;auto-attribuer l&apos;alerte</li>
              </ul>
            </div>
          </div>

          {/* Étape 3 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <Badge className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white">
                3
              </Badge>
              <div className="w-px h-full bg-slate-200 dark:bg-slate-700 my-2"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                Évaluation de la Recevabilité
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                L&apos;analyste doit analyser l&apos;alerte et déterminer sa recevabilité :
              </p>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Alerte Recevable</span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Justification obligatoire requise
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Alerte Non Recevable</span>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    Justification obligatoire requise
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                Cette évaluation doit être validée par un Responsable avant de poursuivre.
              </p>
            </div>
          </div>

          {/* Étape 4 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <Badge className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white">
                4
              </Badge>
              <div className="w-px h-full bg-slate-200 dark:bg-slate-700 my-2"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-500" />
                Traitement de l&apos;Alerte par l&apos;Analyste
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Pour les alertes recevables, l&apos;analyste doit :
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Mener les investigations nécessaires</li>
                <li>Ajouter ses conclusions</li>
                <li>Joindre les documents et preuves si nécessaire</li>
                <li>Soumettre au Responsable pour validation finale</li>
              </ul>
            </div>
          </div>

          {/* Étape 5 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <Badge className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white">
                5
              </Badge>
            </div>
            <div className="flex-1">
              <h3 className="font-medium flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-500" />
                Validation Finale et Clôture
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Le Responsable examine l&apos;analyse et décide :
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Mesures à prendre (transfert à un autre service, enquête complémentaire...)</li>
                <li>Clôture de l&apos;alerte avec rapport final</li>
              </ul>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-3">
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Important</span>
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Une alerte ne peut pas être clôturée par une seule personne - une double validation (Analyste + Responsable) est obligatoire.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}