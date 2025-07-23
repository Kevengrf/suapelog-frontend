export const formatDocument = (value: string): string => {
  const cleanedValue = value.replace(/\D/g, ''); // Remove all non-digit characters

  if (cleanedValue.length <= 11) {
    // CPF format: XXX.XXX.XXX-XX
    return cleanedValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // CNPJ format: XX.XXX.XXX/XXXX-XX
    return cleanedValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
};

export const generateRandomName = (): string => {
  const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Mariana', 'Lucas', 'Julia'];
  const lastNames = ['Silva', 'Souza', 'Oliveira', 'Santos', 'Pereira', 'Costa', 'Martins', 'Almeida'];
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${randomFirstName} ${randomLastName}`;
};

export const generateRandomCpf = (): string => {
  let cpf = '';
  for (let i = 0; i < 9; i++) {
    cpf += Math.floor(Math.random() * 10);
  }
  cpf = formatDocument(cpf);
  return cpf;
};

export const generateRandomPlate = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let plate = '';
  for (let i = 0; i < 3; i++) plate += letters.charAt(Math.floor(Math.random() * letters.length));
  plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
  plate += letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 2; i++) plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
  return plate;
};
