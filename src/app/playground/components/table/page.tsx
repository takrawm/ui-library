"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Invoice {
  id: string;
  status: string;
  method: string;
  amount: string;
}

const invoices: Invoice[] = [
  { id: "INV001", status: "支払い済み", method: "クレジットカード", amount: "¥25,000" },
  { id: "INV002", status: "保留中", method: "銀行振込", amount: "¥15,000" },
  { id: "INV003", status: "未払い", method: "クレジットカード", amount: "¥35,000" },
  { id: "INV004", status: "支払い済み", method: "PayPal", amount: "¥45,000" },
  { id: "INV005", status: "支払い済み", method: "銀行振込", amount: "¥55,000" },
];

/**
 * ショーケース: Table
 *
 * shadcn/ui Table コンポーネントの全バリエーションを表示。
 * TableHeader, TableBody, TableRow, TableCell, TableCaption の組み合わせを確認できる。
 */
export default function TableShowcasePage() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Table</h2>

      <section>
        <h3 className="mb-4 text-lg font-semibold">基本テーブル</h3>
        <Table>
          <TableCaption>最近の請求書一覧</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">請求書ID</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>支払い方法</TableHead>
              <TableHead className="text-right">金額</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>{invoice.method}</TableCell>
                <TableCell className="text-right">{invoice.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
