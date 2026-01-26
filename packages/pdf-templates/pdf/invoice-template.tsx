import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  CustomerDetailModel,
  InvoiceInformation,
  InvoiceLineCreateData,
} from "@repo/shared-types";
import dayjs from "dayjs";
import { formatPrice, getMediaUrl } from "../utils/utils.js";

const styles = StyleSheet.create({
  page: {
    margin: 10,
    padding: 10,
    flex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    marginBottom: "25px",
  },
  containerLogo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
  },
  logo: {
    width: "50px",
    height: "50px",
    objectFit: "contain",
  },
  containerHeader: {
    width: "95%",
    padding: 0,
  },
  containerInfo: {
    backgroundColor: "#DDEAE0",
    padding: "10px",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderStyle: "solid",
    borderWidth: 1,
    borderBottom: 0,
    borderColor: "#3e6450",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  table: {
    width: "95%",
    marginTop: 25,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "33%",
    backgroundColor: "#3e6450",
    border: "1px solid #000",
    padding: 5,
    color: "white",
  },
  tableCol: {
    width: "33%",
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
    padding: 5,
  },
  text: {
    fontSize: 10,
  },
  textImportant: {
    fontSize: 12,
  },
  tableCellHeader: {
    backgroundColor: "#3e6450",
    color: "white",
  },
  textTVA: {
    fontSize: 8,
    marginTop: 25,
  },
  TVAContainer: {
    width: "95%",
  },
  tableResume: {
    width: "30%",
    marginTop: 25,
    marginLeft: "auto",
    marginRight: "5%",
  },
  informationCustomerContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,
    borderColor: "#3e5460",
    borderWidth: 1,
  },
  informationContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "3e6450",
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#DDEAE0",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  title: {
    marginTop: "20px",
  },
  enterpriseName: {
    maxWidth: "250px",
  },
});

export function InvoiceTemplate({
  title,
  number,
  customer,
  date,
  lines,
  information,
  maskName,
  excludeTva,
  devisNumber,
  devisDate,
  apiUrl
}: {
  title?: string;
  number?: string;
  date?: Date;
  customer?: CustomerDetailModel;
  lines: InvoiceLineCreateData[];
  information?: InvoiceInformation;
  maskName?: boolean;
  excludeTva?: boolean;
  devisNumber?: string;
  devisDate?: Date;
  apiUrl: string;
}) {
  const sum = (values: number[]) => {
    let result = 0;
    values.map((v) => {
      result += v;
    });
    return result;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.containerLogo}>
            {information?.enterprise.mediaId && (
              <Image
                src={getMediaUrl(apiUrl, information?.enterprise.mediaId)}
                style={styles.logo}
              />
            )}
            {!maskName && information?.enterprise.mediaId && (
              <Text>{information?.enterprise.name}</Text>
            )}
          </View>
        </View>
        <View style={styles.containerHeader}>
          <View style={styles.containerInfo}>
            <Text style={styles.textImportant}>
              Facture n°{information?.prefixe}-{String(number).padStart(5, "0")}
            </Text>
            <View>
              <Text style={[styles.text]}>
                Date : {date ? dayjs(date).format("DD/MM/YYYY") : ""}
              </Text>
              <Text style={styles.text}>Paiement à la réception</Text>
            </View>
          </View>
          <View style={styles.informationContainer}>
            <View>
              <Text style={[styles.textImportant, styles.enterpriseName]}>
                {information?.enterprise.name}
              </Text>
              <Text
                style={styles.text}
              >{`${information?.enterprise.zipCode}, ${information?.enterprise.city}`}</Text>
              <Text style={styles.text}>
                {/* {enterprise?.email} {enterprise?.phone ? `/ ${enterprise.phone}` : ""} */}
              </Text>
              <Text
                style={styles.text}
              >{`Siret: ${information?.enterprise.siret}`}</Text>
              <Text
                style={styles.text}
              >{`n° TVA: ${information?.enterprise.tvaNumber}`}</Text>
            </View>
            {customer && (
              <View style={styles.informationCustomerContainer}>
                <Text style={styles.text}>Facturé à</Text>
                <View>
                  <Text style={[styles.textImportant, styles.enterpriseName]}>
                    {customer?.name}
                  </Text>
                  <Text style={styles.text}>
                    {customer.address} {"\n"}
                    {customer?.zipCode}, {customer?.city}
                  </Text>
                  <Text style={styles.text}>
                    {customer?.email}{" "}
                    {customer?.phone ? `/ ${customer.phone}` : ""}
                  </Text>
                  <Text style={styles.text}>Siret: {customer?.siret}</Text>
                  <Text style={styles.text}>N°TVA: {customer?.tvaNumber}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {devisNumber && (
          <Text style={styles.text}>
            D'après le devis {devisNumber} du{" "}
            {dayjs(devisDate).format("DD/MM/YYYY")}.
          </Text>
        )}

        <Text style={styles.title}>{title}</Text>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, width: "100%" }}>
              <Text style={styles.text}>Désignation</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.text}>Quantité</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.text}>Prix Unit.</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.text}>Prix HT</Text>
            </View>
          </View>

          {/* Rows */}
          <>
            {lines &&
              lines.length > 0 &&
              lines.map((line, index) => {
                const name = line?.name ?? "";
                const quantity = line?.quantity ?? 0;
                const unitPrice = line?.unitPrice ?? 0;

                return (
                  <View style={styles.tableRow} key={index}>
                    <View style={{ ...styles.tableCol, width: "100%" }}>
                      <Text style={styles.text}>{name}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.text}>{quantity}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.text}>
                        {formatPrice(unitPrice, "FR-fr", "EUR")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.text}>
                        {formatPrice(unitPrice * quantity, "FR-fr", "EUR")}
                      </Text>
                    </View>
                  </View>
                );
              })}
          </>
        </View>

        <View style={styles.tableResume}>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, width: "50%" }}>
              <Text style={styles.text}>Total HT</Text>
            </View>
            <View
              style={{ ...styles.tableCol, width: "50%", borderTopWidth: 1 }}
            >
              <Text style={styles.text}>
                {formatPrice(
                  sum(lines.map((e) => e.quantity * e.unitPrice)),
                  "FR-fr",
                  "EUR"
                )}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, width: "50%" }}>
              <Text style={styles.text}>TVA</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "50%" }}>
              <Text style={styles.text}>{excludeTva ? "0.00%" : "20.00%"}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, width: "50%" }}>
              <Text style={styles.text}>Total TTC</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "50%" }}>
              <Text style={styles.text}>
                {formatPrice(
                  sum(lines.map((e) => e.quantity * e.unitPrice)) *
                    (excludeTva ? 1 : 1.2),
                  "FR-fr",
                  "EUR"
                )}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.TVAContainer}>
          {excludeTva ? (
            <Text style={styles.textTVA}>
              TVA non applicable, article 293 B du CGI. Paiement sous 30 jours à
              compter de la date de facture. Tout retard de paiement entraînera
              des pénalités au taux de 10% annuel, ainsi qu'une indemnité
              forfaitaire de 40 € pour frais de recouvrement (article L441-10 du
              Code de commerce).
            </Text>
          ) : (
            <Text style={styles.textTVA}>
              Paiement sous 30 jours à compter de la date de facture. Tout
              retard de paiement entraînera des pénalités au taux de 10% annuel,
              ainsi qu'une indemnité forfaitaire de 40 € pour frais de
              recouvrement (article L441-10 du Code de commerce).
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};
