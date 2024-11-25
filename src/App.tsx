// Importações e hooks melhorados
import React, { useEffect, useState } from "react";
import CarForm from "./components/CarForm";
import Login from "./components/Login";
import { environments } from "./environments";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "./App.css"; // Importando estilos de um arquivo CSS separado

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

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "1rem",
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const [withdrawnByName, setWithdrawnByName] = useState<Record<string, string>>({});
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    date: dayjs().format("YYYY-MM-DD"),
    plate: "",
    model: "",
    owner: "",
    status: "",
    location: "",
    sl: "",
  });
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [updatedStatus, setUpdatedStatus] = useState<string>("");
  

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("userRole");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      setUserRole(role || "");
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      // Faz a requisição DELETE para o backend
      const response = await fetch(`${environments.API_URL}/veiculos/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Erro ao deletar veículo'); // Lança um erro se a resposta não for bem-sucedida
      }
  
      // Aqui você pode adicionar a lógica para atualizar a lista de veículos após a exclusão
      alert("Veículo deletado com sucesso!");
      
      // Se você estiver mantendo a lista de veículos em um estado, atualize-a aqui
      setFilteredCars(filteredCars.filter(car => car.id !== id));
    } catch (error) {
      console.error("Erro ao deletar veículo:", error);
      alert("Erro ao deletar veículo.");
    }
  };
  

  const handleWithdraw = (carId: string) => {
    setEditingCarId(carId); // Define qual carro está sendo editado
  };

  const handleNameChange = (carId: string, name: string) => {
    setWithdrawnByName((prev) => ({ ...prev, [carId]: name }));
  };

  const handleNameSubmit = (carId: string) => {
    updateCarStatus(carId, "Retirado"); // Atualiza o status do carro para "Retirado"
    setEditingCarId(null); // Reseta o carro sendo editado
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        date: date.format("YYYY-MM-DD"),
      }));
    }
  };

  useEffect(() => {
    fetchCars(filters.date);
  }, [filters.date]);

  useEffect(() => {
    const filtered = cars.filter((car) => {
      const carDate = dayjs(car.timestamp).format("YYYY-MM-DD");
      const filterDate = filters.date;
      return (
        (!filters.plate ||
          car.plate.toLowerCase().includes(filters.plate.toLowerCase())) &&
        (!filters.model ||
          car.model.toLowerCase().includes(filters.model.toLowerCase())) &&
        (!filters.owner ||
          car.owner.toLowerCase().includes(filters.owner.toLowerCase())) &&
        (!filters.status || car.status === filters.status) &&
        (!filters.location || car.location === filters.location) &&
        (!filters.sl ||
          car.sl?.toLowerCase().includes(filters.sl.toLowerCase())) &&
        carDate === filterDate
      );
    });
    setFilteredCars(filtered);
  }, [cars, filters]);

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
      setCars(data);
      setFilteredCars(
        data.filter(
          (car) =>
            (!filters.plate ||
              car.plate.toLowerCase().includes(filters.plate.toLowerCase())) &&
            (!filters.model ||
              car.model.toLowerCase().includes(filters.model.toLowerCase())) &&
            (!filters.owner ||
              car.owner.toLowerCase().includes(filters.owner.toLowerCase())) &&
            (!filters.status || car.status === filters.status) &&
            (!filters.location || car.location === filters.location) &&
            (!filters.sl ||
              car.sl?.toLowerCase().includes(filters.sl.toLowerCase())) &&
            dayjs(car.timestamp).format("YYYY-MM-DD") === filters.date
        )
      );
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
    }
  };

  const handleLogin = (email: string, password: string) => {
    const users: Record<string, { password: string; role: string }> = {
      "": { password: "", role: "admin" },

      "": { password: "", role: "viewer" },
    };

    if (typeof email !== "string" || email.trim() === "") {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    const storedUser = users[email];
    if (storedUser && storedUser.password === password) {
      setIsLoggedIn(true);
      setUserRole(storedUser.role);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", storedUser.role);
    } else {
      alert("E-mail ou senha incorretos.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
  };

  const addCar = async (
    newCar: Omit<Car, "id" | "timestamp" | "withdrawnBy" | "withdrawnTimestamp">
  ) => {
    const carWithTimestamp = {
      ...newCar,
      id: Date.now().toString(),
      timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
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

      await response.json();
      fetchCars(filters.date);
    } catch (error) {
      console.error("Erro ao adicionar veículo:", error);
    }
  };



  const updateCarStatus = async (carId: string, status: string) => {
    try {
      const body: any = { status };
  
      // Se o status for "Retirado", adiciona o nome do responsável
      if (status === "Retirado") {
        // Acessa o nome da pessoa responsável baseado no carId
        const withdrawnBy = withdrawnByName[carId];
        if (!withdrawnBy) {
          console.error("Nome da pessoa responsável não encontrado.");
          return; // Retorna se não encontrar o nome
        }
        body.withdrawnBy = withdrawnBy; // Adiciona o nome aqui
      }
  
      const response = await fetch(
        `${environments.API_URL}/veiculos/${carId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
  
      if (!response.ok) {
        throw new Error("Erro ao atualizar veículo");
      }
  
      await response.json();
      fetchCars(filters.date); // Atualiza a lista de carros após a alteração
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error);
    }
  };
  
 
  const handleEditClick = (car: Car) => {
    setSelectedCar(car);
    setUpdatedStatus(car.status);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedCar(null);
  };

  const handleStatusChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setUpdatedStatus(e.target.value as string);
  };

  const handleEditSave = () => {
    if (selectedCar) {
      updateCarStatus(selectedCar.id, updatedStatus);
    }
    handleEditDialogClose();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Recebido":
        return <Chip label="Recebido" color="default" />;
      case "Em Andamento":
        return <Chip label="Em Andamento" color="primary" />;
      case "Pronto":
        return <Chip label="Pronto" color="success" />;
      case "Retirado":
        return <Chip label="Retirado" color="secondary" />;
      default:
        return <Chip label="Desconhecido" />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Lava Rápido do Nelsinho
          </Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={handleLogout}>
              Sair
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        {isLoggedIn ? (
          <>
            <Grid container spacing={3} sx={{ marginTop: 3 }}>
              <Grid item xs={12}>
                {userRole === "admin" && <CarForm onAddCar={addCar} />}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  Veículos Cadastrados
                </Typography>
                <Grid container spacing={2}>
                  {/** Filtros **/}
                  <Grid item xs={12} md={2}>
                    <TextField
                      label="Filtrar por Placa"
                      name="plate"
                      value={filters.plate}
                      onChange={handleFilterChange as React.ChangeEventHandler<HTMLInputElement>}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Filtrar por Modelo"
                      name="model"
                      value={filters.model}
                      onChange={handleFilterChange as React.ChangeEventHandler<HTMLInputElement>}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Filtrar por Nome"
                      name="owner"
                      value={filters.owner}
                      onChange={handleFilterChange as React.ChangeEventHandler<HTMLInputElement>}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Filtrar por Status"
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange as React.ChangeEventHandler<HTMLInputElement>}
                      select
                      fullWidth
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="Recebido">Recebido</MenuItem>
                      <MenuItem value="Em Andamento">Em Andamento</MenuItem>
                      <MenuItem value="Pronto">Pronto</MenuItem>
                      <MenuItem value="Retirado">Retirado</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Filtrar por Localização"
                      name="location"
                      value={filters.location}
                      onChange={handleFilterChange as React.ChangeEventHandler<HTMLInputElement>}
                      select
                      fullWidth
                    >
                      <MenuItem value="">Todas</MenuItem>
                      <MenuItem value="Independência">Independência</MenuItem>
                      <MenuItem value="Shopping">Shopping</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Filtrar por SL"
                      name="sl"
                      value={filters.sl}
                      onChange={handleFilterChange as React.ChangeEventHandler<HTMLInputElement>}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Filtrar por Data"
                        value={dayjs(filters.date)}
                        onChange={handleDateChange}
                        inputFormat="DD/MM/YYYY"
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      size="large"
                      fullWidth
                      style={{ marginBottom: 20 }}
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        setFilters({
                          plate: "",
                          model: "",
                          owner: "",
                          status: "",
                          location: "",
                          sl: "",
                          date: dayjs().format("YYYY-MM-DD"),
                        })
                      }
                    >
                      Limpar Filtros
                    </Button>
                  </Grid>
                </Grid>
  
                {filteredCars.length > 0 ? (
  <TableContainer component={Paper} sx={{ marginTop: 2 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Placa</TableCell>
          <TableCell>Modelo</TableCell>
          <TableCell>Nome</TableCell>
          <TableCell>SL</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Quem Retirou</TableCell>
          <TableCell>Localização</TableCell>
          <TableCell>Data de Cadastro</TableCell>
          <TableCell>Data de Retirada</TableCell>
          <TableCell>Ações</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredCars.map((car) => (
          <TableRow key={car.id}>
            <TableCell>{car.plate}</TableCell>
            <TableCell>{car.model}</TableCell>
            <TableCell>{car.owner}</TableCell>
            <TableCell>{car.sl}</TableCell>
            <TableCell>{getStatusBadge(car.status)}</TableCell>
            <TableCell>
              {car.status === "Retirado" ? car.withdrawnBy : "N/A"}
            </TableCell>
            <TableCell>{car.location}</TableCell>
            <TableCell>{dayjs(car.timestamp).format("DD/MM/YYYY HH:mm:ss")}</TableCell>
            <TableCell>
              {car.withdrawnTimestamp
                ? dayjs(car.withdrawnTimestamp).format("DD/MM/YYYY HH:mm:ss")
                : "N/A"}
            </TableCell>
            <TableCell>
              {userRole === "admin" ? (
                editingCarId === car.id ? (
                  <TextField
                    value={withdrawnByName[car.id] || ""}
                    onChange={(e) => handleNameChange(car.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleNameSubmit(car.id);
                      }
                    }}
                  />
                ) : (
                  <Button onClick={() => handleWithdraw(car.id)}>Retirar</Button>
                )
              ) : null}
            </TableCell>
            <TableCell>
  {userRole === "admin" && (
    <>
      <IconButton color="primary" onClick={() => handleEditClick(car)}>
        <EditIcon />
      </IconButton>
      <IconButton
        color="secondary"
        onClick={() => handleDelete(car.id)} // Chamando a função de deletar
      >
        <DeleteIcon />
      </IconButton>
    </>
  )}
</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
) : (
  <Typography variant="body1" sx={{ marginTop: 2 }}>
    Nenhum veículo cadastrado.
  </Typography>
)}
</Grid>
</Grid>
</>
) : (
<Login onLogin={handleLogin} />
)}
</Container>

  
      {/* Diálogo de Edição de Status */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Editar Status do Veículo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Selecione o novo status do veículo.
          </DialogContentText>
          <Select value={updatedStatus} onChange={(e: any) => handleStatusChange(e)} fullWidth>
            <MenuItem value="Recebido">Recebido</MenuItem>
            <MenuItem value="Em Andamento">Em Andamento</MenuItem>
            <MenuItem value="Pronto">Pronto</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
  };
  
  export default App;
  
