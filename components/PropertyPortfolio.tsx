"use client";

import { useState } from "react";
import { Building2, Home, MoreVertical, AlertTriangle, Search, ArrowUpDown, Plus, TrendingUp, Users, DollarSign, Percent } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { properties } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { DataTablePagination } from "./ui/data-table-pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Property } from "@/lib/types";
import { AddPropertyModal } from "./AddPropertyModal";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SortConfig = {
  key: keyof Property | null;
  direction: 'asc' | 'desc';
};

const PropertyIcon = ({ type }: { type: string }) => {
  return type === "apartment" ? (
    <Building2 className="h-8 w-8 text-muted-foreground" />
  ) : (
    <Home className="h-8 w-8 text-muted-foreground" />
  );
};

const StatCard = ({ title, value, icon: Icon, trend }: { title: string; value: string; icon: any; trend?: number }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <p className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function PropertyPortfolio() {
  const router = useRouter();
  const { toast } = useToast();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");

  const getInsuranceStatus = (daysLeft: number) => {
    if (daysLeft <= 14) {
      return { color: "text-destructive", message: "Critical: Insurance expires soon!" };
    }
    if (daysLeft <= 30) {
      return { color: "text-yellow-500 dark:text-yellow-400", message: "Warning: Insurance expiring" };
    }
    return { color: "text-muted-foreground", message: `${daysLeft} days left` };
  };

  const handleSort = (key: keyof Property) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAddProperty = (propertyData: any) => {
    console.log('Adding property:', propertyData);
    toast({
      title: "Success",
      description: "Property has been added successfully.",
    });
  };

  const filteredProperties = properties.filter(property => {
    if (selectedTab !== "all" && property.type !== selectedTab) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      property.address.toLowerCase().includes(searchLower) ||
      property.location.toLowerCase().includes(searchLower) ||
      property.type.toLowerCase().includes(searchLower) ||
      property.units.toString().includes(searchLower) ||
      property.occupancy.toLowerCase().includes(searchLower)
    );
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }

    return 0;
  });

  const paginatedProperties = sortedProperties.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const totalUnits = properties.reduce((sum, prop) => sum + prop.units, 0);
  const totalRevenue = properties.reduce((sum, prop) => sum + prop.marketValue * 0.008, 0); // Estimated monthly revenue
  const occupancyRate = properties.reduce((sum, prop) => {
    return sum + (parseInt(prop.occupancy.replace('%', '')) / properties.length);
  }, 0);
  const totalValue = properties.reduce((sum, prop) => sum + prop.marketValue, 0);

  const SortableHeader = ({ column, label }: { column: keyof Property, label: string }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(column)}
      className="h-8 flex items-center gap-1 font-semibold"
    >
      {label}
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Property Dashboard</h1>
            <p className="text-muted-foreground">Here's your property portfolio analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Properties"
            value={properties.length.toString()}
            icon={Building2}
            trend={2.5}
          />
          <StatCard
            title="Total Units"
            value={totalUnits.toString()}
            icon={Users}
            trend={1.2}
          />
          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            trend={3.8}
          />
          <StatCard
            title="Occupancy Rate"
            value={`${Math.round(occupancyRate)}%`}
            icon={Percent}
            trend={0.5}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="all">All Properties</TabsTrigger>
                <TabsTrigger value="house">Houses</TabsTrigger>
                <TabsTrigger value="apartment">Apartments</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <SortableHeader column="address" label="Property" />
                  </TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">
                    <SortableHeader column="units" label="Units" />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortableHeader column="occupancy" label="Occupancy" />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortableHeader column="marketValue" label="Value" />
                  </TableHead>
                  <TableHead className="text-right">Insurance Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProperties.map((property) => {
                  const insuranceStatus = getInsuranceStatus(property.insuranceExpiresIn);
                  return (
                    <TableRow 
                      key={property.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => router.push(`/property/${property.id}`)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <PropertyIcon type={property.type} />
                          <div>
                            <div className="font-semibold">{property.address}</div>
                            <div className="text-sm text-muted-foreground">
                              {property.location}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {property.address.charAt(0)}
                            </span>
                          </div>
                          <span>Owner Name</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{property.units}</TableCell>
                      <TableCell className="text-right">{property.occupancy}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(property.marketValue)}
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="ml-auto">
                              <div className={`flex items-center justify-end gap-1 ${insuranceStatus.color}`}>
                                {property.insuranceExpiresIn <= 30 && (
                                  <AlertTriangle className="h-4 w-4" />
                                )}
                                <span>{property.insuranceExpiresIn} days</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{insuranceStatus.message}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/property/${property.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Property</DropdownMenuItem>
                            <DropdownMenuItem>View Documents</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <DataTablePagination
              pageSize={pageSize}
              setPageSize={setPageSize}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              totalItems={filteredProperties.length}
            />
          </div>
        </div>
      </div>

      <AddPropertyModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddProperty={handleAddProperty}
      />
    </div>
  );
}