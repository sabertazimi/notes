# LangChain

## Model I/O

```python
import { CommaSeparatedListOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { OpenAI } from '@langchain/openai'

const template = PromptTemplate.fromTemplate('List 10 {subject}.\n{format_instructions}')
const model = new OpenAI({ temperature: 0 })
const listParser = new CommaSeparatedListOutputParser()

const prompt = await template.format({
  subject: 'countries',
  format_instructions: listParser.getFormatInstructions(),
})

const result = await model.invoke(prompt)
const listResult = await listParser.parse(result)
```

## Retrieval

```python
import { UpstashVectorStore } from '@langchain/community/vectorstores/upstash'
import { OpenAIEmbeddings } from '@langchain/openai'
import { CSVLoader } from 'langchain/document_loaders/fs/csv'
import { ScoreThresholdRetriever } from 'langchain/retrievers/score_threshold'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

// CSV data.
const loader = new CSVLoader('path/to/example.csv')
const docs = await loader.load()

// Text splitter.
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 10,
  chunkOverlap: 1,
})
const docs = await splitter.createDocuments(['...'])

// Embeddings and vector store.
const vectorStore = new UpstashVectorStore(new OpenAIEmbeddings())
await vectorStore.addDocuments(docs)
const retriever = ScoreThresholdRetriever.fromVectorStore(vectorStore, {
  minSimilarityScore: 0.9,
})
const result = await retriever.getRelevantDocuments('...?')
```

## Chains

```python
import { CommaSeparatedListOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { OpenAI } from '@langchain/openai'

const template = PromptTemplate.fromTemplate('List 10 {subject}.\n{format_instructions}')
const model = new OpenAI({ temperature: 0 })
const listParser = new CommaSeparatedListOutputParser()

const chain = RunnableSequence.from([template, model, listParser])

const result = await chain.invoke({
  subject: 'countries',
  format_instructions: listParser.getFormatInstructions(),
})
```

## Agents

```python
import { createVectorStoreAgent, VectorStoreToolkit } from 'langchain/agents'

const toolkit = new VectorStoreToolkit({ name: 'Demo Data', vectorStore }, model)
const agent = createVectorStoreAgent(model, toolkit)

const result = await agent.invoke({ input: '...' })
```

## Retrieval-Augmented Generation

```python
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from google.colab import userdata

# Load document
document_url = "https://arxiv.org/pdf/2312.10997.pdf"
loader = PyPDFLoader(document_url)
pages = loader.load()

# Split document into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=400,
    chunk_overlap=40,
    length_function=len,
    is_separator_regex=False,
)
chunks = text_splitter.split_documents(pages)

# Create embeddings from chunks
model_name = "BAAI/bge-small-en"
model_kwargs = {"device": "cpu"}
encode_kwargs = {"normalize_embeddings": True}
bge_embeddings = HuggingFaceBgeEmbeddings(
    model_name=model_name, model_kwargs=model_kwargs, encode_kwargs=encode_kwargs
)

chunk_texts = list(map(lambda d: d.page_content, chunks))
embeddings = bge_embeddings.embed_documents(chunk_texts)

# Store embeddings
text_embedding_pairs = zip(chunk_texts, embeddings)
db = FAISS.from_embeddings(text_embedding_pairs, bge_embeddings)

# Search database for similar contexts
query = "Which are the drawbacks of Naive RAG?"

contexts = db.similarity_search(query, k=5)

# Chat with model
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are an expert at answering questions
            based on a context extracted from a document.
            The context extracted from the document is: {context}""",
        ),
        ("human", "{question}"),
    ]
)

api_key = userdata.get("ANTHROPIC_API_KEY")
model = ChatAnthropic(model="claude-3-haiku-20240307", api_key=api_key)

chain = prompt | model

response = chain.invoke(
    {
        "context": "\n\n".join(list(map(lambda c: c.page_content, contexts))),
        "question": query,
    }
)

print(response.content)
```
