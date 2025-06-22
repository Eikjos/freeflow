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
  containerInfo: {
    borderWidth: 2,
    borderColor: "#442233",
    borderStyle: "dotted",
    padding: "10px",
    borderRadius: 10,
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
  tableCell: {
    fontSize: 10,
  },
  tableCellHeader: {
    backgroundColor: "#3e6450",
    color: "white",
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
        <View style={styles.containerInfo}>
          <Text style={{ fontSize: 12 }}>Facture n° 2025-000XXX</Text>
          <Text style={{ fontSize: 10, textAlign: "right" }}>
            Date : 10/05/2025
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "95%",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontSize: 12 }}>Nom de l'enterprise</Text>
          <Text style={{ fontSize: 10 }}>CP, Ville</Text>
          <Text style={{ fontSize: 10 }}>Téléphone / Email</Text>
          <Text style={{ fontSize: 10 }}>Siret: 443141431531513</Text>
          <Text style={{ fontSize: 10 }}>N°TVA: FR76EKF?ZLFA$</Text>
        </View>
        <View style={{ marginTop: "50px" }}>
          <Text style={{ fontSize: 12 }}>Nom de l'enterprise</Text>
          <Text style={{ fontSize: 10 }}>CP, Ville</Text>
          <Text style={{ fontSize: 10 }}>Téléphone / Email</Text>
          <Text style={{ fontSize: 10 }}>Siret: 443141431531513</Text>
          <Text style={{ fontSize: 10 }}>N°TVA: FR76EKF?ZLFA$</Text>
        </View>
      </View>
      <Text style={{ marginTop: "20px" }}>
        Facture sur l'évolution de juin 2025
      </Text>
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableColHeader, width: "100%" }}>
            <Text style={styles.tableCell}>Désignation</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Quantité</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Prix Unit.</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Prix HT</Text>
          </View>
        </View>

        {/* Row 1 */}
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: "100%" }}>
            <Text style={styles.tableCell}>Alice</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>30</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>25</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>France</Text>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: "100%" }}>
            <Text style={styles.tableCell}>Bob</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>30</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>30</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Canada</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          width: "30%",
          marginTop: 25,
          marginLeft: "auto",
          marginRight: "5%",
        }}
      >
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableColHeader, width: "50%" }}>
            <Text style={styles.tableCell}>Total HT</Text>
          </View>
          <View style={{ ...styles.tableCol, width: "50%" }}>
            <Text style={styles.tableCell}>225.00 $</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableColHeader, width: "50%" }}>
            <Text style={styles.tableCell}>Total HT</Text>
          </View>
          <View style={{ ...styles.tableCol, width: "50%" }}>
            <Text style={styles.tableCell}>225.00 $</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableColHeader, width: "50%" }}>
            <Text style={styles.tableCell}>Total HT</Text>
          </View>
          <View style={{ ...styles.tableCol, width: "50%" }}>
            <Text style={styles.tableCell}>225.00 $</Text>
          </View>
        </View>
      </View>
      <Text style={{ fontSize: 8, marginTop: 25 }}>
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
