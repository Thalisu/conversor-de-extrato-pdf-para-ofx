import { IFormData } from "../App.js";
import PDFDataFormatter from "./PDFDataFormatter.js";
import formatData from "./formatData.js";

export default function handleSubmit(e: React.FormEvent, formData: IFormData) {
  e.preventDefault();

  const bank = JSON.parse(formData.bank);

  const formatter = new PDFDataFormatter(
    formData.extract,
    bank.name,
    formData.year
  );

  const data = formatter.get();
  if (!data) {
    window.alert("Erro ao extrair os dados do extrato");
    throw new Error("Nao foi possivel extrair os dados do extrato");
  }

  const account = `${formData.agency}${formData.account.replace(/[.,-]/g, "")}`;

  const firstDate = `${data[0].date.length === 8 ? "" : formData.year}${
    data[0].date
  }`;

  const lastDate = `${
    data[data.length - 1].date.length === 8 ? "" : formData.year
  }
  ${data[data.length - 1].date}
  `;

  const saldo = formData.balance;

  formatData(
    data,
    bank.name,
    bank.id,
    account,
    firstDate.trim(),
    lastDate.trim(),
    saldo,
    formData.year
  );
}
