/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AlertTable() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get('/api/alerte')
      .then((res) => {
        setAlerts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Erreur de chargement des alertes');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-500">Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Liste des Alertes</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Créé Par</TableHead>
              <TableHead>Date de Création</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert:any) => (
              <TableRow key={alert.id}>
                <TableCell>{alert.id}</TableCell>
                <TableCell>{alert.title}</TableCell>
                <TableCell>{alert.description}</TableCell>
                <TableCell>{alert.status}</TableCell>
                <TableCell>{alert.createdBy?.name || 'Inconnu'}</TableCell>
                <TableCell>{new Date(alert.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}