export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface SearchQuery {
  term: string;
  results: SearchResult[];
  loading: boolean;
  error?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  image?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  url: string;
  addedAt: number;
}

export interface Wishlist {
  items: WishlistItem[];
  count: number;
}

export interface AppState {
  cart: Cart;
  search: SearchQuery;
  wishlist: Wishlist;
  mobileMenuOpen: boolean;
  mobileSearchOpen: boolean;
}

export interface StateListener {
  (state: AppState): void;
}

export interface NavigationItem {
  label: string;
  url: string;
  active?: boolean;
  children?: NavigationItem[];
}

export interface HeaderData {
  logo?: string;
  navigation?: NavigationItem[];
  maxMobileWidth?: number;
}

export interface FooterData {
  columns?: FooterColumn[];
  copyright?: string;
  socialLinks?: SocialLink[];
}

export interface FooterColumn {
  title: string;
  links: Link[];
}

export interface Link {
  label: string;
  url: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon?: string;
}

export interface AccessibilityConfig {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
}
