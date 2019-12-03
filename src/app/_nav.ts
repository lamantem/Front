interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navItems: NavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Criar Questões',
    url: '/criar',
    icon: 'icon-pencil',
    attributes: { },
  },
  {
    name: 'Gerar Provas',
    url: '/gerar',
    icon: 'icon-docs',
    attributes: {  },
  },
  {
    name: 'Avaliador',
    url: '/avaliar',
    icon: 'icon-drawer',
    attributes: { },
  },
  {
    name: 'Administração',
    url: '/administrar',
    icon: 'icon-wrench',
    attributes: { },
  }
];

