---
sidebar_position: 20
tags: [Language, C++, STL]
---

# STL

:::tip[工作方式]

Copy in, copy out.

:::

## String

```cpp
#include <iostream>
#include <malloc.h>
#include <string.h>

using namespace std;

/**
 *
 * Demos for operator overload:
 *  comparison: < == >
 *  getter: []
 *  typecast: (const char *)
 *  contact: +
 *  assign: = +=
 */

/**
 * Notes:
 *  普通函数成员 与 析构函数 全部定义为虚函数
 *  不改变对象实例的函数 全部定义为 const 函数
 *  被改变参数/返回值 全部定义为 引用类型
 *  深拷贝(赋值)函数参数/返回值 全部定义为 引用类型
 */

class String {
    char *s;
public:
    virtual int operator>(const String &c) const;
    virtual int operator==(const String &c) const;
    virtual int operator<(const String &c) const;
    virtual char &operator[](int x);
    virtual operator const char *() const;
    virtual String operator+(const String &c) const;
    virtual String &operator=(const String &c);
    virtual String &operator+=(const String &c);
    String(const char *c);
    String(const String &c);
    virtual ~String();
};

int String::operator>(const String &c) const {
    return strcmp(s, c.s) > 0;
}

int String::operator==(const String &c) const {
    return strcmp(s, c.s) == 0;
}

int String::operator<(const String &c) const {
    return strcmp(s, c.s) < 0;
}

char &String::operator[](int x) {
    return s[x];
}

String::operator const char *() const {
    return s;
}

String String::operator+(const String &c) const {
    char *t = new char[strlen(s)+strlen(c.s)+1];
    String r(strcat(strcpy(t,s), c.s));
    delete []t;
    return r;
}

String &String::operator=(const String &c) {
    delete []s;
    strcpy(s=new char[strlen(c.s)+1], c.s);
    return *this;
}

String &String::operator+=(const String &c) {
    return *this = *this + c;
}

String::String(const char *c) {
    strcpy(s=new char[strlen(c)+1], c);
}

String::String(const String &c) {
    strcpy(s=new char[strlen(c.s)+1], c.s);
}

String::~String(void) {
    if (s) {
        delete []s;
        s = 0;
    }
}
```

## Container

- 序列容器: vector string deque list
- 关联容器: set multiset map multimap
- 连续内存容器: vector string deque
- 链表容器: list slit hash

:::tip[Containers]

- Vector vs Array:
  use Array when size is fixed and need elaborate container-like behavior
- Vector vs Deque:
  use Deque when container is large
- Vector vs List (no random access):
  use List when many middle insertion/deletion/splicing
- Vector vs Set/Map:
  use Set/Map when container is large

:::

## Unordered Map

- count/find
- `[]`

```cpp
if (m_breakpoints.count(possible_breakpoint_location)) {
    auto& bp = m_breakpoints[possible_breakpoint_location];
}

auto alias = m_aliases.find(input);
return (alias != m_aliases.end() && alias->second == command);
```

## List

### Size

list.empty() 优于 list.size() == 0

### Manipulation

```cpp
void container::insert(InputIterator begin, InputIterator end);
void container::insert(iterator position, InputIterator begin, InputIterator end);

iterator container::erase(iterator begin, iterator end);    // 序列容器
void container::erase(iterator begin, iterator end);        // 关联容器

void container::assign(InputIterator begin, InputIterator end);
```

```cpp
v1.assign(v2.begin() + v2.size() / 2, v2.end());
v1.insert(v1.end(), v2.begin() + v2.size() / 2, v2.end())   // 将 v2 一半元素插入 v1 尾部
```

### Remove

- 对于连续内存容器 vector/string/deque:

```cpp
c.erase(remove(c.begin(), c.end(), 1963), c.end())

bool badValue(int);
c.erase(remove_if(c.begin(), c.end(), badValue), c.end());
```

- 对于 list:

```cpp
c.remove(1963)

bool badValue(int);
c.remove_if(badValue);  // higher order function
```

- 对于关联容器:

```cpp
c.erase(1963);
```

### Reserve and Swap

```cpp
v.reserve(1000);    // 强制分配 1000 个元素内存单元, 防止反复回收/释放, 提高执行效率

string(s).swap(s);  // 回收多余内存单元(shrink to fit), 提高内存利用率
```

## Heap

```cpp
std::make_heap(begin(numbers), end(numbers));
std::push_heap(begin(numbers), end(numbers));
std::pop_heap(begin(numbers), end(numbers));
std::is_heap
std::is_heap_until
```

## Sort

```cpp
sort
stable_sort
std::is_sorted
std::is_sorted_until

partial_sort
nth_element: 0 - nth-1 sorted (< nth), nth+1 - end (> nth) unsorted
sort_heap
inplace_merge
```

## Partition

```cpp
partition_point
partition
stable_partition
std::is_partitioned
std::is_partitioned_until
```

## Permutation

```cpp
rotate
shuffle
prev_permutation
next_permutation
```

## Numeric

```cpp
count
count_if

accumulate
(transform_)reduce

partial_sum
(transform_)inclusive_scan
(transform_)exclusive_scan

inner_product
adjacent_difference
sample
```

## Query

```cpp
all_of
any_of
none_of

equal
lexicographical_compare
mismatch
```

### Equal

```cpp
template<class InputIt1, class InputIt2>
bool equal(
    InputIt1 first1,
    InputIt1 last1,
    InputIt2 first2
) {
    for (; first1 != last1; ++first1, ++first2) {
        if (!(*first1 == *first2)) {
            return false;
        }
    }

    return true;
}
```

```cpp
bool is_prefix(const std::string& s, const std::string& of) {
    if (s.size() > of.size()) return false;
    return std::equal(s.begin(), s.end(), of.begin());
}

bool is_suffix(const std::string& s, const std::string& of) {
    if (s.size() > of.size()) return false;
    auto diff = of.size() - s.size();
    return std::equal(s.begin(), s.end(), of.begin() + diff);
}

bool is_palindrome(const std::string& s) {
    return std::equal(s.begin(), s.begin() + s.size() / 2, s.rbegin());
}
```

## Search

```cpp
search
find
find_if
find_if_not
find_first_of
find_end
adjacent_find

equal_range
lower_bound
upper_bound

min_element
max_element
minmax_element
```

### Find

```cpp
template<class InputIterator, class T>
  InputIterator find (InputIterator first, InputIterator last, const T& val) {
  while (first!=last) {
    if (*first==val) return first;
    ++first;
  }
  return last;
}
```

```cpp
auto it = std::find_if(begin(g_register_descriptors), end(g_register_descriptors),
                      [r](auto&& rd) { return rd.r == r; });
```

## Set

```cpp
set_difference
set_intersection
set_union
set_symmetric_difference
includes
merge
```

## Mover

```cpp
copy
copy_backward
copy_if
remove_copy
unique_copy
reverse_copy
rotate_copy
replace_copy
replace_copy_if
partition_copy
partial_sort_copy

move
move_backward
swap_ranges
```

## Value

```cpp
fill
generate
replace
replace_if
iota
```

## Functional Programming

```cpp
transform
for_each
```
