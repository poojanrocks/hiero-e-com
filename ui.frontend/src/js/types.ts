export interface NavigationItem {
  label: string;
  url: string;
  active?: boolean;
  children?: NavigationItem[];
}

export interface HeaderConfig {
  logoUrl?: string;
  logoAlt?: string;
  navigationItems?: NavigationItem[];
  searchEnabled?: boolean;
  cartEnabled?: boolean;
  wishlistEnabled?: boolean;
}

export interface FooterConfig {
  companyName?: string;
  copyrightYear?: number;
  navigationGroups?: {
    title: string;
    items: NavigationItem[];
  }[];
  socialLinks?: {
    label: string;
    url: string;
    icon?: string;
  }[];
}

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface SearchQuery {
  term: string;
  filters?: Record<string, string[]>;
}

export interface UIState {
  status: 'idle' | 'loading' | 'error' | 'empty';
  error?: string;
  data?: unknown;
}