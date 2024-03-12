export default function getData(rawData) {
  const dateRegex = /^\d{2}\/\d{2}$/;
  const descRegex = /([a-zA-Z]+-*)+/;
  const valueRegex = /(^-?(\d{0,3}\.)?(\d{0,3}\.)?\d{0,3}\,\d{2}-?$)+/;

  const data = [];
  let date = "";
  let desc = "";
  let mov = "";
  let skip = 0;

  rawData.map((value) => {
    if (skip === 1 && value.includes("Débitos")) {
      skip = 0;
      return;
    }
    if (skip === 1 || value.includes("Extrato")) {
      skip = 1;
      return;
    }

    if (dateRegex.test(value)) {
      date = value.split("/").reverse().join("/");
    }

    if (descRegex.test(value)) {
      desc += desc ? ` ${value}` : value;
    }

    if (valueRegex.test(value) && desc !== "") {
      mov = value;
      if (mov.includes("-")) {
        mov = `-${mov.replace("-", "")}`;
      }
      data.push([date, desc, mov]);

      desc = "";
      mov = "";
    }
  });
  console.log(data);
  return data;
}
