---
sidebar_position: 5
tags: [AI, Language, Python, Class]
---

# Class

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
