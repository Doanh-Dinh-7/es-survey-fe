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
  matrixTable: {
    display: "flex",
    flexDirection: "column",
    marginTop: 8,
    marginBottom: 12,
    border: "1px solid #CBD5E0",
    borderRadius: 4,
  },
  matrixHeaderRow: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#EDF2F7",
    borderBottom: "2px solid #CBD5E0",
  },
  matrixRow: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid #E2E8F0",
  },
  matrixCell: {
    padding: 6,
    fontSize: 9,
    borderRight: "1px solid #E2E8F0",
    fontFamily: "Roboto",
  },
  matrixHeaderCell: {
    padding: 6,
    fontSize: 10,
    fontWeight: "bold",
    borderRight: "1px solid #CBD5E0",
    fontFamily: "Roboto",
  },
  matrixValueCell: {
    padding: 6,
    fontSize: 9,
    textAlign: "center",
    borderRight: "1px solid #E2E8F0",
    fontFamily: "Roboto",
  },
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
            {q.type === "matrix_choice" && q.summary && (
              <View style={styles.matrixTable}>
                {/* Header Row */}
                <View style={styles.matrixHeaderRow}>
                  <Text style={{ ...styles.matrixHeaderCell, flex: 2 }}>
                    Questions
                  </Text>
                  {q.summary?.[0]?.columns?.map((col: any, colIdx: number) => (
                    <Text
                      key={colIdx}
                      style={{ ...styles.matrixHeaderCell, flex: 1 }}
                    >
                      {col.columnLabel}
                    </Text>
                  ))}
                </View>
                {/* Data Rows */}
                {q.summary?.map((row: any, rowIdx: number) => (
                  <View key={rowIdx} style={styles.matrixRow}>
                    <Text
                      style={{
                        ...styles.matrixCell,
                        flex: 2,
                        fontWeight: "bold",
                      }}
                    >
                      {row.rowLabel}
                    </Text>
                    {row.columns?.map((col: any, colIdx: number) => (
                      <View
                        key={colIdx}
                        style={{ ...styles.matrixValueCell, flex: 1 }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: "bold",
                            color: "#3182CE",
                          }}
                        >
                          {col.count}
                        </Text>
                        <Text style={{ fontSize: 8, color: "#718096" }}>
                          ({col.percentage}%)
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}
            {q.type === "matrix_input" && q.summary && (
              <View style={styles.matrixTable}>
                {/* Header Row */}
                <View style={styles.matrixHeaderRow}>
                  <Text style={{ ...styles.matrixHeaderCell, flex: 2 }}>
                    Questions
                  </Text>
                  {q.summary?.[0]?.columns?.map((col: any, colIdx: number) => (
                    <Text
                      key={colIdx}
                      style={{ ...styles.matrixHeaderCell, flex: 2 }}
                    >
                      {col.columnLabel}
                    </Text>
                  ))}
                </View>
                {/* Data Rows */}
                {q.summary?.map((row: any, rowIdx: number) => (
                  <View key={rowIdx} style={styles.matrixRow}>
                    <Text
                      style={{
                        ...styles.matrixCell,
                        flex: 2,
                        fontWeight: "bold",
                      }}
                    >
                      {row.rowLabel}
                    </Text>
                    {row.columns?.map((col: any, colIdx: number) => (
                      <View
                        key={colIdx}
                        style={{ ...styles.matrixCell, flex: 2 }}
                      >
                        <Text
                          style={{
                            fontSize: 8,
                            color: "#38A169",
                            fontWeight: "bold",
                            marginBottom: 2,
                          }}
                        >
                          {col.count} responses
                        </Text>
                        {col.answers
                          ?.slice(0, 2)
                          .map((ans: string, ansIdx: number) => (
                            <Text
                              key={ansIdx}
                              style={{
                                fontSize: 7,
                                color: "#4A5568",
                                marginBottom: 1,
                              }}
                            >
                              •{" "}
                              {ans.length > 30
                                ? ans.substring(0, 30) + "..."
                                : ans}
                            </Text>
                          ))}
                        {col.answers?.length > 2 && (
                          <Text
                            style={{
                              fontSize: 7,
                              color: "#3182CE",
                              marginTop: 1,
                            }}
                          >
                            +{col.answers.length - 2} more
                          </Text>
                        )}
                      </View>
                    ))}
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
