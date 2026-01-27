---
sidebar_position: 30
tags: [Language, Verilog, FPGA, Xilinx]
---

# Xilinx U280

```bash
-xp param (clock frequency etc.)
-R report level
-slr SLR region setting
-sp memory resources mapping
```

## Host Application

### Workflow

- set the kernel arguments before performing any enqueue operation
- keeping the buffer size **2 MB ~ 4 GB**
- `posix_memalign` is used instead of malloc for the host memory space pointer

```cpp
uint32_t *a, *b, *c, *d = NULL;
posix_memalign((void **)&a, 4096, BUF_SIZE * sizeof(uint32_t));
posix_memalign((void **)&b, 4096, BUF_SIZE * sizeof(uint32_t));
posix_memalign((void **)&c, 4096, BUF_SIZE * sizeof(uint32_t));
posix_memalign((void **)&d, 4096, BUF_SIZE * sizeof(uint32_t));
```

- release resources for proper performance profile report

```cpp
clReleaseCommandQueue(Command_Queue);
clReleaseContext(Context);
clReleaseDevice(Target_Device_ID);
clReleaseKernel(Kernel);
clReleaseProgram(Program);
free(Platform_IDs);
free(Device_IDs);
```

### TLP

It is advisable to use the `posix_spawn()` system call
to launch another process from the SDAccel environment application.

## Toolchain

- `xbutil query`.
- `platforminfo`.
- `kernelinfo`.
- `xclbinutil`.
- `dmesg`.

### GDB

```bash
xprint queue [<cl_command_queue>]
xprint event <cl_event>
xprint mem [<cl_mem>]
xprint kernel
xprint all
xstatus all
xstatus --<ipName>
```

### XCL

```bash
xclbinutil -i binary_container_1.xclbin --info
```

### XOCC

Checking out-of-bound access made by kernel interface buffers (option: address)
and uninitialized memory access initiated by kernel local to kernel (option: memory).

```bash
xocc -l -t sw_emu --xp param:compiler.fsanitize=address -o bin_kernel.xclbin
xocc -l -t sw_emu --xp param:compiler.fsanitize=memory -o bin_kernel.xclbin
xocc -l -t sw_emu --xp param:compiler.fsanitize=address,memory -o bin_kernel.xclbin
```

### XBUtil

```bash
sudo /opt/xilinx/xrt/bin/xbutil flash -a <shell_name> # flash the firmware
```

```bash
sudo lspci -vd 10ee:
sudo /opt/xilinx/xrt/bin/xbutil flash scan
sudo /opt/xilinx/xrt/bin/xbutil validate -d <card_id>
```

```bash
xbutil program -p <xclbin>
xbutil query         # check memory banks usage
xbutil status --lapc # check AXI violations
```

### Dmesg

### ILA

- debug protocol hangs
- examine the burst size, pipelining and data width to locate the bottleneck

```cpp
....
std::string binaryFile = xcl::find_binary_file(device_name,"vAdd");
cl::Program::Binaries bins = xcl::import_binary_file(binaryFile);
devices.resize(1);
cl::Program program(context, devices, bins);
cl::Kernel kernel_vAdd(program,"kernel_vAdd_rtl");

// wait_for_enter("\nPress ENTER to continue after setting up ILA trigger...");
std::cout << "Pausing to arm ILA trigger. Hit enter here to resume host program..."
          << std::endl;
std::cin.get();

//Allocate Buffer in Global Memory
std::vector<cl::Memory> inBufVec, outBufVec;
cl::Buffer buffer_r1(context,CL_MEM_USE_HOST_PTR | CL_MEM_READ_ONLY,
vector_size_bytes, source_input1.data());
// ...
// ...
// ...

//Copy input data to device global memory
q.enqueueMigrateMemObjects(inBufVec,0/* 0 means from host*/);

//Set the Kernel Arguments
// ...
// ...
// ...

//Launch the Kernel
q.enqueueTask(kernel_vAdd);
```
