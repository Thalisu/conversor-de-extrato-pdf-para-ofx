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
        return this.santander();
      case "SICOOB":
        return this.sicoob();
      default:
        throw new Error("Banco nao encontrado");
    }
  }

  santander() {
    const santanderRegex =
      /\b(?:(\d{2}\/\d{2})\s)?([\W\w]*?)(\d{1,3}(?:\.\d{3})*,\d{2}-?)/;

    let prevData = null;

    const data = this.rawData
      .match(RegExp(santanderRegex, "g"))
      .map((value) => {
        if (value.includes("Saldo")) {
          return null;
        }
        const groups = value.match(santanderRegex);
        let date = groups[1]?.trim().split("/").reverse().join("");
        if (date) {
          prevData = date;
        } else {
          date = prevData;
        }

        if (date === null) {
          return null;
        }

        const desc = groups[2]?.replace(/[0-9\/\n-]/g, "");

        return {
          date: date,
          desc: desc,
          amount: this.#treatValues(`${groups[3]?.trim() || ""}`),
        };
      });

    return data.filter((value) => {
      if (value !== null) {
        if (value.desc === "") {
          return false;
        }
        return true;
      }
      return false;
    });
  }

  sicoob() {
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
