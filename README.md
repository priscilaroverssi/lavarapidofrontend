<h1>🚗 Lava Rápido </h1>
Este é um aplicativo React para gerenciamento de veículos em um lava-rápido, com autenticação de usuários e várias funcionalidades. Vamos detalhar os aspectos mais importantes:

<h2>📂 Estrutura Principal</h2>
Dependências e Importações
-Bibliotecas principais: React, Material-UI (MUI), dayjs para manipulação de datas
-Componentes MUI: AppBar, Table, Dialog, etc. para a interface
-Componentes personalizados: CarForm e Login

<h3>Interface e Tipagem</h3>
typescript
interface Car {
  id: string;
  plate: string;
  model: string;
  owner: string;
  status: "Recebido" | "Em Andamento" | "Pronto" | "Retirado";
  location: "Independência" | "Shopping";
  timestamp: string;
  withdrawnBy?: string;
  withdrawnTimestamp?: string;
  sl?: string;
}
Define a estrutura de um veículo com todos os campos necessários.

<h3>Funcionalidades Principais</h3>
1. Autenticação e Autorização
-Login: Verifica credenciais contra um objeto users hardcoded
-Roles: admin (pode adicionar/editar/excluir) e viewer (somente visualização)
-Persistência: Usa localStorage para manter sessão

2. CRUD de Veículos
-Create: addCar envia POST para a API
-Read: fetchCars busca veículos com filtros por data
-Update: updateCarStatus envia PUT para alterar status
-Delete: handleDelete envia DELETE para remover veículo

3. Filtros Avançados
-Filtros por: placa, modelo, proprietário, status, localização, SL e data
-Botão para limpar todos os filtros

4. Fluxo de Trabalho
-Status possíveis: Recebido → Em Andamento → Pronto → Retirado
-Para marcar como "Retirado", é necessário informar o nome de quem retirou

Componentes Importantes
1. Tabela de Veículos
-Exibe todos os veículos filtrados
-Colunas: Placa, Modelo, Nome, SL, Status, Localização, etc.
-Ações por linha (editar, excluir, marcar como retirado)

2. Formulário de Veículo
-Componente separado (CarForm)
-Somente visível para usuários com role admin

3. Diálogos
-Diálogo para edição de status
-Diálogo implícito para inserir nome ao retirar veículo

<h3>Estilização e Temas</h3>
-Usa ThemeProvider do MUI com paleta personalizada
-Estilos globais com CssBaseline
-Estilos específicos para componentes como TextField

<h3>Gerenciamento de Estado</h3>
useState para:
-Lista de veículos (cars, filteredCars)
-Estado de autenticação (isLoggedIn, userRole)
-Filtros ativos
-Diálogos abertos

useEffect para:
-Carregar veículos quando a data do filtro muda
-Aplicar filtros quando os critérios mudam
-Verificar autenticação ao carregar o app

<h3>Integração com API</h3>
Todas as operações CRUD usam fetch para se comunicar com:

${environments.API_URL}/veiculos

Tratamento básico de erros
