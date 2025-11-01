import axios from 'axios';
import type { Person } from '../types/person';

const API_URL = 'https://randomuser.me/api/?results=5&nat=us';

// Cache local para edição/exclusão
let cachedPeople: Person[] = [];

// Mapeia dados da API Random User para Person
const mapToPerson = (user: any, index: number): Person => {
  const uuid = user.login.uuid.replace(/-/g, '');
  
  return {
    id: index + 1, // ID simples sequencial
    nome: `${user.name.first} ${user.name.last}`,
    cpf: uuid.substring(0, 11).padEnd(11, '0'), // CPF simples baseado no UUID
    email: user.email,
    telefone: user.phone || user.cell,
    data_nascimento: user.dob.date,
    endereco: `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}`,
    data_cadastro: user.registered.date,
    status: Math.random() > 0.3 ? 'ativo' : 'inativo',
  };
};

export const personService = {
  getAll: async (): Promise<Person[]> => {
    try {
      const { data } = await axios.get(API_URL);
      cachedPeople = data.results.map(mapToPerson);
      return cachedPeople;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar pessoas');
    }
  },

  getById: async (id: number): Promise<Person> => {
    const person = cachedPeople.find(p => p.id === id);
    if (!person) throw new Error('Pessoa não encontrada');
    return person;
  },

  update: async (id: number, data: Partial<Person>): Promise<Person> => {
    const index = cachedPeople.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Pessoa não encontrada');
    
    cachedPeople[index] = { ...cachedPeople[index], ...data };
    return cachedPeople[index];
  },

  delete: async (id: number): Promise<void> => {
    const index = cachedPeople.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Pessoa não encontrada');
    cachedPeople.splice(index, 1);
  },
};
