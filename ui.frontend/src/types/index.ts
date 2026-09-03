export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
  children?: NavigationItem[];
}

export interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

export interface AppState {
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  isSearchOpen: boolean;
  navigationItems: NavigationItem[];
}

export interface HeaderConfig {
  logo?: string;
  logoAlt?: string;
  navigation: NavigationItem[];
}

export interface FooterConfig {
  companyName?: string;
  links?: NavigationItem[];
  socialLinks?: Array<{ icon: string; href: string; label: string }>;
  copyright?: string;
}
