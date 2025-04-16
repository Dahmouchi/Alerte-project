/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { KeyRound, LockKeyhole, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { changeAdminPassword } from "@/actions/user";

const ResetPassword =  (id: any)=> {
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    ancien: false,
    nouvelle: false,
    cofirmer: false
  });
  const [formData, setFormData] = useState({
    ancien: "",
    nouvelle: "",
    cofirmer: "",
  });

  const reset = () => {
    setFormData({
      ancien: "",
      nouvelle: "",
      cofirmer: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ancien || !formData.nouvelle || !formData.cofirmer) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (formData.nouvelle !== formData.cofirmer) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (formData.nouvelle.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setLoading(true);
    try {
      const result = await changeAdminPassword(
        id.id,
        formData.ancien,
        formData.nouvelle,
        formData.cofirmer
      );
      toast.success(result);
      reset();
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message || "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        Modifier le mot de passe
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-5">
          {/* Ancien mot de passe */}
          <div className="relative">
            <label htmlFor="ancien" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ancien mot de passe
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">
                <LockKeyhole className="w-5 h-5" />
              </span>
              <input
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2.5 pl-10 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                type={showPasswords.ancien ? "text" : "password"}
                onChange={handleChange}
                value={formData.ancien}
                name="ancien"
                id="ancien"
                placeholder="Entrez votre ancien mot de passe"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => togglePasswordVisibility('ancien')}
              >
                {showPasswords.ancien ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div className="relative">
            <label htmlFor="nouvelle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">
                <KeyRound className="w-5 h-5" />
              </span>
              <input
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2.5 pl-10 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                type={showPasswords.nouvelle ? "text" : "password"}
                onChange={handleChange}
                value={formData.nouvelle}
                name="nouvelle"
                id="nouvelle"
                placeholder="Entrez votre nouveau mot de passe"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => togglePasswordVisibility('nouvelle')}
              >
                {showPasswords.nouvelle ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Le mot de passe doit contenir au moins 8 caractères.
            </p>
          </div>

          {/* Confirmer mot de passe */}
          <div className="relative">
            <label htmlFor="cofirmer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <input
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2.5 pl-10 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                type={showPasswords.cofirmer ? "text" : "password"}
                onChange={handleChange}
                value={formData.cofirmer}
                name="cofirmer"
                id="cofirmer"
                placeholder="Confirmez votre nouveau mot de passe"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => togglePasswordVisibility('cofirmer')}
              >
                {showPasswords.cofirmer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                En cours...
              </>
            ) : (
              "Modifier le mot de passe"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;