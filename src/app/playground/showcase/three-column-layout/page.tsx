"use client";

import {
  Bell,
  Bookmark,
  FileText,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

import { ThreeColumnLayout } from "@/components/ThreeColumnLayout";
import type { ListItem, NavItem } from "@/components/ThreeColumnLayout";

const navItems: NavItem[] = [
  { id: "inbox", label: "受信", icon: <Mail className="h-5 w-5" />, active: true, badge: 3 },
  { id: "mentions", label: "メンション", icon: <MessageSquare className="h-5 w-5" />, badge: true },
  { id: "saved", label: "保存", icon: <Bookmark className="h-5 w-5" /> },
  { id: "notifications", label: "通知", icon: <Bell className="h-5 w-5" />, badge: 1 },
  { id: "drafts", label: "下書き", icon: <FileText className="h-5 w-5" /> },
];

const sampleListItems: ListItem[] = [
  {
    id: "1",
    avatarFallback: "山田",
    primaryText: "山田太郎 が プロジェクトA にコメントしました",
    secondaryText: "進捗報告の件、確認しました。来週のミーティングで...",
    timestamp: "10:30",
    selected: true,
  },
  {
    id: "2",
    avatarSrc: "https://github.com/shadcn.png",
    avatarFallback: "CN",
    primaryText: "佐藤花子 が タスクを完了しました",
    secondaryText: "デザインレビュー対応",
    tertiaryText: "フィードバックを反映済み",
    timestamp: "09:15",
  },
  {
    id: "3",
    avatarFallback: "田中",
    primaryText: "田中一郎 が あなたをメンションしました",
    secondaryText: "@あなた この部分の確認をお願いします",
    timestamp: "昨日",
    actionBadge: <MessageSquare className="h-2.5 w-2.5" />,
  },
  {
    id: "4",
    avatarFallback: "鈴木",
    primaryText: "鈴木次郎 が 新しいファイルを追加しました",
    secondaryText: "requirements-v2.pdf",
    timestamp: "3/7",
  },
];

const sampleContent = (
  <>
    <h2 className="mt-4 text-base font-semibold">進捗報告について</h2>
    <p className="mt-2 text-sm text-muted-foreground">
      先日のミーティングでご共有いただいた内容を確認しました。
      来週のレビュー会議までに、以下の点を対応予定です。
    </p>
    <ul className="mt-2 list-disc pl-6 text-sm space-y-1">
      <li>デザインシステムの更新</li>
      <li>コンポーネントライブラリの整備</li>
      <li>
        <strong>アクセシビリティ</strong>の検証
      </li>
    </ul>
    <p className="mt-2 text-sm">
      ご確認のほどよろしくお願いいたします。
      <a href="#" className="ml-1 text-primary underline hover:no-underline">
        #123
      </a>
    </p>
    <p className="mt-2 text-sm">🙏 📋 ✨</p>
  </>
);

/**
 * デモ: 3カラムレイアウト
 *
 * 使用コンポーネント: ThreeColumnLayout, Button, Input, Avatar, Badge, Card,
 * DropdownMenu, ScrollArea, Tabs
 * 作成日: 2026-03-08
 */
export default function ThreeColumnLayoutDemo() {
  const [activeNav, setActiveNav] = useState("inbox");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("1");

  const navItemsWithActive = navItems.map((item) => ({
    ...item,
    active: item.id === activeNav,
  }));

  const listItemsWithSelected = sampleListItems.map((item) => ({
    ...item,
    selected: item.id === selectedId,
  }));

  const selectedItem = sampleListItems.find((i) => i.id === selectedId);

  return (
    <div className="h-[800px] overflow-hidden rounded-lg border">
      <ThreeColumnLayout
        globalHeader={{
          searchPlaceholder: "検索...",
          searchShortcut: "⌘K",
          organizationName: "サンプル組織",
          userName: "デモユーザー",
          showWindowControls: false,
        }}
        navigationBar={{
          items: navItemsWithActive,
          onItemClick: setActiveNav,
        }}
        listPane={{
          title: "アクティビティ",
          filterTabs: [
            { value: "all", label: "すべて" },
            { value: "unread", label: "未読" },
            { value: "mentions", label: "メンション" },
          ],
          activeFilter,
          onFilterChange: setActiveFilter,
          items: listItemsWithSelected,
          selectedId,
          onItemSelect: setSelectedId,
        }}
        detailPane={{
          title: selectedItem?.primaryText ?? "選択された項目",
          breadcrumbs: [
            { label: "プロジェクトA" },
            { label: "ディスカッション" },
            { label: "進捗報告" },
          ],
          authorName: "山田太郎",
          authorTimestamp: "2026年3月8日 10:30",
          content: sampleContent,
          inputPlaceholder: "返信を入力...",
        }}
      />
    </div>
  );
}
