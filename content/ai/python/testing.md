---
sidebar_position: 14
tags: [AI, Language, Python, Testing]
---

# Testing

## Configuration

```toml
[dependency-groups]
dev = [
  "pytest>=9.0.0",
  "pytest-cov>=7.0.0",
]

[tool.pytest.ini_options]
addopts = "--cov=packages --cov-report=term-missing"
testpaths = [ "packages" ]
pythonpath = [ "." ]
```

## Fixtures

```python
import pytest
from survey import AnonymousSurvey

@pytest.fixture
def language_survey():
  """一个可供所有测试函数使用的 AnonymousSurvey 实例"""
  question = "What language did you first learn to speak?"
  language_survey = AnonymousSurvey(question)
  return language_survey

def test_store_single_response(language_survey):
  """测试单个答案会被妥善地存储"""
  language_survey.store_response("English")
  assert "English" in language_survey.responses

def test_store_three_responses(language_survey):
  """测试三个答案会被妥善地存储"""
  responses = ["English", "Spanish", "Mandarin"]

  for response in responses:
    language_survey.store_response(response)

  for response in responses:
    assert response in language_survey.responses
```
