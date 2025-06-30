import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// Create styles
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
});

// Create Document Component
const InvoiceTemplate = ({ title }: { title?: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.containerLogo}>
          <Image src={"/assets/freeflow.png"} style={styles.logo} />
          <Text>Freeflow</Text>
        </View>
      </View>
      <View style={styles.containerHeader}>
        <View style={styles.containerInfo}>
          <Text style={styles.textImportant}>Facture n° 2025-000XXX</Text>
          <View>
            <Text style={[styles.text]}>Date : 10/05/2025</Text>
            <Text style={styles.text}>Paiement à la réception</Text>
          </View>
        </View>
        <View style={styles.informationContainer}>
          <View>
            <Text style={styles.textImportant}>Nom de l'enterprise</Text>
            <Text style={styles.text}>CP, Ville</Text>
            <Text style={styles.text}>Téléphone / Email</Text>
            <Text style={styles.text}>Siret: 443141431531513</Text>
            <Text style={styles.text}>N°TVA: FR76EKF?ZLFA$</Text>
          </View>
          <View style={styles.informationCustomerContainer}>
            <Text style={styles.text}>Facturé à</Text>
            <View>
              <Text style={styles.textImportant}>Nom de l'enterprise</Text>
              <Text style={styles.text}>CP, Ville</Text>
              <Text style={styles.text}>Téléphone / Email</Text>
              <Text style={styles.text}>Siret: 443141431531513</Text>
              <Text style={styles.text}>N°TVA: FR76EKF?ZLFA$</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.title}>Facture sur l'évolution de juin 2025</Text>
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

        {/* Row 1 */}
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: "100%" }}>
            <Text style={styles.text}>Alice</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.text}>30</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.text}>25</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.text}>France</Text>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: "100%" }}>
            <Text style={styles.text}>Bob</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.text}>30</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.text}>30</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.text}>Canada</Text>
          </View>
        </View>
      </View>

      <View style={styles.tableResume}>
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableColHeader, width: "50%" }}>
            <Text style={styles.text}>Total HT</Text>
          </View>
          <View style={{ ...styles.tableCol, width: "50%", borderTopWidth: 1 }}>
            <Text style={styles.text}>225.00$</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableColHeader, width: "50%" }}>
            <Text style={styles.text}>TVA</Text>
          </View>
          <View style={{ ...styles.tableCol, width: "50%" }}>
            <Text style={styles.text}>20.00%</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableColHeader, width: "50%" }}>
            <Text style={styles.text}>Total TTC</Text>
          </View>
          <View style={{ ...styles.tableCol, width: "50%" }}>
            <Text style={styles.text}>225.00$</Text>
          </View>
        </View>
      </View>
      <Text style={styles.textTVA}>
        TVA non applicable, article 293 B du CGI. Paiement sous 30 jours à
        compter de la date de facture. Tout retard de paiement entraînera des
        pénalités au taux de 10% annuel, ainsi qu'une indemnité forfaitaire de
        40 € pour frais de recouvrement (article L441-10 du Code de commerce).
        Coordonnées bancaires : FR76 3000 4000 5000 0000 0000 123 - Titulaire :
        Jean Dupont
      </Text>
    </Page>
  </Document>
);

export default InvoiceTemplate;
