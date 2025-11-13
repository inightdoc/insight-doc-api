import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { getCollection } from "../config/db-collection";
import { extractText } from "../helpers/text-extract.helper";

export const Collection = "documents";
const BATCH_SIZE = 100;

class DocService {
  async readDocument(file: Express.Multer.File, sessionId: string) {
    const extractedText = await extractText(file.path);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const documentCollection = await getCollection(Collection);
    const chunks = await splitter.splitText(extractedText);

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      await documentCollection.add({
        ids: batch.map(() => {
          return `${crypto.randomUUID()}-${i}`;
        }),
        documents: batch,
        metadatas: batch.map((_, i) => ({
          line: i.toString(),
          sessionId: sessionId,
          createdAt: Date.now(),
        })),
      });
    }

    return { data: { success: true } };
  }

  async clearDocumentsBySessionId(sessionId: string) {
    const documentCollection = await getCollection(Collection);
    await documentCollection.delete({
      where: { sessionId: sessionId },
    });
  }
}
export const docService = new DocService();
