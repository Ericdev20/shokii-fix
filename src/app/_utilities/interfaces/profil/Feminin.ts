export interface Feminin {
  name: string | undefined | null;
  prenom: string | undefined | null;
  email: string | undefined | null;
  date_naissance: string | undefined | null;
  status_id: string | undefined | null;
  pseudo: any;
  password: any;
  photoProfil: File | null;
  phone_number: string | undefined | null;
  whatsapp_number: any | undefined | null;
  whatsapp_allowed: any | undefined | null;
  localisation: string | undefined | null;
  role_id: string | undefined | null;
  description: string | undefined | null;
  poids: string | undefined | null;
  taille: string | undefined | null;
  corpulence: string | undefined | null;
  cheveux: string | undefined | null;
  teint: string | undefined | null;
  verify_profil: number | undefined | null;
  account_type: string | undefined | null;
  parrain: string | undefined | null;
}
