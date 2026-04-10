---
sidebar_position: 52
tags: [AI, Generative AI, LLM, Agent, Toolchain, LangChain, LangGraph]
---

# LangGraph

## Prompt Template

```python
from langchain_core.prompts import ChatPromptTemplate


review_template = ChatPromptTemplate.from_template("""\
Returns sentiment analysis of the text.
The sentiment analysis should be either "positive", "negative", or "neutral".

Text: {text}
""")
review_text = "I really enjoyed the movie!"
messages = review_template.format_messages(text=review_text)
```

## Structured Output

```python
from langchain_anthropic import ChatAnthropic


response = ChatAnthropic().with_structured_output(
    {
        "name": "str",
        "age": "int",
        "hobbies": ["str"],
    }
).invoke(
    [
        ("system", "你是一个有用的助手。"),
        ("human", "请告诉我你的名字、年龄和爱好。"),
    ]
)
print(response.model_dump_json(indent=2))
```

## Retrieval-Augmented Generation

```python
from google.colab import userdata
from langchain_anthropic import ChatAnthropic
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter


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

### History

```python
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableBranch, RunnablePassthrough
from langchain_openai import ChatOpenAI
from zhipuai_embedding import ZhipuAIEmbeddings


def get_retriever():
    embedding = ZhipuAIEmbeddings()
    persist_directory = "data_base/vector_db/chroma"
    vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
    return vectordb.as_retriever()


def combine_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs["context"])


def get_qa_history_chain():
    condense_question_prompt = ChatPromptTemplate(
        [
            (
                "system",
                "请根据聊天记录总结用户最近的问题，如果没有多余的聊天记录则返回用户的问题",
            ),
            ("placeholder", "{chat_history}"),
            ("human", "{input}"),
        ]
    )
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0)
    retriever = get_retriever()
    retrieve_docs = RunnableBranch(
        (
            lambda x: not x.get("chat_history", False),
            (lambda x: x["input"]) | retriever,
        ),
        condense_question_prompt | llm | StrOutputParser() | retriever,
    )

    system_prompt = (
        "你是一个问答任务的助手。 "
        "请使用检索到的上下文片段回答这个问题。 "
        "如果你不知道答案就说不知道。 "
        "请使用简洁的话语回答用户。"
        "\n\n"
        "{context}"
    )
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("placeholder", "{chat_history}"),
            ("human", "{input}"),
        ]
    )

    qa_chain = (
        RunnablePassthrough().assign(context=combine_docs)
        | qa_prompt
        | llm
        | StrOutputParser()
    )
    qa_history_chain = (
        RunnablePassthrough()
        .assign(
            context=retrieve_docs,
        )
        .assign(answer=qa_chain)
    )
    return qa_history_chain
```

## Hugging Face

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer


def demo_qwen() -> None:
    model_id = "Qwen/Qwen3-0.6B"
    device = "cuda" if torch.cuda.is_available() else "cpu"
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(model_id).to(device)

    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "你好，请介绍你自己。"},
    ]
    text = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )
    model_inputs = tokenizer(text, return_tensors="pt").to(device)

    generated_ids = model.generate(model_inputs.input_ids, max_length=512)
    generated_ids = [
        output_ids[len(input_ids) :]
        for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids, strict=True)
    ]
    generated_text = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
    print(generated_text)
```

## References

- API reference [documentation](https://reference.langchain.com)
- Building agent with [LangGraph](https://www.kaggle.com/code/markishere/day-3-building-an-agent-with-langgraph)
