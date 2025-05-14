/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { valideCon } from "@/actions/responsable-function";
import { useRouter } from "next/navigation";
interface ValidateButtonProps {
  con: any; // or a specific type
  al: any; // or a specific type
}
const ValidateButton = ({ con, al }: ValidateButtonProps) => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const validerConclusion = async () => {
    if (!session) {
      toast.error("Vous devez être connecté pour cette action");
      return;
    }

    if (!al.conlusions || al.conlusions.length === 0) {
      toast.error("Aucune conclusion trouvée");
      return;
    }

    try {
      // Get the most recent conclusion by creation date
      const latestConclusion = al.conlusions.reduce(
        (prev: any, current: any) => {
          return new Date(prev.createdAt) > new Date(current.createdAt)
            ? prev
            : current;
        }
      );

      if (!latestConclusion.content) {
        toast.error("La conclusion la plus récente n'a pas de contenu");
        return;
      }

      const ocp = await valideCon(
        con.id,
        session.user.id,
        al.id,
        al.analysteValidation,
        latestConclusion.content // Send the conclusion content
      );

      if (ocp) {
        toast.success("Alerte validée avec succès!");
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de la validation de l'alerte:", error);
      toast.error("Erreur lors de la validation de l'alerte");
    }
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="gap-2 bg-blue-600 hover:bg-blue-800"
          >
            <CheckCircle2 className="h-4 w-4 " />
            Valider
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la validation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir valider ces alertes? Cette action enverra
              les alertes au responsable final.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-800"
              onClick={() => {
                // Add your validation logic here
                validerConclusion();
                setOpen(false);
              }}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ValidateButton;
