"use client";

import { PropertyEvent } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Cloud } from "lucide-react";

interface WeatherEventsProps {
  events: PropertyEvent[];
}

export function WeatherEvents({ events }: WeatherEventsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
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
          <TableHead>Severity</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                {event.type}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getSeverityColor(event.severity)}>
                {event.severity}
              </Badge>
            </TableCell>
            <TableCell>{event.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}