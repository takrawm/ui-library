/**
 * 3カラムレイアウトの型定義
 */

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number | boolean;
}

export interface ListItem {
  id: string;
  avatarSrc?: string;
  avatarFallback: string;
  actionBadge?: React.ReactNode;
  primaryText: string;
  secondaryText?: string;
  tertiaryText?: string;
  timestamp: string;
  selected?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
