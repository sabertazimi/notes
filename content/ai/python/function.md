---
sidebar_position: 4
tags: [AI, Language, Python, Function]
---

# Function

## Default Parameter

```python
def describe_pet(pet_name, animal_type='dog'):
    """显示宠物的信息"""
    print(f"I have a {animal_type}.")
    print(f"My {animal_type}'s name is {pet_name.title()}.")

# 一条名为 Willie 的小狗
describe_pet('willie')
describe_pet(pet_name='willie')

# 一只名为 Harry 的仓鼠
describe_pet('harry', 'hamster')
describe_pet(pet_name='harry', animal_type='hamster')
describe_pet(animal_type='hamster', pet_name='harry')
```

## Rest Parameter

```python
def make_pizza(size, *toppings):
    """概述要制作的比萨"""
    print(f"Making a {size}-inch pizza with the following toppings:")

    for topping in toppings:
        print(f"- {topping}")

make_pizza(16, 'pepperoni')
make_pizza(12, 'mushrooms', 'green peppers', 'extra cheese')
```

```python
def build_profile(first, last, **user_info):
    """创建一个字典，其中包含我们知道的有关用户的一切"""
    user_info['first_name'] = first
    user_info['last_name'] = last
    return user_info

user_profile = build_profile('albert', 'einstein', location='princeton', field='physics')
# {'location': 'princeton', 'field': 'physics',
# 'first_name': 'albert', 'last_name': 'einstein'}
```
