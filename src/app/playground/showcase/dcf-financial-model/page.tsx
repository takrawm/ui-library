import { FinancialModelTable } from "@/components/FinancialModelTable";
import type { PeriodGroup, FinancialRow } from "@/components/FinancialModelTable";

/**
 * デモ: DCF前提財務モデル
 *
 * 使用コンポーネント: FinancialModelTable, Table, TableHeader, TableBody, TableRow, TableHead, TableCell
 * 作成日: 2026-03-08
 */

const periodGroups: PeriodGroup[] = [
  { label: "前々期", periods: [{ label: "FY-2" }] },
  { label: "前期", periods: [{ label: "FY-1" }] },
  { label: "今期", periods: [{ label: "FY0" }] },
  {
    label: "予想値",
    periods: [
      { label: "FY+1" },
      { label: "FY+2" },
      { label: "FY+3" },
      { label: "FY+4" },
      { label: "FY+5" },
      { label: "Terminal Yr" },
    ],
  },
];

const rows: FinancialRow[] = [
  {
    label: "売上高",
    variant: "primary",
    format: "number",
    values: [2_481_109, 2_550_305, 2_493_386, 2_742_725, 3_016_997, 3_318_697, 3_650_566, 4_015_623, 4_015_623],
  },
  {
    label: "前年比成長率",
    variant: "secondary",
    format: "percent",
    values: [null, 2.8, -2.2, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0],
  },
  {
    label: "EBITDA",
    variant: "primary",
    format: "number",
    values: [375_569, 393_998, 372_216, 411_409, 452_550, 497_805, 547_585, 602_343, 602_343],
  },
  {
    label: "前年比成長率",
    variant: "secondary",
    format: "percent",
    values: [null, 4.9, -5.5, 10.5, 10.0, 10.0, 10.0, 10.0, null],
  },
  {
    label: "EBITDA利益率",
    variant: "secondary",
    format: "percent",
    values: [15.1, 15.4, 14.9, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0],
  },
  {
    label: "営業利益",
    variant: "primary",
    format: "number",
    values: [276_254, 265_513, 238_623, 301_700, 331_870, 365_057, 401_562, 441_719, 441_719],
  },
  {
    label: "前年比成長率",
    variant: "secondary",
    format: "percent",
    values: [null, -3.9, -10.1, 26.4, 10.0, 10.0, 10.0, 10.0, null],
  },
  {
    label: "営業利益率",
    variant: "secondary",
    format: "percent",
    values: [11.1, 10.4, 9.6, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0],
  },
  {
    label: "NOPAT=営業利益 x (1-税率)",
    variant: "primary",
    format: "number",
    values: [196_417, 183_735, 162_741, 205_759, 226_335, 248_969, 273_865, 301_252, 301_252],
  },
  {
    label: "前年比成長率",
    variant: "secondary",
    format: "percent",
    values: [null, -6.5, -11.4, 26.4, 10.0, 10.0, 10.0, 10.0, null],
  },
  {
    label: "実質実効税率",
    variant: "secondary",
    format: "percent",
    values: [28.9, 30.8, 31.8, 31.8, 31.8, 31.8, 31.8, 31.8, 31.8],
  },
];

export default function DcfFinancialModelPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">DCF前提財務モデル</h2>
        <p className="text-muted-foreground">
          DCF法に基づく財務モデルの前提条件を表形式で表示
        </p>
      </div>

      <div className="overflow-x-auto">
        <FinancialModelTable
          title="DCF前提財務モデル"
          unit="百万円"
          periodGroups={periodGroups}
          rows={rows}
        />
      </div>
    </div>
  );
}
