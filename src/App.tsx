import { useState } from "react";
import handleSubmit from "./scripts";

export interface IFormData {
  extract: string;
  bank: string;
  agency: string;
  account: string;
  year: string;
  balance: string;
}

function App() {
  const [data, setData] = useState<IFormData>({
    extract: "",
    bank: '{"id": "033", "name": "SANTANDER"}',
    agency: "",
    account: "",
    year: "",
    balance: "",
  });

  return (
    <div className="container">
      <form className="formContainer" onSubmit={(e) => handleSubmit(e, data)}>
        <label htmlFor="textArea">EXTRATO:</label>
        <textarea
          id="textArea"
          required
          value={data.extract}
          onChange={(e) => setData({ ...data, extract: e.currentTarget.value })}
        ></textarea>
        <label htmlFor="banco">Banco:</label>
        <select
          id="banco"
          required
          value={data.bank}
          onChange={(e) => setData({ ...data, bank: e.currentTarget.value })}
        >
          <option value='{"id": "033", "name": "SANTANDER"}'>Santander</option>
          <option value='{"id": "756", "name": "SICOOB"}'>Sicoob</option>
        </select>
        <label htmlFor="agencia">Agencia:</label>
        <input
          type="text"
          id="agencia"
          required
          value={data.agency}
          onChange={(e) => setData({ ...data, agency: e.currentTarget.value })}
        />
        <label htmlFor="conta">Conta:</label>
        <input
          type="text"
          id="conta"
          required
          value={data.account}
          onChange={(e) => setData({ ...data, account: e.currentTarget.value })}
        />
        <label htmlFor="ano">Ano:</label>
        <input
          type="text"
          id="ano"
          required
          value={data.year}
          onChange={(e) => setData({ ...data, year: e.currentTarget.value })}
        />
        <label htmlFor="saldo">Saldo:</label>
        <input
          type="text"
          id="saldo"
          required
          value={data.balance}
          onChange={(e) => setData({ ...data, balance: e.currentTarget.value })}
        />
        <button type="submit">converter</button>
      </form>
    </div>
  );
}

export default App;
