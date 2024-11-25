// Importações do Material UI
import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";

interface CarFormProps {
  onAddCar: (car: {
    plate: string;
    model: string;
    owner: string;
    sl: string;
    status: "Recebido" | "Em Andamento" | "Pronto" | "Retirado";
    location: "Independência" | "Shopping";
  }) => void;
}

const CarForm: React.FC<CarFormProps> = ({ onAddCar }) => {
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState<
    "Recebido" | "Em Andamento" | "Pronto" | "Retirado"
  >("Recebido");
  const [location, setLocation] = useState<"Independência" | "Shopping">(
    "Independência"
  );
  const [sl, setSl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCar({ plate, model, owner, status, location, sl });
    setPlate("");
    setModel("");
    setOwner("");
    setSl("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        border: "2px solid #007BFF",
        borderRadius: 3,
        width: "100%",
        mx: "auto",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            label="Placa"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Modelo"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Nome"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="SL"
            value={sl}
            onChange={(e) => setSl(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as
                    | "Recebido"
                    | "Em Andamento"
                    | "Pronto"
                    | "Retirado"
                )
              }
              label="Status"
            >
              <MenuItem value="Recebido">Recebido</MenuItem>
              <MenuItem value="Em Andamento">Em Andamento</MenuItem>
              <MenuItem value="Pronto">Pronto</MenuItem>
              <MenuItem value="Retirado">Retirado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Localização</InputLabel>
            <Select
              value={location}
              onChange={(e) =>
                setLocation(e.target.value as "Independência" | "Shopping")
              }
              label="Localização"
            >
              <MenuItem value="Independência">Independência</MenuItem>
              <MenuItem value="Shopping">Shopping</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Cadastrar Veículo
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CarForm;
