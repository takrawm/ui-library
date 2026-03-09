import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type {
  FinancialModelTableProps,
  FinancialRow,
} from "./types";

/**
 * 数値をカンマ区切りの整数文字列にフォーマットする
 */
function formatNumber(value: number): string {
  return value.toLocaleString("ja-JP", {
    maximumFractionDigits: 0,
  });
}

/**
 * 数値をパーセンテージ文字列（小数点1桁）にフォーマットする
 */
function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * FinancialRow のフォーマットに応じて値を文字列に変換する
 */
function formatValue(value: number | null, format: FinancialRow["format"]): string {
  if (value === null) return "";
  return format === "percent" ? formatPercent(value) : formatNumber(value);
}

/**
 * 財務モデルの1行をレンダリングする内部コンポーネント
 */
function FinancialModelRow({
  row,
  periodCount,
}: {
  row: FinancialRow;
  periodCount: number;
}) {
  const isPrimary = row.variant === "primary";

  return (
    <TableRow className={cn(isPrimary && "border-b-0")}>
      <TableCell
        className={cn(
          "whitespace-nowrap py-1 pr-6",
          isPrimary
            ? "font-bold text-emerald-700 dark:text-emerald-400"
            : "pl-6 text-muted-foreground"
        )}
      >
        {row.label}
      </TableCell>
      {Array.from({ length: periodCount }, (_, i) => {
        const value = row.values[i] ?? null;
        return (
          <TableCell
            key={i}
            className={cn(
              "whitespace-nowrap py-1 text-right tabular-nums",
              isPrimary && "font-semibold"
            )}
          >
            {formatValue(value, row.format)}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

/**
 * DCF 前提財務モデルなどの財務テーブルを表示するコンポーネント。
 *
 * 期間グループ（実績/予想）ごとにヘッダーをまとめ、
 * 行データを primary（主指標）/ secondary（補助指標）の variant で階層的に表示する。
 *
 * @example
 * ```tsx
 * <FinancialModelTable
 *   title="DCF前提財務モデル"
 *   unit="百万円"
 *   periodGroups={periodGroups}
 *   rows={rows}
 * />
 * ```
 */
export function FinancialModelTable({
  title,
  unit,
  periodGroups,
  rows,
  className,
}: FinancialModelTableProps) {
  const totalPeriods = periodGroups.reduce(
    (sum, group) => sum + group.periods.length,
    0
  );

  return (
    <Table className={cn("border-collapse", className)}>
      {title && (
        <caption className="caption-top mb-2 text-left text-base font-bold text-foreground">
          {title}
        </caption>
      )}
      <TableHeader>
        {/* 第1行: グループヘッダー + 単位 */}
        <TableRow className="border-b-0 hover:bg-transparent">
          <TableHead className="h-8 py-1 text-xs text-muted-foreground">
            {unit ?? ""}
          </TableHead>
          {periodGroups.map((group) => (
            <TableHead
              key={group.label}
              colSpan={group.periods.length}
              className="h-8 border-b py-1 text-center text-xs font-medium"
            >
              {group.label}
            </TableHead>
          ))}
        </TableRow>
        {/* 第2行: 個別期間ラベル */}
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-8 py-1" />
          {periodGroups.flatMap((group) =>
            group.periods.map((period) => (
              <TableHead
                key={period.label}
                className="h-8 py-1 text-right text-xs font-medium"
              >
                {period.label}
              </TableHead>
            ))
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <FinancialModelRow
            key={`${row.label}-${index}`}
            row={row}
            periodCount={totalPeriods}
          />
        ))}
      </TableBody>
    </Table>
  );
}
