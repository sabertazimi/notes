---
sidebar_position: 2
tags: [AI, Language, Python, String, List, Tuple, Dictionary]
---

# Data Structure

## String

```python
message = " Hello, python world! "

print(message)
print(message.strip())
print(message.lstrip())
print(message.rstrip())
print(message.upper())
print(message.lower())
print(message.title())
print(message.removeprefix(" Hello"))
print(message.removesuffix(" world! "))
```

## List

```python
my_list.append(element)
my_list.remove(element) # Remove the first occurrence of the element

my_list.insert(index, element)
del my_list[index]
my_list.pop()
my_list.pop(index)

my_list.sort()
my_list.sort(reverse=True)
sorted_list = sorted(my_list)
my_list.reverse()

len(my_list)
min(digits_list)
max(digits_list)
sum(digits_list)

my_list[1:3] # [1, 3)
my_list[:3] # [0, 3)
my_list[3:] # [3, end)
my_list[-3:] # last 3 elements
my_list[:] # all elements

original_list = my_list
copy_list = my_list[:]
```

### Range

```python
for i in range(3): # 0, 1, 2
  print(i)

for i in range(1, 3): # 1, 2
  print(i)

even_numbers = list(range(2, 11, 2))
print(even_numbers) # [2, 4, 6, 8, 10]
```

### Comprehension

列表解析/列表推导式:

```python
squares = [value**2 for value in range(1, 11)]
print(squares) # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

## Tuple

Tuple in python are immutable.

## Dictionary

```python
for key, value in my_dict.items(): # my_dict.keys() / my_dict.values()
  print(key, value)
```
