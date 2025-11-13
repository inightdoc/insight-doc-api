import { readFileSync } from "fs";
import { readFile } from "fs/promises";
import mammoth from "mammoth";
import path from "path";
import { PDFParse } from "pdf-parse";
import { BadRequestException } from "../exceptions/exceptions";

export const extractText = async (filePath: string) => {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".pdf") {
    const buffer = await readFile(filePath);
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  } else if (extension === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else if (extension === ".txt") {
    return readFileSync(filePath, "utf-8");
  } else {
    throw BadRequestException("Unsupported File Type");
  }
};
