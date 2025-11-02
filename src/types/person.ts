export type Person = {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    data_nascimento?: string;
    endereco: string;
    data_cadastro: string;
    status: 'ativo' | 'inativo';
};


