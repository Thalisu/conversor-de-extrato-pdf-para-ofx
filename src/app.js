import getData from "./scripts/getData.js";
import formatData from "./scripts/formatData.js";

const form = document.querySelector(".formContainer");
form.addEventListener("submit", (e) => handleSubmit(e));

function handleSubmit(e) {
  e.preventDefault();

  const extrato = document.querySelector("#textArea");
  const rawData = extrato.value.split(/[\s\n]+/);
  const data = getData(rawData);

  const banco = document.querySelector("#banco").value;
  const bankId = document.querySelector("#bankId").value;

  const agencia = document.querySelector("#agencia");
  const conta = document.querySelector("#conta");
  const account = `${agencia.value}${conta.value.replace(/[.,-]/g, "")}`;
  console.log(account);

  const ano = document.querySelector("#ano").value;

  const firstData = `${ano}${data[0][0].replace("/", "")}`;
  const lastData = `${ano}${data[data.length - 1][0].replace("/", "")}`;

  const saldo = document.querySelector("#saldo").value;

  formatData(
    data,
    banco,
    bankId,
    account,
    ano,
    firstData,
    lastData,
    saldo
  );
}
