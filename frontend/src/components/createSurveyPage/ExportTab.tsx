import { useParams } from "react-router-dom";
import { useState } from "react";
import { Input, Button, Typography, Space, message, Divider } from "antd";
import styles from "./ExportTab.module.css";
import { StyledInput } from "./ExportTab.styles";

const { TextArea } = Input;
const { Title, Text } = Typography;

export const ExportTab = () => {
  const { surveyId } = useParams();
  const [copied, setCopied] = useState<"iframe" | "script" | null>(null);

  const domain = "http://localhost:3000";

  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("600px");

  const iframeCode = `<iframe 
  src="${domain}/embed/${surveyId}" 
  width="${width}" 
  height="${height}" 
  style="border:none;" 
  loading="lazy"
></iframe>`;

  const scriptCode = `<div 
  id="survey-widget" 
  data-survey-id="${surveyId}" 
  data-width="${width}" 
  data-height="${height}">
</div>
<script src="${domain}/widget.js"></script>`;

  const copyToClipboard = async (text: string, type: "iframe" | "script") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      message.success(`${type === "iframe" ? "Iframe" : "Script"} скопирован!`);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      message.error("Не удалось скопировать");
      console.error(err);
    }
  };

  return (
    <div className={styles.exportContainer}>
      <Title level={3}>Экспорт опроса</Title>

      <Divider />

      <Title level={4}>Параметры ширины и высоты:</Title>
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <StyledInput
          addonBefore="Ширина"
          value={width}
          onChange={(e: any) => setWidth(e.target.value)}
          placeholder="например, 100% или 600px"
        />
        <StyledInput
          addonBefore="Высота"
          value={height}
          onChange={(e: any) => setHeight(e.target.value)}
          placeholder="например, 600px"
        />
      </Space>

      <Divider />

      <Title level={4}>Вставка через iframe:</Title>
      <TextArea
        value={iframeCode}
        readOnly
        rows={5}
        className={styles.code}
        style={{ resize: "none" }}
      />
      <Button
        type="primary"
        onClick={() => copyToClipboard(iframeCode, "iframe")}
        className="primary-button">
        {copied === "iframe" ? "Скопировано!" : "Скопировать iframe"}
      </Button>

      <Divider />

      <Title level={4}>Вставка через script:</Title>
      <TextArea
        value={scriptCode}
        readOnly
        rows={7}
        className={styles.code}
        style={{ resize: "none" }}
      />
      <Button
        type="primary"
        onClick={() => copyToClipboard(scriptCode, "script")}
        className="primary-button">
        {copied === "script" ? "Скопировано!" : "Скопировать script"}
      </Button>
    </div>
  );
};
