// src/types/index.ts

export type Role = 'AGENT_COM' | 'CHEF_SECT' | 'CHEF_ANTE';

export interface Antenne {
  id: number;
  nom: string;
}

export interface Employee {
  id: number;
  nom: string;
  prenom: string;
  role: Role;
  antenneId: number;
  antenneName?: string;
}

export interface Epave {
  id: number;
  date: string;
  gareDepot: string;
  train: string;
  bm379: string;
  contenu: string;
  controllerId: number;
  controllerName?: string;
  agentComId: number;
}

export interface FicheInfraction {
  id: number;
  date: string;
  gareD: string;
  gareA: string;
  gareDepot: string;
  train: string;
  numVoy: number;
  montant: number;
  motif: string;
  observation: string;
  controllerId: number;
  controllerName?: string;
  agentComId: number;
}

export interface CartePerimee {
  id: number;
  date: string;
  numCarte: string;
  gareD: string;
  gareA: string;
  train: string;
  confort: 1 | 2;
  dateDv: string;
  dateFv: string;
  suiteReservee: string;
  controllerId: number;
  controllerName?: string;
  agentComId: number;
}

export interface AuthUser {
  id: number;
  username: string;
  role: Role;
  token: string;
}