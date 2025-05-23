import { NavItems } from "@/type";


export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const categories = [
  {
    title: "Corruption ou avantage indu",
    value: "corruption",
    description:
      "Actes visant à influencer une décision, un traitement ou une situation professionnelle en échange d’un bénéfice personnel.",
    icon: "🔒",
    exemple: [
      "Versement d’un avantage pour faciliter une attribution.",
      "Intervention pour favoriser un tiers.",
    ],
  },
  {
    title: "Blanchiment d’argent et financement du terrorisme",
    value: "blanchiment",
    description:
      "Tout montage, opération ou dissimulation ayant pour but de légitimer des fonds d’origine illicite ou de soutenir une activité criminelle.",
    icon: "💵​",
    exemple: [
      "Transfert de fonds via des entités intermédiaires.",
      "Montage destiné à masquer l’origine de capitaux.",
    ],
  },
  {
    title: "Discrimination, harcèlement ou comportement déplacé",
    value: "discrimination",
    description:
      "Tout propos ou comportement portant atteinte au respect, à l’inclusion ou à la dignité d’une personne.",
    icon: "🚫",
    exemple: [
      "Remarques à connotation sexiste ou raciste.",
      "Isolement d’un collaborateur, pressions répétées.",
    ],
  },
  {
    title: "Utilisation non autorisée des ressources",
    value: "abus",
    description:
      "Emploi de biens, budgets, outils ou compétences de l’organisation à des fins personnelles ou sans lien avec l’activité professionnelle.",
    icon: "⚖️",
    exemple: [
      "Usage privé d’un véhicule de service.",
      "Mobilisation de personnel pour un projet personnel.",
    ],
  },
  {
    title: "Abus de marché",
    value: "manipulation",
    description:
      "Comportements visant à fausser les règles normales de concurrence ou de fonctionnement des marchés.",
    icon: "📉",
    exemple: [
      "Diffusion d’informations inexactes.",
      "Manipulation de prix ou de volumes.",
    ],
  },
  {
    title: "Fraude",
    value: "fraude",
    description:
      "Actes intentionnels visant à tromper, détourner ou obtenir un avantage indu, en violation des règles internes ou légales.",
    icon: "💰",
    exemple: [
      "Fraude fiscale.",
      "Falsification de documents, escroquerie, fraude identitaire.",
    ],
  },
  {
    title: "Conflit d’intérêt",
    value: "conflit",
    description:
      "Situation dans laquelle un collaborateur a un intérêt personnel susceptible d’influencer ses décisions professionnelles.",
    icon: "⚠️",
    exemple: [
      "Participer à un appel d’offres impliquant un proche.",
      "Traiter un dossier où l’on a un intérêt personnel direct ou indirect.",
    ],
  },
  {
    title: "Protection des données et vie privée",
    value: "donnees",
    description:
      "Manquement aux obligations légales ou internes en matière de traitement des données à caractère personnel ou de confidentialité.",
    icon: "🔐",
    exemple: [
      "Accès non autorisé à des données sensibles.",
      "Conservation illégale de fichiers, absence de consentement pour un traitement.",
    ],
  },
  {
    title: "Non-respect des règles sociales ou environnementales",
    value: "environnement",
    description:
      "Actions contraires aux engagements de l’organisation en matière d’éthique sociale, de conditions de travail ou de respect de l’environnement.",
    icon: "🌍",
    exemple: [
      "Pollution non déclarée.",
      "Exposition à des risques sans protection adéquate, non-respect des normes de sécurité.",
    ],
  },
  {
    title: "Autres signalements graves ou irréguliers",
    value: "autre",
    description:
      "Faits préoccupants n’entrant pas dans les catégories précédentes, mais susceptibles de porter atteinte à l’éthique ou à la légalité.",
    icon: "🛑",
    exemple: [],
  },
];

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItems[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
