export default class PDFDataFormatter {
  rawData: string;
  bank: string;
  year: string;

  constructor(rawData: string, bank: string, year: string) {
    this.year = year;
    this.rawData = rawData;
    this.bank = bank;
  }

  get() {
    switch (this.bank) {
      case "SANTANDER":
        return this.santander();
      case "SICOOB":
        return this.sicoob();
      default:
        throw new Error("Banco nao encontrado");
    }
  }

  santander(): { date: string; desc: string; amount: string }[] {
    const santanderRegex =
      /\b(?:(\d{2}\/\d{2})\s)?([\W\w]*?)(\d{1,3}(?:\.\d{3})*,\d{2}-?)/;
    const skippableValues = [
      "Créditos",
      "Saldo",
      "Débitos",
      "SALDO",
      "saldo",
      "Sim",
      "Débito",
      "Acumulado",
    ];

    let prevDate: string | null = null;

    const matches = this.rawData.match(RegExp(santanderRegex, "g"));
    if (!matches) {
      window.alert("Erro ao extrair os dados do extrato");
      throw new Error("Nao foi possivel extrair os dados do extrato");
    }

    const data = matches.map((value) => {
      if (
        skippableValues.some((skippableValue) => value.includes(skippableValue))
      ) {
        return null;
      }

      const groups = value.match(santanderRegex) as string[];
      if (!groups || groups.length < 4) {
        return null;
      }

      let date: string | null =
        groups[1]?.trim().split("/").reverse().join("") ?? null;
      if (date) {
        prevDate = date;
      } else {
        date = prevDate;
      }

      if (date === null) {
        return null;
      }

      const desc = groups[2]?.replace(/[0-9/\n-]/g, "");
      if (desc === "" || desc.replace(/\s/g, "") === "") return null;

      if (!groups[3]) return null;

      if (groups[3].includes("-")) {
        groups[3] = `-${groups[3].replace(/-/g, "")}`;
      }

      return {
        date: date.trim(),
        desc: desc.trim(),
        amount: this.#treatValues(groups[3].trim()),
      };
    });

    return data.filter((value) => value !== null);
  }

  sicoob() {
    const sicoobRegex = /(\d{2}\/\d{2}\/\d{4})(.*?)(-)*R\$.*?([\d.,]+)/;
    const matches = this.rawData.match(RegExp(sicoobRegex, "g"));
    if (!matches) {
      window.alert("Erro ao extrair os dados do extrato");
      throw new Error("Nao foi possivel extrair os dados do extrato");
    }
    const data = matches.map((value) => {
      if (value.includes("Saldo")) {
        return null;
      }
      const groups = value.match(sicoobRegex);
      if (!groups || groups.length < 4) {
        return null;
      }

      return {
        date: groups[1]?.trim().split("/").reverse().join(""),
        desc: groups[2],
        amount: this.#treatValues(
          `${groups[3]?.trim() || ""}${groups[4].trim()}`
        ),
      };
    });

    return data.filter((value) => value !== null);
  }

  #treatValues(value: string, decimalIndicator = ",") {
    const newValue = value.split(decimalIndicator);
    if (newValue.length !== 2) {
      newValue[1] = "00";
    }
    if (newValue[1].length > 2) {
      newValue[1] = newValue[1].slice(0, 2);
    }

    if (decimalIndicator === ",") {
      newValue[0] = newValue[0].replace(/\./g, "");
    } else {
      newValue[0] = newValue[0].replace(/,/g, "");
    }

    return newValue.join(".");
  }
}
