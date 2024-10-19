import React, { useEffect, useState } from "react";
import CarForm from "./components/CarForm";
import Login from "./components/Login";
import { environments } from "./enviroments";

interface Car {
  id: string;
  plate: string;
  model: string;
  owner: string;
  status: "Recebido" | "Em Andamento" | "Pronto" | "Retirado";
  location: "Independência" | "Shopping";
  timestamp: string;
  withdrawnBy?: string;
  withdrawnTimestamp?: string; // Novo campo para armazenar o timestamp da retirada
  sl?: string;
}

const App: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const [, setWithdrawnByName] = useState<string>(""); // Mova esta linha para o topo
  const [filters, setFilters] = useState({
    date: new Date(), // Data padrão para hoje
    plate: "",
    model: "",
    owner: "",
    status: "",
    location: "",
    sl: "",
  });

  // Define styles for components
  const styles = {
    container: {
      textAlign: "center" as const,
      padding: "0",
      width: "100vw",
      boxSizing: "border-box" as const,
      height: "100vh",
    },
    header: {
      backgroundColor: "#007BFF",
      padding: "30px",
      color: "white",
      marginBottom: "50px",
      width: "100%",
      boxSizing: "border-box" as const,
      position: "relative" as const,
    },
    formContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column" as const,
      gap: "20px",
      width: "100%",
    },
    carList: {
      marginTop: "100px",
      textAlign: "left" as const,
      maxWidth: "100%",
      margin: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
    },
    carItem: {
      borderBottom: "1px solid #ccc",
    },
    th: {
      padding: "10px",
      textAlign: "center" as const,
      borderBottom: "2px solid #ccc",
      borderTop: "2px solid #ccc",
      borderLeft: "1px solid #ccc",
      borderRight: "1px solid #ccc",
      background: "black",
    },
    td: {
      padding: "10px",
      textAlign: "center" as const,
      borderLeft: "1px solid #ccc",
      borderRight: "1px solid #ccc",
    },
    statusSelect: {
      marginLeft: "10px",
      padding: "5px",
      color: "white",
      border: "none",
      borderRadius: "4px",
    },
    deleteButton: {
      backgroundColor: "#FF6347",
      color: "white",
      border: "none",
      padding: "5px 10px",
      borderRadius: "4px",
      cursor: "pointer",
    },
    logoutButton: {
      position: "absolute" as const,
      right: "20px",
      top: "2px",
      padding: "5px 10px",
      backgroundColor: "#000080",
      color: "#D3D3D3",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  
  useEffect(() => {
    const storedCars = localStorage.getItem("cars");
    if (storedCars) {
      const parsedCars: Car[] = JSON.parse(storedCars);
      setCars(parsedCars);
      setFilteredCars(
        parsedCars.filter((car) => isToday(new Date(car.timestamp)))
      );
    }
  }, []);

  // Função para verificar se a data é de hoje
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("userRole");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      setUserRole(role || "");
    }
  }, []);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    // Verifica se o campo é um input do tipo "date"
    if (name === "date") {
      // Se for, converte a string em um objeto Date
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: new Date(value), // Converte a string de volta para um objeto Date
      }));
    } else {
      // Para outros campos, apenas atualiza o valor normalmente
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };
  
  // O seu input ficaria assim
  <input
    type="date"
    name="date"
    value={filters.date.toISOString().split('T')[0]} // Formata a data para YYYY-MM-DD
    onChange={handleFilterChange} // Usa a função unificada
    style={{
      flex: "1",
      padding: "10px",
      boxSizing: "border-box",
    }}
  />
  

  useEffect(() => {
    const filtered = cars.filter(car => {
      const carDate = new Date(car.timestamp);
      const filterDate = new Date(filters.date);
      
      console.log('Filtrando Carro:', car, 'Data do Carro:', carDate, 'Data do Filtro:', filterDate); // Para depuração
    
      return (
        car.plate.toLowerCase().includes(filters.plate.toLowerCase()) &&
        car.model.toLowerCase().includes(filters.model.toLowerCase()) &&
        car.owner.toLowerCase().includes(filters.owner.toLowerCase()) &&
        (filters.status ? car.status === filters.status : true) &&
        (filters.location ? car.location === filters.location : true) &&
        (filters.date ? (
          carDate.getFullYear() === filterDate.getFullYear() &&
          carDate.getMonth() === filterDate.getMonth() &&
          carDate.getDate() === filterDate.getDate()
        ) : true)
      );
    });    
    setFilteredCars(filtered);
    console.log('Filtered Cars:', filtered); // Para debugging
}, [cars, filters]);

  
  useEffect(() => {
    console.log('Filter Date Changed:', filters.date);
    // ... lógica de filtragem
  }, [filters.date]);  
  

  const fetchCars = async (selectedDate?: string) => { 
    try {
        const url = selectedDate
            ? `${environments.API_URL}/veiculos?date=${selectedDate}`
            : `${environments.API_URL}/veiculos`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Erro ao buscar veículos");
        }

        const data: Car[] = await response.json();
        setCars(data); // Atualize a lista de carros

        // Filtrar os carros após a atualização da lista
        const todayCars = data.filter((car) => {
            const carDate = new Date(car.timestamp);
            return (
                !selectedDate || // Se uma data foi selecionada
                (carDate.getFullYear() === new Date(selectedDate).getFullYear() &&
                 carDate.getMonth() === new Date(selectedDate).getMonth() &&
                 carDate.getDate() === new Date(selectedDate).getDate())
            );
        });
        setFilteredCars(todayCars); // Atualize a lista filtrada
    } catch (error) {
        console.error("Erro ao buscar veículos:", error);
    }
};

useEffect(() => {
  // Converte o filtro de data selecionada em uma string de formato YYYY-MM-DD
  const selectedDate = filters.date.toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  // Compara se a data selecionada é igual à data de hoje
  if (selectedDate === today) {
    fetchCars(today); // Busca os veículos para hoje
  } else {
    fetchCars(selectedDate); // Busca os veículos para a data selecionada
  }
}, [filters.date]);



const updateLocalStorage = (updatedCars: Car[]) => {
    localStorage.setItem("cars", JSON.stringify(updatedCars));
};


const addCar = async (newCar: Omit<Car, 'id' | 'timestamp' | 'withdrawnBy' | 'withdrawnTimestamp'>) => {
  const localTimestamp = new Date();
  const carWithTimestamp = {
    ...newCar,
    id: Date.now().toString(),
    timestamp: localTimestamp.toISOString(),
    withdrawnBy: "",
    withdrawnTimestamp: "",
  };

  try {
    const response = await fetch(`${environments.API_URL}/veiculos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carWithTimestamp),
    });

    if (!response.ok) {
      throw new Error("Erro ao adicionar veículo");
    }

    // O veículo foi salvo corretamente no backend
    await response.json();

    // Agora atualize a lista de carros chamando a função `fetchCars`
    fetchCars();  // Isso vai garantir que os carros sejam buscados novamente da API
  } catch (error) {
    console.error("Erro ao adicionar veículo:", error);
  }
};


  const removeCar = async (id: string) => {
    try {
      const response = await fetch(`${environments.API_URL}/veiculos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao deletar veículo");
      }
      const updatedCars = cars.filter((car) => car.id !== id);
      setCars(updatedCars);
      setFilteredCars(
        updatedCars.filter((car) => isToday(new Date(car.timestamp)))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const updateWithdrawnBy = (id: string, withdrawnBy: string) => {
    const updatedCars = cars.map((car) =>
      car.id === id
        ? {
            ...car,
            withdrawnBy,
            withdrawnTimestamp: new Date().toLocaleString(),
          }
        : car
    );
    setCars(updatedCars);
    setFilteredCars(updatedCars);
    updateLocalStorage(updatedCars);
  };

  // Função atualizada para alterar o status e gerenciar a Data de Retirada
  const updateStatus = async (
    id: string,
    newStatus: "Recebido" | "Em Andamento" | "Pronto" | "Retirado"
  ) => {
    try {
      const response = await fetch(`${environments.API_URL}/veiculos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error("Erro ao atualizar status");
      }
  
      const data = await response.json(); // Obtém o withdrawnTimestamp da resposta da API
      
      const updatedCars = cars.map((car) =>
        car.id === id 
          ? { ...car, status: newStatus, withdrawnTimestamp: data.withdrawnTimestamp } 
          : car
      );
      
      setCars(updatedCars);
      setFilteredCars(updatedCars);
      
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const getStatusColor = (
    status: "Recebido" | "Em Andamento" | "Pronto" | "Retirado"
  ) => {
    switch (status) {
      case "Recebido":
        return "#4B0082";
      case "Em Andamento":
        return "#FF8C00";
      case "Pronto":
        return "#228B22";
      case "Retirado":
        return "black";
      default:
        return "white";
    }
  };

  const handleLogin = (email: string, password: string) => {
    const users: Record<string, { password: string; role: string }> = {
      "priscilaroverssi01@gmail.com": { password: "senha123", role: "admin" },
      "danielalopes.lad@gmail.com": { password: "senha456", role: "viewer" },
    };

    if (typeof email !== "string" || email.trim() === "") {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    const storedUser = users[email];
    if (storedUser) {
      if (storedUser.password === password) {
        setIsLoggedIn(true);
        setUserRole(storedUser.role);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", storedUser.role);
      } else {
        alert("E-mail ou senha incorretos.");
      }
    } else {
      alert("E-mail não encontrado.");
    }
  };

  const handleWithdrawnBySubmit = (carId: string, withdrawnBy: string) => {
    // Lógica para registrar o nome ou enviar para a API
    console.log(`Carro ${carId} retirado por ${withdrawnBy}`);
    // Você pode fazer uma chamada de API aqui para salvar o nome
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
  };

  // Função para limpar os filtros
  const clearFilters = () => {
    setFilters({
      plate: "",
      model: "",
      owner: "",
      status: "",
      location: "",
      date: new Date(), // Resetando o filtro de data
      sl: "",
    });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Lava Rápido do Nelsinho</h1>
        {isLoggedIn && (
          <button onClick={handleLogout} style={styles.logoutButton}>
            Sair
          </button>
        )}
      </header>
  
      {isLoggedIn ? (
        <>
          <div style={styles.formContainer}>
            {userRole === "admin" && <CarForm onAddCar={addCar} />}
          </div>
  
          <div style={styles.carList}>
            <div style={{ marginTop: "200px" }}>
              <h2>Veículos Cadastrados:</h2>
            </div>
  
            {/* Campos de filtro */}
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
              <input
                type="text"
                name="plate"
                placeholder="Filtrar por Placa"
                value={filters.plate}
                onChange={handleFilterChange}
                style={{
                  flex: "1",
                  padding: "10px",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                name="model"
                placeholder="Filtrar por Modelo"
                value={filters.model}
                onChange={handleFilterChange}
                style={{
                  flex: "1",
                  padding: "10px",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                name="owner"
                placeholder="Filtrar por Nome"
                value={filters.owner}
                onChange={handleFilterChange}
                style={{
                  flex: "1",
                  padding: "10px",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                name="owner"
                placeholder="Filtrar por SL"
                value={filters.owner}
                onChange={handleFilterChange}
                style={{
                  flex: "1",
                  padding: "10px",
                  boxSizing: "border-box",
                }}
              />
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                style={{
                  flex: "1",
                  padding: "10px",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Todos</option>
                <option value="Recebido">Recebido</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Pronto">Pronto</option>
                <option value="Retirado">Retirado</option>
              </select>
  
              <div style={{ flex: "1" }}>
                <label htmlFor="location">Filtrar por Localização:</label>
                <select
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Todas</option>
                  <option value="Independência">Independência</option>
                  <option value="Shopping">Shopping</option>
                </select>
              </div>
  
              {/* Novo campo para filtrar por data */}
              <input
                type="date"
                name="date"
                value={filters.date.toISOString().split('T')[0]} // Formata a data para YYYY-MM-DD
                onChange={handleFilterChange} // Chama a função de manipulação de forma correta
                style={{
                  flex: "1",
                  padding: "10px",
                  boxSizing: "border-box",
                }}
              />
              {/* Botão de Limpar Filtro */}
              <button
                  onClick={clearFilters}
                  style={{
                  padding: "9px",
                  color: "white",
                  border: "none",
                  borderRadius: "2px",
                  cursor: "pointer",
                  flex: "1",
                  backgroundColor: "#808080", // Adicione uma cor de fundo ao botão
                }}
              >
                Limpar Filtro
              </button>
            </div>
 

            {filteredCars.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Placa</th>
                    <th style={styles.th}>Modelo</th>
                    <th style={styles.th}>Nome</th>
                    <th style={styles.th}>SL</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Localização</th>
                    <th style={styles.th}>Data de Cadastro</th>
                    {/* A coluna "Data de Retirada" agora sempre será exibida */}
                    <th style={styles.th}>Data de Retirada</th>
                    <th style={styles.th}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car) => (
                    <tr key={car.id} style={styles.carItem}>
                      <td style={styles.td}>{car.plate}</td>
                      <td style={styles.td}>{car.model}</td>
                      <td style={styles.td}>{car.owner}</td>
                      <td style={styles.td}>{car.sl}</td>
                      <td style={styles.td}>
                        {userRole === "admin" ? (
                          <>
                            <select
                              value={car.status}
                              onChange={(e) =>
                                updateStatus(
                                  car.id,
                                  e.target.value as
                                    | "Recebido"
                                    | "Em Andamento"
                                    | "Pronto"
                                    | "Retirado"
                                )
                              }
                              style={{
                                ...styles.statusSelect,
                                backgroundColor: getStatusColor(car.status),
                              }}
                            >
                              <option value="Recebido">Recebido</option>
                              <option value="Em Andamento">Em Andamento</option>
                              <option value="Pronto">Pronto</option>
                              <option value="Retirado">Retirado</option>
                            </select>
                            {car.status === "Retirado" && (
                              <div
                                style={{
                                  marginTop: "5px",
                                  display: "flex",
                                  justifyContent: "center",
                                  width: "100%",
                                }}
                              >
                                <input
                                  type="text"
                                  placeholder="Nome de quem retirou"
                                  value={car.withdrawnBy || ""}
                                  onChange={(e) => {
                                    setWithdrawnByName(e.currentTarget.value);
                                    updateWithdrawnBy(
                                      car.id,
                                      e.currentTarget.value
                                    );
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleWithdrawnBySubmit(
                                        car.id,
                                        car.withdrawnBy || ""
                                      );
                                    }
                                  }}
                                  style={{ padding: "5px", width: "70%" }}
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <span>{car.status}</span>
                        )}
                        {/* Mostrar o nome de quem retirou, se disponível */}
                        {car.status === "Retirado" && car.withdrawnBy && (
                          <div style={{ marginTop: "5px" }}>
                            <strong>Retirado por:</strong> {car.withdrawnBy}
                          </div>
                        )}
                      </td>
                      <td style={styles.td}>{car.location}</td>
                      <td style={styles.td}>
                        {new Date(car.timestamp).toLocaleString()}
                      </td>
                      {/* Mostrar a data de retirada ou 'N/A' se não disponível */}
                      <td style={styles.td}>
                        {car.status === "Retirado"
                          ? `Retirado em: ${car.withdrawnTimestamp || "N/A"}`
                          : "N/A"}
                      </td>
                      <td style={styles.td}>
                        {userRole === "admin" ? (
                          <button
                            onClick={() => removeCar(car.id)}
                            style={styles.deleteButton}
                          >
                            Remover
                          </button>
                        ) : (
                          <span>Sem permissão</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhum veículo cadastrado.</p>
            )}
          </div>
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;