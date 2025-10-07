import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function formatDate(dateString: string) {
  const d = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function buildTableData(apiData: any) {
  if (!apiData || !Array.isArray(apiData.responses)) {
    return { headers: [], rows: [] };
  }
  const responses = apiData.responses;

  // Lấy tất cả các câu hỏi duy nhất từ responses
  const questionMap: Record<string, string> = {};
  responses.forEach((resp: any) => {
    resp.answers.forEach((ans: any) => {
      questionMap[ans.questionId] = ans.questionText;
    });
  });
  const questionIds = Object.keys(questionMap);
  const headers = [
    "submitted_at",
    ...questionIds.map((qid) => questionMap[qid]),
  ];

  // Tạo từng dòng dữ liệu
  const rows = responses.map((resp: any) => {
    // Map answer theo questionId
    const answerMap: Record<string, any> = {};
    resp.answers.forEach((ans: any) => {
      answerMap[ans.questionId] = ans;
    });
    const row = [formatDate(resp.submittedAt)];
    questionIds.forEach((qid) => {
      const ans = answerMap[qid];
      if (!ans) {
        row.push("");
        return;
      }

      // Xử lý matrix questions
      if (ans.type === "matrix_choice" && Array.isArray(ans.answer)) {
        const matrixText = ans.answer
          .map((cell: any) => `${cell.row}: ${cell.column}`)
          .join("; ");
        row.push(matrixText);
        return;
      }

      if (ans.type === "matrix_input" && Array.isArray(ans.answer)) {
        const matrixText = ans.answer
          .map((cell: any) => `${cell.row} - ${cell.column}: ${cell.value}`)
          .join("; ");
        row.push(matrixText);
        return;
      }

      if (Array.isArray(ans.answer)) {
        const processed = ans.answer.map((txt: string) =>
          txt.startsWith("Other: ") ? txt.slice(7) : txt
        );
        row.push(processed.join(", "));
      } else {
        const value =
          typeof ans.answer === "string" && ans.answer.startsWith("Other: ")
            ? ans.answer.slice(7)
            : ans.answer || "";
        row.push(value);
      }
    });
    return row;
  });

  return { headers, rows };
}

export function exportCSV(
  headers: string[],
  rows: string[][],
  fileName: string
) {
  let csv = headers.join(",") + "\n";
  rows.forEach((row) => {
    csv += row.map((cell) => `"${cell}"`).join(",") + "\n";
  });
  // Thêm BOM để Excel nhận đúng UTF-8
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, fileName);
}
