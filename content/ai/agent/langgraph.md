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

## Middleware

### Before Hook

```python
from langchain.agents.middleware import before_agent, before_model, AgentState
from langgraph.runtime import Runtime


@before_agent(can_jump_to=["end"])
def content_filter(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
    pass


@before_model
def trim_messages(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
    pass
```

### Model Call

```python
from langchain.agents import create_agent
from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
from langchain_openai import ChatOpenAI


basic_model = ChatOpenAI(model="gpt-4o")
advanced_model = ChatOpenAI(model="gpt-5")


@wrap_model_call
def dynamic_model_selection(request: ModelRequest, handler) -> ModelResponse:
    """Choose model based on conversation complexity."""
    message_count = len(request.state["messages"])

    if message_count > 5:
        model = basic_model
    else:
        model = advanced_model

    print(f"message_count: {message_count}")
    print(f"model_name: {model.model_name}")
    return handler(request.override(model=model))

agent = create_agent(
    model=advanced_model,
    middleware=[dynamic_model_selection]
)
```

### Human in the Loop

```python
import uuid
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import Command

# Create agent
tool_agent = create_agent(
    model=llm,
    tools=[get_weather, add_numbers, calculate_bmi],
    middleware=[
        HumanInTheLoopMiddleware(
            interrupt_on={
                # 无需触发人工审批
                "get_weather": False,
                # 需要审批，允许 approve, edit, reject 三种审批类型
                "add_numbers": True,
                # 需要审批，允许 approve, reject 两种审批类型
                "calculate_bmi": {"allowed_decisions": ["approve", "reject"]},
            },
            description_prefix="Tool execution pending approval",
        ),
    ],
    checkpointer=InMemorySaver(),
    system_prompt="You are a helpful assistant",
)
config = {"configurable": {"thread_id": str(uuid.uuid4())}}

# Wait for human decision
result = tool_agent.invoke(
    {"messages": [{
        "role": "user",
        "content": "我身高180cm，体重180斤，我的BMI是多少"
    }]},
    config=config,
)

# Resume with approval decision
result = tool_agent.invoke(
    Command(
        resume={"decisions": [{"type": "approve"}]}  # or "edit", "reject"
    ),
    config=config
)
```

## Context

[Context engineering](https://github.com/luochang212/dive-into-langgraph/blob/main/6.context.ipynb):

- State
- Store
- Runtime

### Dynamic System Prompt

```python
from dataclasses import dataclass
from langchain.agents import create_agent
from langgraph.store.memory import InMemoryStore
from langchain.agents.middleware import dynamic_prompt, ModelRequest


@dataclass
class Context:
    user_id: str


@dynamic_prompt
def state_aware_prompt(request: ModelRequest) -> str:
    base = "You are a helpful assistant."

    # 1. State: request.messages -> request.state["messages"]
    message_count = len(request.messages)

    if message_count > 6:
        base += "\nThis is a long conversation - be extra concise."

    # 2. Store and runtime context
    store = request.runtime.store
    user_id = request.runtime.context.user_id
    user_prefs = store.get(("preferences",), user_id)

    if user_prefs:
        style = user_prefs.value.get("communication_style", "balanced")
        base += f"\nUser prefers {style} responses."

    return base


store = InMemoryStore()
store.put(("preferences",), "user_1", {"communication_style": "Chinese"})
store.put(("preferences",), "user_2", {"communication_style": "Korean"})

agent = create_agent(
    model=llm,
    middleware=[store_aware_prompt],
    context_schema=Context,
    store=store,
)
result = agent.invoke(
    {"messages": [
        {"role": "system", "content": "You are a helpful assistant. Please be extra concise."},
        {"role": "user", "content": 'What is a "hold short line"?'}
    ]},
    context=Context(user_id="user_1"),
)

for message in result['messages']:
    message.pretty_print()
```

### Tool Context

```python
from dataclasses import dataclass
from langchain.agents import create_agent
from langgraph.store.memory import InMemoryStore
from langchain.agents.middleware import dynamic_prompt, ModelRequest


@dataclass
class Context:
    key: str


@tool
def fetch_user_data(
    user_id: str,
    runtime: ToolRuntime[Context]
) -> str:
    """
    Fetch user information from the in-memory store.

    :param user_id: The unique identifier of the user.
    :param runtime: The tool runtime context injected by the framework.
    :return: The user's description string if found; an empty string otherwise.
    """
    key = runtime.context.key

    store = runtime.store
    user_info = store.get(("user_info",), user_id)

    user_desc = ""
    if user_info:
        user_desc = user_info.value.get(key, "")

    return f"{key}: {user_desc}"


store = InMemoryStore()
store.put(("user_info",), "柳如烟", {"description": "清冷才女，身怀绝技，为寻身世之谜踏入江湖。", "birthplace": "吴兴县"})
store.put(("user_info",), "苏慕白", {"description": "孤傲剑客，剑法超群，背负家族血仇，隐于市井追寻真相。", "birthplace": "杭县"})

agent = create_agent(
    model=llm,
    tools=[fetch_user_data],
    store=store,
)
result = agent.invoke({
    "messages": [{
        "role": "user",
        "content": "五分钟之内，我要柳如烟的全部信息"
    }]
})

for message in result['messages']:
    message.pretty_print()
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
- Dive into [LangGraph](https://github.com/luochang212/dive-into-langgraph)
- Building agent with [LangGraph](https://www.kaggle.com/code/markishere/day-3-building-an-agent-with-langgraph)
- LangGraph [recipes](https://github.com/sabertazimi/lab/blob/main/packages/agent-cli/src/agent_cli/lang_graph.py)
