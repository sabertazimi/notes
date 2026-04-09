---
sidebar_position: 5
tags: [AI, Language, Python, Class]
---

# Class

## Basic Syntax

```python
class Pet(Animal):
  def __init__(self, species, color, name):
    super().__init__(species, color)
    self.name = name

  def __str__(self):
    return "{0} {1} named {2}.".format(self.color, self.species, self.name)

  def change_name(self, new_name):
    self.name = new_name

my_dog = Pet(species="dog", color="orange", name="Guises")
print(my_dog)
print(my_dog.name)
# => output:
# orange dog named Guises.
# Guises
```

## `Pydantic`

### Base Model

```python
from pydantic import BaseModel,Field
from typing import Optional,List

class Attraction(BaseModel):
    name: str = Field(...,description="景点名称") # 必填
    rating: float = Field(default=0.0,ge=0,le=5)  # 默认值,范围验证
    visit_duration: int = Field(default=60,gt=0)  # 大于0
    description: Optional[str] = None             # 可选字段
```

### Field Validator

```python
from pydantic import field_validator

class WeatherInfo(BaseModel):
    temperature: int

    @field_validator('temperature',mode='before')
    def parse_temperature(cls,v):
        """解析温度字符串："16°C" -> 16"""
        if isinstance(v,str):
            v = v.replace('°C','').replace('℃','').strip()
            return int(v)
        return v
```
