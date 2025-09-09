import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import robotoFont from "../../../../assets/fonts/Roboto-Regular.ttf";

const COLORS = [
  "#3182CE",
  "#34A853",
  "#FBBC05",
  "#EA4335",
  "#A259FF",
  "#FF6F00",
  "#00B8D9",
  "#FF4081",
  "#7C4DFF",
  "#00C853",
];

// Đăng ký phông chữ
Font.register({
  family: "Roboto",
  src: robotoFont, // Đảm bảo đường dẫn này đúng với vị trí tệp phông chữ của bạn
});

const styles = StyleSheet.create({
  page: { padding: 24, fontFamily: "Roboto" }, // Áp dụng phông chữ Roboto cho toàn bộ trang
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Roboto", // Áp dụng phông chữ
  },
  ai: { color: "#3182CE", fontSize: 9, marginBottom: 8, fontFamily: "Roboto" }, // Áp dụng phông chữ
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 2,
    fontFamily: "Roboto", // Áp dụng phông chữ
  },
  responses: {
    fontSize: 10,
    color: "#888",
    marginBottom: 4,
    fontFamily: "Roboto",
  }, // Áp dụng phông chữ
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  optionText: { fontSize: 12, fontFamily: "Roboto" }, // Áp dụng phông chữ
  percent: { fontSize: 12, fontFamily: "Roboto" }, // Áp dụng phông chữ
  progressBarBg: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginTop: 2,
    marginBottom: 2,
  },
  progressBar: { height: 8, borderRadius: 4 },
  answerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
    fontSize: 9,
    padding: 4,
  },
  pieImage: { width: 200, height: 200, margin: "0 auto", marginBottom: 8 },
  barImage: { width: 400, height: 200, margin: "0 auto", marginBottom: 8 },
  table: { fontFamily: "Roboto" },
});

const ExportSurveyPreview = ({
  survey,
  isPdf,
  headers,
  rows,
  pieImages,
  barImages,
}: any) => {
  if (!isPdf) {
    // CSV preview
    return (
      <Table size="sm">
        <Thead>
          <Tr>
            {headers.map((h: string, idx: number) => (
              <Th key={idx}>{h}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row: string[], i: number) => (
            <Tr key={i}>
              {row.map((cell: string, j: number) => (
                <Td key={j}>{cell}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  }

  // PDF preview
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{survey.title}</Text>
        {survey.aiAnalysis && (
          <Text style={styles.ai}>{survey.aiAnalysis}</Text>
        )}
        {survey.questions.map((q: any, idx: number) => (
          <View key={q.questionId} wrap={false}>
            <Text style={styles.question}>{`${idx + 1}. ${
              q.questionText
            }`}</Text>
            <Text style={styles.responses}>{q.totalResponses} responses</Text>
            {q.type === "multiple_choice" && q.summary && (
              <View>
                {pieImages && pieImages[idx] && (
                  <Image src={pieImages[idx]} style={styles.pieImage} />
                )}
                {q.summary.map((opt: any, i: number) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <View style={styles.optionRow}>
                      <Text style={styles.optionText}>{opt.optionText}</Text>
                      <Text style={styles.percent}>{opt.percentage}%</Text>
                    </View>
                    {/* Progress bar */}
                    <View style={styles.progressBarBg}>
                      <View
                        style={{
                          ...styles.progressBar,
                          width: `${opt.percentage}%`,
                          backgroundColor: COLORS[i % COLORS.length],
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}
            {q.type === "checkbox" && q.summary && (
              <View>
                {barImages && barImages[idx] && (
                  <Image src={barImages[idx]} style={styles.barImage} />
                )}
                {q.summary.map((opt: any, i: number) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <View style={styles.optionRow}>
                      <Text style={styles.optionText}>{opt.optionText}</Text>
                      <Text style={styles.percent}>{opt.percentage}%</Text>
                    </View>
                    {/* Progress bar */}
                    <View style={styles.progressBarBg}>
                      <View
                        style={{
                          ...styles.progressBar,
                          width: `${opt.percentage}%`,
                          backgroundColor: COLORS[i % COLORS.length],
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}
            {(q.type === "short_text" || q.type === "long_text") &&
              q.summary && (
                <View>
                  {q.summary.map((ans: any, i: number) => (
                    <View style={styles.answerBox} key={i}>
                      <Text>
                        {"- "}
                        {ans.value}
                      </Text>
                      <Text
                        style={{
                          fontSize: 9,
                          color: "#3182CE",
                          textAlign: "right",
                        }}
                      >
                        {ans.count} RESPONSES
                      </Text>
                    </View>
                  ))}
                </View>
              )}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default ExportSurveyPreview;
