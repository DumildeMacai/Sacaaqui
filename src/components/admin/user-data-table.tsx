
"use client";

import type { User } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UserDataTableProps {
  data: User[];
}

export function UserDataTable({ data }: UserDataTableProps) {

  const getReputationBadge = (reputation: number) => {
    if (reputation > 1) return <Badge variant="default">Alta</Badge>;
    if (reputation === 1) return <Badge variant="secondary">Normal</Badge>;
    return <Badge variant="destructive">Baixa</Badge>;
  }


  return (
    <div className="w-full">
        <div className="flex items-center justify-between py-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight font-headline">Gerenciamento de Usuários</h2>
                <p className="text-muted-foreground">Visualize os utilizadores registados na plataforma.</p>
            </div>
        </div>
        <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Reputação</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{getReputationBadge(user.reputation)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhum utilizador encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
