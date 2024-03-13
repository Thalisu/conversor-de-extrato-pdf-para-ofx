var { pdfjsLib } = globalThis;
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://npmcdn.com/pdfjs-dist@4.0.379/build/pdf.worker.mjs";

async function pdfToTxt(file) {
  const pdf = await pdfjsLib.getDocument(file).promise;

  return Promise.all(
    [...Array(pdf.numPages).keys()].map(async (num) =>
      (await (await pdf.getPage(num + 1)).getTextContent()).items
        .map((item) => item.str)
        .join(" ")
    )
  ).then((pages) => pages.join("\n"));
}

function convert() {
  var fr = new FileReader();
  fr.onload = async function () {
    console.log(fr.result);
    const pdf = await pdfToTxt(fr.result);
    console.log(pdf);
  };
  fr.readAsDataURL(document.getElementById("pdffile").files[0]);
}
