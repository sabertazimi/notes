cmake_minimum_required(VERSION 3.5)
project(clrs)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

set(SOURCE_FILES main.cpp btree.h fibonacci_heap.h)
add_executable(clrs ${SOURCE_FILES})