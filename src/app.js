import PDFDataFormatter from "./scripts/PDFDataFormatter.js";
import formatData from "./scripts/formatData.js";

const form = document.querySelector(".formContainer");
form.addEventListener("submit", (e) => handleSubmit(e));

function handleSubmit(e) {
  e.preventDefault();

  const bank = JSON.parse(document.querySelector("#banco").value);

  const rawData = document.querySelector("#textArea")?.value;
  if (!rawData) return;

  const ano = document.querySelector("#ano").value;

  const formatter = new PDFDataFormatter(rawData, bank.name, ano);

  const data = formatter.get(rawData);

  const agencia = document.querySelector("#agencia");
  const conta = document.querySelector("#conta");
  const account = `${agencia.value}${conta.value.replace(/[.,-]/g, "")}`;

  const firstDate = `${data[0].date.length === 8 ? "" : ano}${data[0].date}`;

  const lastDate = `${data[data.length - 1].date.length === 8 ? "" : ano}
  ${data[data.length - 1].date}
  `;

  const saldo = document.querySelector("#saldo").value;

  formatData(data, bank.name, bank.id, account, firstDate, lastDate, saldo);
}
