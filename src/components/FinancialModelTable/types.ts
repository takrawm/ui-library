/** 期間ラベル（"FY-2", "FY+1" など） */
export type Period = {
  label: string;
};

/** 期間グループ（ヘッダーの「前々期」「前期」「予想値」などのまとまり） */
export type PeriodGroup = {
  label: string;
  periods: Period[];
};

/** 財務指標の行 */
export type FinancialRow = {
  /** 行ラベル（"売上高", "前年比成長率" など） */
  label: string;
  /**
   * primary: 太字・色付きラベル（売上高, EBITDA, 営業利益など主指標）
   * secondary: 通常・インデント（成長率, 利益率などの補助指標）
   */
  variant: "primary" | "secondary";
  /**
   * number: カンマ区切り整数表示
   * percent: 小数点1桁+%表示
   */
  format: "number" | "percent";
  /** 各期間の値。null は表示なし */
  values: (number | null)[];
};

export type FinancialModelTableProps = {
  /** テーブルのタイトル（例: "DCF前提財務モデル"） */
  title?: string;
  /** 単位表示（例: "百万円"） */
  unit?: string;
  /** 期間グループ定義 */
  periodGroups: PeriodGroup[];
  /** 行データの配列 */
  rows: FinancialRow[];
  /** 追加のCSSクラス */
  className?: string;
};
