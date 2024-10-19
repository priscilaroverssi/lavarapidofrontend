import React, { useState } from 'react';

interface CarFormProps {
  onAddCar: (car: {
    plate: string;
    model: string;
    owner: string;
    sl: string; // Novo campo
    status: "Recebido" | "Em Andamento" | "Pronto" | "Retirado";
    location: "Independência" | "Shopping";
  }) => void;
}

const CarForm: React.FC<CarFormProps> = ({ onAddCar }) => {
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState<"Recebido" | "Em Andamento" | "Pronto" | "Retirado">("Recebido");
  const [location, setLocation] = useState<"Independência" | "Shopping">("Independência");
  const [sl, setSl] = useState(''); // Novo estado para "SL"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCar({ plate, model, owner, status, location, sl }); // Adicione "sl" ao objeto
    setPlate('');
    setModel('');
    setOwner('');
    setSl(''); // Limpe o campo "SL" após o envio
  };

  return (
    <div style={styles.formContainer}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Placa"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Modelo"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Nome"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="SL" // Novo campo de entrada
            value={sl}
            onChange={(e) => setSl(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "Recebido" | "Em Andamento" | "Pronto" | "Retirado")}
            style={styles.select}
          >
            <option value="Recebido">Recebido</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Pronto">Pronto</option>
            <option value="Retirado">Retirado</option>
          </select>
        </div>
        <div style={styles.inputContainer}>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value as "Independência" | "Shopping")}
            style={styles.select}
          >
            <option value="Independência">Independência</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>
        <button type="submit" style={styles.submitButton}>Cadastrar Veículo</button>
      </form>
    </div>
  );
};

const styles = {
  formContainer: {
    border: '2px solid #007BFF',
    borderRadius: '50px',
    padding: '20px',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    boxSizing: 'border-box' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '15px',
    width: '95%',
  },
  inputContainer: {
    border: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '2px solid #007BFF',
    borderRadius: '25px',
    outline: 'none',
  },
  select: {
    width: '104%',
    padding: '10px',
    fontSize: '16px',
    border: '2px solid #007BFF',
    borderRadius: '25px',
    outline: 'none',
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default CarForm;
