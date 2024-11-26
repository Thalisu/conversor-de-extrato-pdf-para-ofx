export default class PDFDataFormatter {
  rawData = "";
  banco = "";
  ano = "";

  constructor(rawData, banco, ano) {
    this.ano = ano;
    this.rawData = rawData;
    this.banco = banco;
  }

  get() {
    switch (this.banco) {
      case "SANTANDER":
        return this.#santader();
      case "SICOOB":
        return this.#sicoob();
      default:
        throw new Error("Banco nao encontrado");
    }
  }

  #santader() {
    const dateRegex = /^\d{2}\/\d{2}$/;
    const descRegex = /([a-zA-Z]+-*)+/;
    const valueRegex = /(^-?(\d{0,3}\.)?(\d{0,3}\.)?\d{0,3}\,\d{2}-?$)+/;

    this.rawData = this.rawData;

    let skip = 0;
    desc = "";

    const data = this.rawData.split(/[\s\n]+/).map((value) => {
      if (skip === 1 && value.includes("Débitos")) {
        skip = 0;
        return;
      }
      if (skip === 1 || value.includes("Extrato")) {
        skip = 1;
        return;
      }

      if (dateRegex.test(value)) {
        date = `${this.ano}${value.split("/").reverse().join("")}`;
      }

      if (descRegex.test(value)) {
        desc += desc ? ` ${value}` : value;
      }

      if (valueRegex.test(value) && desc !== "") {
        mov = value;
        if (mov.includes("-")) {
          mov = `-${mov.replace("-", "")}`;
        }

        return {
          date,
          desc,
          mov,
        };
      }
    });
    return data.filter((value) => value !== undefined);
  }

  #sicoob() {
    const sicoobRegex = /(\d{2}\/\d{2}\/\d{4})(.*?)(\-)*R\$.*?([\d.,]+)/;
    const data = this.rawData.match(RegExp(sicoobRegex, "g")).map((value) => {
      if (value.includes("Saldo")) {
        return null;
      }
      const groups = value.match(sicoobRegex);

      return {
        date: groups[1].trim().split("/").reverse().join(""),
        desc: groups[2],
        amount: this.#treatValues(
          `${groups[3]?.trim() || ""}${groups[4].trim()}`
        ),
      };
    });

    return data.filter((value) => value !== null);
  }

  #treatValues(value, decimalIndicator = ",") {
    let newValue = value.split(decimalIndicator);
    if (newValue.length !== 2) {
      newValue[1] = "00";
    }
    if (newValue[1].length > 2) {
      newValue[1] = newValue[1].slice(0, 2);
    }

    if (decimalIndicator === ",") {
      newValue[0] = newValue[0].replaceAll(".", "");
    } else {
      newValue[0] = newValue[0].replaceAll(",", "");
    }

    return newValue.join(".");
  }
}
