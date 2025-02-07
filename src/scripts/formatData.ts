import download from "./download.ts";
export default function formatData(
  data: { date: string; desc: string; amount: string }[],
  banco: string,
  bankId: string,
  account: string,
  firstData: string,
  lastData: string,
  saldo: string,
  ano: string
) {
  console.log(data);
  const formatedData = `OFXHEADER:100
  DATA:OFXSGML
  VERSION:102
  SECURITY:NONE
  ENCODING:USASCII
  CHARSET:1252
  COMPRESSION:NONE
  OLDFILEUID:NONE
  NEWFILEUID:NONE
  <OFX>
      <SIGNONMSGSRSV1>
          <SONRS>
              <STATUS>
                  <CODE>0
                  <SEVERITY>INFO
              </STATUS>
              <DTSERVER>${lastData}000000[-3:GMT]
              <LANGUAGE>ENG
              <FI>
                  <ORG>${banco}
                  <FID>${banco}
              </FI>
          </SONRS>
      </SIGNONMSGSRSV1>
      <BANKMSGSRSV1>
          <STMTTRNRS>
              <TRNUID>1
              <STATUS>
                  <CODE>0
                  <SEVERITY>INFO
              </STATUS>
              <STMTRS>
                  <CURDEF>BRL
                  <BANKACCTFROM>
                      <BANKID>${bankId}
                      <ACCTID>${account}
                      <ACCTTYPE>CHECKING
                  </BANKACCTFROM>
                  <BANKTRANLIST>
                      <DTSTART>${firstData}000000[-3:GMT]
                      <DTEND>${lastData}000000[-3:GMT]
                        ${data
                          .map(
                            (values) =>
                              `<STMTTRN>
                            <TRNTYPE>OTHER
                            <DTPOSTED>${
                              values.date.length === 8
                                ? values.date
                                : `${ano}${values.date}`
                            }000000[-3:GMT]
                            <TRNAMT>${values.amount}
                            <PAYEEID>0
                            <MEMO>${values.desc}
                            </STMTTRN>`
                          )
                          .join("")}
                  </BANKTRANLIST>
                  <LEDGERBAL>
                      <BALAMT>${saldo}
                      <DTASOF>${lastData}000000[-3:GMT]
                  </LEDGERBAL>
              </STMTRS>
          </STMTTRNRS>
      </BANKMSGSRSV1>
  </OFX>`;
  download("dados.ofx", formatedData);
}
