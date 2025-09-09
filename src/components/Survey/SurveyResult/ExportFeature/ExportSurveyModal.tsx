import { useEffect, useState, useRef } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner, ModalCloseButton, Box } from "@chakra-ui/react";
import ExportSurveyPreview from "./ExportSurveyPreview";
import { ListResponseDetailSurvey } from "../../../../services/survey";
import { exportCSV, slugify, buildTableData } from "./exportUtils";
import { FaFileCsv, FaFilePdf } from "react-icons/fa6";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import PieChartToCanvas from "./PieChartToCanvas";
import BarChartToCanvas from "./BarChartToCanvas";

const ExportSurveyModal = ({ isOpen, onClose, survey }: { isOpen: boolean; onClose: () => void; survey: any }) => {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [tab, setTab] = useState<'pdf' | 'csv'>("pdf");
  const [pieImages, setPieImages] = useState<string[]>([]);
  const [barImages, setBarImages] = useState<string[]>([]);
  const [chartsLoading, setChartsLoading] = useState(false);
  const imageCountRef = useRef(0);
  const loadedCountRef = useRef(0);
  const [forceChartRenderKey, setForceChartRenderKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      ListResponseDetailSurvey(survey.surveyId)
        .then(res => setApiData(res.data))
        .finally(() => setLoading(false));
    }
  }, [isOpen, survey.surveyId]);

  // Khi tab là PDF, khởi tạo mảng ảnh và đặt cờ loading
  useEffect(() => {
    if (isOpen && tab === "pdf" && survey && survey.questions) {
      setChartsLoading(true);
      imageCountRef.current = 0;
      loadedCountRef.current = 0;
      const initialPieImages: string[] = Array(survey.questions.length).fill("");
      const initialBarImages: string[] = Array(survey.questions.length).fill("");
      setPieImages(initialPieImages); // Xóa ảnh cũ
      setBarImages(initialBarImages); // Xóa ảnh cũ
      setForceChartRenderKey(prev => prev + 1); // Tăng key để buộc các biểu đồ render lại

      survey.questions.forEach((q: any) => {
        if ((q.type === "multiple_choice" || q.type === "checkbox") && q.summary) {
          imageCountRef.current++;
        }
      });

      if (imageCountRef.current === 0) {
        setChartsLoading(false); // Không có chart nào để load
      }
    } else if (tab === "csv") {
        setChartsLoading(false); // Khi chuyển sang tab CSV, đảm bảo không có loading biểu đồ
    }
  }, [tab, survey, isOpen]);

  // Hàm nhận base64 từ PieChartToCanvas
  const handlePieImage = (idx: number, img: string) => {
    setPieImages(prev => {
      const arr = [...prev];
      arr[idx] = img;
      return arr;
    });
    loadedCountRef.current++;
    if (loadedCountRef.current === imageCountRef.current) {
      setChartsLoading(false);
    }
  };

  // Hàm nhận base64 từ BarChartToCanvas
  const handleBarImage = (idx: number, img: string) => {
    setBarImages(prev => {
      const arr = [...prev];
      arr[idx] = img;
      return arr;
    });
    loadedCountRef.current++;
    if (loadedCountRef.current === imageCountRef.current) {
      setChartsLoading(false);
    }
  };

  // Questions as the Header, Answers as the Rows
  const { headers, rows } = apiData ? buildTableData(apiData) : { headers: [], rows: [] };
  const fileName = slugify(survey.title);

  // PDF xuất thực tế
  const handleExportPDF = async () => {
    setLoading(true);
    // Đảm bảo tất cả các ảnh đã được tạo
    if (chartsLoading) return; // Không xuất nếu charts chưa load xong

    const blob = await pdf(<ExportSurveyPreview survey={survey} isPdf pieImages={pieImages} barImages={barImages} />).toBlob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.pdf`;
    a.click();
    setLoading(false);
  };

  // CSV xuất thực tế
  const handleExportCSV = () => {
    if (headers.length > 0 && rows.length > 0) {
      exportCSV(headers, rows, `${fileName}.csv`);
    } else {
      console.error("No data to export");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxH="85vh" overflowY="auto">
        <ModalHeader textAlign="center">Export Preview</ModalHeader>
        <ModalCloseButton />
        <Box display="flex" justifyContent="center" gap={4} mb={2}>
          <Button leftIcon={<FaFilePdf />} variant="outline" colorScheme={tab === "pdf" ? "red" : "gray"} onClick={() => setTab("pdf")}>PDF</Button>
          <Button leftIcon={<FaFileCsv />} variant="outline" colorScheme={tab === "csv" ? "green" : "gray"} onClick={() => setTab("csv")}>CSV</Button>
        </Box>
        <ModalBody>
          {/* Render PieChartToCanvas/BarChartToCanvas ẩn để lấy base64 cho từng câu hỏi */}
          {tab === "pdf" && survey.questions && survey.questions.map((q: any, idx: number) => {
            if (q.type === "multiple_choice" && q.summary) {
              return (
                <Box key={`pie-box-${q.questionId}-${forceChartRenderKey}`} style={{ position: "fixed", top: -9999, left: -9999, zIndex: -1 }}>
                  <PieChartToCanvas
                    key={`pie-chart-${q.questionId}-${forceChartRenderKey}`}
                    data={q.summary.map((opt: any) => opt.count)}
                    labels={q.summary.map((opt: any) => opt.optionText)}
                    percents={q.summary.map((opt: any) => opt.percentage)}
                    onImage={img => handlePieImage(idx, img)}
                  />
                </Box>
              );
            }
            if (q.type === "checkbox" && q.summary) {
              return (
                <Box key={`bar-box-${q.questionId}-${forceChartRenderKey}`} style={{ position: "fixed", top: -9999, left: -9999, zIndex: -1 }}>
                  <BarChartToCanvas
                    key={`bar-chart-${q.questionId}-${forceChartRenderKey}`}
                    data={q.summary.map((opt: any) => opt.count)}
                    labels={q.summary.map((opt: any) => opt.optionText)}
                    percents={q.summary.map((opt: any) => opt.percentage)}
                    onImage={img => handleBarImage(idx, img)}
                  />
                </Box>
              );
            }
            return null;
          })}
          <Box maxH="85vh" overflowY="auto" border="1px solid #eee" borderRadius="md" p={2} bg="gray.50">
            {loading || chartsLoading ? <Spinner /> : (
              tab === "pdf"
                ? <PDFViewer width="100%" height="700"><ExportSurveyPreview survey={survey} isPdf pieImages={pieImages} barImages={barImages} /></PDFViewer>
                : <ExportSurveyPreview headers={headers} rows={rows} />
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme={tab === "pdf" ? "blue" : "green"}
            onClick={tab === "pdf" ? handleExportPDF : handleExportCSV}
            isLoading={loading || chartsLoading}
          >
            Export
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExportSurveyModal; 