"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Search,
  Settings,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import type { BreadcrumbItem, ListItem, NavItem } from "./types";

export interface GlobalHeaderBarProps {
  /** 戻るボタンのクリックハンドラ */
  onBack?: () => void;
  /** 進むボタンのクリックハンドラ */
  onForward?: () => void;
  /** 検索バーのプレースホルダー */
  searchPlaceholder?: string;
  /** 検索のキーボードショートカット表示（例: "⌘K"） */
  searchShortcut?: string;
  /** 組織名 */
  organizationName?: string;
  /** ログインユーザー名 */
  userName?: string;
  /** ウィンドウ操作ボタンを表示するか（Electron等） */
  showWindowControls?: boolean;
}

export interface NavigationBarProps {
  items: NavItem[];
  onItemClick?: (id: string) => void;
  onAddClick?: () => void;
}

export interface ListPaneProps {
  title: string;
  filterTabs?: { value: string; label: string }[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
  items: ListItem[];
  selectedId?: string;
  onItemSelect?: (id: string) => void;
  onSearchClick?: () => void;
}

export interface DetailPaneProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  authorAvatar?: string;
  authorName?: string;
  authorTimestamp?: string;
  content?: React.ReactNode;
  inputPlaceholder?: string;
  onInputSubmit?: (value: string) => void;
}

export interface ThreeColumnLayoutProps {
  globalHeader?: GlobalHeaderBarProps;
  navigationBar?: NavigationBarProps;
  listPane?: ListPaneProps;
  detailPane?: DetailPaneProps;
  /** カスタムのグローバルヘッダー */
  globalHeaderContent?: React.ReactNode;
  /** カスタムのナビゲーションバー */
  navigationBarContent?: React.ReactNode;
  /** カスタムのリストペイン */
  listPaneContent?: React.ReactNode;
  /** カスタムの詳細ペイン */
  detailPaneContent?: React.ReactNode;
}

/**
 * グローバルヘッダーバー
 * 画面最上部を横断する水平バー。戻る/進む、検索、設定、組織名、ユーザー名、ウィンドウ操作を配置。
 */
function GlobalHeaderBar({
  onBack,
  onForward,
  searchPlaceholder = "検索...",
  searchShortcut = "⌘K",
  organizationName = "組織名",
  userName = "ユーザー名",
  showWindowControls = false,
}: GlobalHeaderBarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b bg-background px-4">
      {/* 左: ナビゲーション矢印 */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onBack}
          aria-label="戻る"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onForward}
          aria-label="進む"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 中央: グローバル検索バー */}
      <div className="flex flex-1 max-w-xl mx-auto">
        <div className="relative flex w-full items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="pl-9 pr-20 h-9 bg-muted/50"
          />
          <kbd className="absolute right-3 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            {searchShortcut}
          </kbd>
        </div>
      </div>

      {/* 右: 設定、組織、ユーザー、ウィンドウ操作 */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="設定">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>設定</DropdownMenuItem>
            <DropdownMenuItem>テーマ</DropdownMenuItem>
            <DropdownMenuItem>ヘルプ</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="hidden md:inline text-sm text-muted-foreground">
          {organizationName}
        </span>
        <span className="hidden md:inline text-sm font-medium">{userName}</span>
        {showWindowControls && (
          <div className="flex items-center ml-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="最小化">
              <Minimize2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="最大化">
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="閉じる">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * グローバルナビゲーションバー
 * 画面左端に固定された縦長の細いバー。アイコン＋ラベル、通知バッジ、追加ボタン。
 */
function NavigationBar({
  items,
  onItemClick,
  onAddClick,
}: NavigationBarProps) {
  return (
    <nav className="flex w-16 shrink-0 flex-col items-center gap-1 border-r bg-background py-4">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onItemClick?.(item.id)}
          className={cn(
            "relative flex flex-col items-center gap-0.5 rounded-lg px-2 py-2 transition-colors hover:bg-accent",
            item.active
              ? "text-primary bg-accent"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={item.label}
          aria-current={item.active ? "true" : undefined}
        >
          <span className="relative">
            {item.icon}
            {item.badge !== undefined && item.badge !== false && (
              <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                {typeof item.badge === "number" && item.badge > 0 ? item.badge : null}
              </span>
            )}
          </span>
          <span className="text-[10px] font-medium leading-tight">{item.label}</span>
        </button>
      ))}
      <div className="mt-auto pt-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={onAddClick}
          aria-label="追加"
        >
          <span className="text-lg font-light">+</span>
        </Button>
      </div>
    </nav>
  );
}

/**
 * リストペイン
 * 一覧表示エリア。ヘッダー、フィルタータブ、カード形式のリスト。
 */
function ListPane({
  title,
  filterTabs = [
    { value: "all", label: "すべて" },
    { value: "unread", label: "未読" },
    { value: "starred", label: "スター" },
  ],
  activeFilter = "all",
  onFilterChange,
  items,
  selectedId,
  onItemSelect,
  onSearchClick,
}: ListPaneProps) {
  return (
    <div className="flex w-1/4 min-w-64 max-w-sm flex-col border-r bg-background">
      {/* ヘッダー */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <h2 className="font-semibold">{title}</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onSearchClick}
            aria-label="検索"
          >
            <Search className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="オプション">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>フィルターを編集</DropdownMenuItem>
              <DropdownMenuItem>表示をカスタマイズ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* フィルタータブ */}
      <div className="shrink-0 px-4 pt-2 pb-3">
        <Tabs value={activeFilter} onValueChange={onFilterChange}>
          <TabsList className="h-8 w-full justify-start rounded-lg bg-muted/50 p-0">
            {filterTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 rounded-md px-3 text-xs data-[state=active]:bg-background"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* リスト */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-0 p-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemSelect?.(item.id)}
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent/50",
                item.selected || selectedId === item.id
                  ? "bg-accent/80 border-l-4 border-l-primary"
                  : "border-l-4 border-l-transparent"
              )}
            >
              <div className="relative shrink-0">
                <Avatar className="h-10 w-10">
                  {item.avatarSrc ? (
                    <AvatarImage src={item.avatarSrc} alt="" />
                  ) : null}
                  <AvatarFallback className="text-xs">
                    {item.avatarFallback}
                  </AvatarFallback>
                </Avatar>
                {item.actionBadge && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {item.actionBadge}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.primaryText}</p>
                {item.secondaryText && (
                  <p className="truncate text-xs text-muted-foreground">
                    {item.secondaryText}
                  </p>
                )}
                {item.tertiaryText && (
                  <p className="truncate text-xs text-muted-foreground/80">
                    {item.tertiaryText}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {item.timestamp}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

/**
 * 詳細ペイン
 * コンテンツ表示エリア。ヘッダー、本文、フッター入力欄。
 */
function DetailPane({
  title,
  breadcrumbs = [],
  authorAvatar,
  authorName,
  authorTimestamp,
  content,
  inputPlaceholder = "メッセージを入力...",
  onInputSubmit,
}: DetailPaneProps) {
  return (
    <div className="flex flex-1 flex-col min-w-0 bg-muted/30">
      {/* ヘッダー */}
      <div className="flex shrink-0 flex-col gap-0.5 border-b bg-background px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-bold">{title}</h1>
            {breadcrumbs.length > 0 && (
              <nav className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                {breadcrumbs.map((b, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <ChevronDown className="h-3 w-3 rotate-[-90deg]" />}
                    {b.href ? (
                      <a href={b.href} className="hover:underline">
                        {b.label}
                      </a>
                    ) : (
                      <span>{b.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="検索">
              <Search className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="オプション">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>共有</DropdownMenuItem>
                <DropdownMenuItem>印刷</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* コンテンツ本文 */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-4">
          {(authorAvatar || authorName || authorTimestamp) && (
            <div className="mb-4 flex items-center gap-3">
              {authorAvatar && (
                <Avatar className="h-9 w-9">
                  <AvatarImage src={authorAvatar} alt="" />
                  <AvatarFallback>{authorName?.slice(0, 2) ?? "?"}</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col">
                {authorName && (
                  <span className="text-sm font-medium">{authorName}</span>
                )}
                {authorTimestamp && (
                  <span className="text-xs text-muted-foreground">
                    {authorTimestamp}
                  </span>
                )}
              </div>
            </div>
          )}
          {content && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {content}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* フッター: 入力エリア */}
      <div className="shrink-0 border-t bg-background p-4">
        <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
          <Input
            placeholder={inputPlaceholder}
            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value;
                if (value.trim()) {
                  onInputSubmit?.(value);
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="書式">
              <span className="text-sm font-bold">B</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="絵文字">
              <span className="text-sm">😀</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="添付">
              <span className="text-sm">📎</span>
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8" aria-label="送信">
              <span className="text-sm">→</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 3カラムレイアウト
 *
 * ナビゲーション → 一覧 → 詳細 の階層構造を1画面で表現するレイアウト。
 * グローバルヘッダーバー、ナビゲーションバー、リストペイン、詳細ペインで構成。
 */
export function ThreeColumnLayout({
  globalHeader,
  navigationBar,
  listPane,
  detailPane,
  globalHeaderContent,
  navigationBarContent,
  listPaneContent,
  detailPaneContent,
}: ThreeColumnLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      {/* グローバルヘッダーバー */}
      {globalHeaderContent ?? (globalHeader && <GlobalHeaderBar {...globalHeader} />)}

      {/* 3カラム本体 */}
      <div className="flex flex-1 min-h-0">
        {/* ナビゲーションバー */}
        {navigationBarContent ?? (
          navigationBar && <NavigationBar {...navigationBar} />
        )}

        {/* リストペイン */}
        {listPaneContent ?? (listPane && <ListPane {...listPane} />)}

        {/* 詳細ペイン */}
        {detailPaneContent ?? (detailPane && <DetailPane {...detailPane} />)}
      </div>
    </div>
  );
}
