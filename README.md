<h1>🚗 Lava Rápido </h1>
Este é um aplicativo React para gerenciamento de veículos em um lava-rápido, com autenticação de usuários e várias funcionalidades. Vamos detalhar os aspectos mais importantes:
<br>
<h2>📂 Estrutura Principal</h2>
<p>Dependências e Importações</p>
<p>-Bibliotecas principais: React, Material-UI (MUI), dayjs para manipulação de datas</p>
<p>-Componentes MUI: AppBar, Table, Dialog, etc. para a interface</p>
<p>-Componentes personalizados: CarForm e Login</p>
<br>
<h3>Interface e Tipagem</h3>
<p>interface Car {</p>
<p>id: string;</p>
<p>  plate: string;</p>
 <p> model: string;</p>
 <p> owner: string;</p>
 <p> status: "Recebido" | "Em Andamento" | "Pronto" | "Retirado";</p>
 <p> location: "Independência" | "Shopping";</p>
 <p> timestamp: string;</p>
 <p> withdrawnBy?: string;</p>
 <p> withdrawnTimestamp?: string;</p>
 <p> sl?: string;</p>
<p>}</p>
<p>Define a estrutura de um veículo com todos os campos necessários.</p>
<br>
<h3>Funcionalidades Principais</h3>
<p>1. Autenticação e Autorização</p>
<p>-Login: Verifica credenciais contra um objeto users hardcoded</p>
<p>-Roles: admin (pode adicionar/editar/excluir) e viewer (somente visualização)</p>
<p>-Persistência: Usa localStorage para manter sessão</p>
<br>
<p>2. CRUD de Veículos</p>
<p>-Create: addCar envia POST para a API</p>
<p>-Read: fetchCars busca veículos com filtros por data</p>
<p>-Update: updateCarStatus envia PUT para alterar status</p>
<p>-Delete: handleDelete envia DELETE para remover veículo</p>
<br>
<p>3. Filtros Avançados</p>
<p>-Filtros por: placa, modelo, proprietário, status, localização, SL e data</p>
<p>-Botão para limpar todos os filtros</p>
<br>
<p>4. Fluxo de Trabalho</p>
<p>-Status possíveis: Recebido → Em Andamento → Pronto → Retirado</p>
<p>-Para marcar como "Retirado", é necessário informar o nome de quem retirou</p>
<br>
<p>Componentes Importantes</p>
<p>1. Tabela de Veículos</p>
<p>-Exibe todos os veículos filtrados</p>
<p>-Colunas: Placa, Modelo, Nome, SL, Status, Localização, etc.</p>
<p>-Ações por linha (editar, excluir, marcar como retirado)</p>
<br>
<p>2. Formulário de Veículo</p>
<p>-Componente separado (CarForm)</p>
<p>-Somente visível para usuários com role admin</p>
<br>
<p>3. Diálogos</p>
<p>-Diálogo para edição de status</p>
<p>-Diálogo implícito para inserir nome ao retirar veículo</p>
<br>
<p><h3>Estilização e Temas</h3>
<p>-Usa ThemeProvider do MUI com paleta personalizada</p>
<p>-Estilos globais com CssBaseline</p>
<p>-Estilos específicos para componentes como TextField</p>
<br>
<p><h3>Gerenciamento de Estado</h3>
<p>useState para:</p>
<p>-Lista de veículos (cars, filteredCars)</p>
<p>-Estado de autenticação (isLoggedIn, userRole)</p>
<p>-Filtros ativos</p>
<p>-Diálogos abertos</p>
<br>
<p>useEffect para:</p>
<p>-Carregar veículos quando a data do filtro muda</p>
<p>-Aplicar filtros quando os critérios mudam</p>
<p>-Verificar autenticação ao carregar o app</p>
<br>
<p><h3>Integração com API</h3>
<p>Todas as operações CRUD usam fetch para se comunicar com:</p>

<p>${environments.API_URL}/veiculos</p>

Tratamento básico de erros</p>
