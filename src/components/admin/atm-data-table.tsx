"use client";

import type { Atm } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleSlash, HelpCircle, MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

const statusMap: { [key in Atm['status']]: { text: string; icon: React.ReactNode } } = {
    com_dinheiro: { text: 'Com Dinheiro', icon: <CheckCircle2 className="h-4 w-4 text-accent" /> },
    sem_dinheiro: { text: 'Sem Dinheiro', icon: <CircleSlash className="h-4 w-4 text-destructive" /> },
    desconhecido: { text: 'Desconhecido', icon: <HelpCircle className="h-4 w-4 text-muted-foreground" /> },
};

interface AtmDataTableProps {
  data: Atm[];
}

export function AtmDataTable({ data }: AtmDataTableProps) {

  return (
    <div className="w-full">
        <div className="flex items-center justify-between py-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight font-headline">Gerenciamento de ATMs</h2>
                <p className="text-muted-foreground">Adicione, edite ou remova caixas eletrônicos.</p>
            </div>
            <Button asChild>
                <Link href="/admin/atms/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar ATM
                </Link>
            </Button>
        </div>
        <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((atm) => (
                <TableRow key={atm.id}>
                  <TableCell className="font-medium">{atm.name}</TableCell>
                  <TableCell>{atm.address}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">{statusMap[atm.status].icon} {statusMap[atm.status].text}</Badge>
                  </TableCell>
                  <TableCell>{new Date(atm.lastUpdate).toLocaleString('pt-BR')}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Deletar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum ATM encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
