"use client";

import { PropertyHistoryEntry } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, Banknote } from "lucide-react";

interface PropertyHistoryProps {
  history: PropertyHistoryEntry[];
}

export function PropertyHistory({ history }: PropertyHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {entry.amount ? <Banknote className="h-4 w-4" /> : <History className="h-4 w-4" />}
                {entry.type}
              </div>
            </TableCell>
            <TableCell>{entry.description}</TableCell>
            <TableCell>
              {entry.amount ? formatCurrency(entry.amount) : "-"}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusColor(entry.status)}>
                {entry.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}