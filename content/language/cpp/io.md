---
sidebar_position: 15
tags: [Language, C++, I/O]
---

# I/O

Output format:

```cpp
#include <iostream>
#include <iomanip>

int main() {
    std::cout << "default fill: " << std::setw(10) << 42 << '\n'
              << "setfill('*'): " << std::setfill('*')
                                  << std::setw(10) << 42 << '\n';

    std::cout << rd.name << " 0x"
              << std::setfill('0') << std::setw(16) << std::hex
              << get_register_value(m_pid, rd.r) << std::endl;
}

// Output:
// default fill:         42
// setfill('*'): ********42
```
