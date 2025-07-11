# TSSV  Integrate Register Block

Only Javascripts are provided for use to integrate register block.

```bash
git clone git@192.168.90.119:runzhe.liu/tssv2redzone.git
cd TSSV
```

### Run the flow 1
此flow用于生成SV文件和RALF文件。
```bash
bsub -q be -Is /home/runzhe.liu/tssv2redzone/tssvRegBlk /home/runzhe.liu/tssv2redzone/sv-examples/reg_convert/AIGC_DEMO_Reg.csv 
```
在运行上述命令之前，修改其中的寄存器表格路径.参考/home/runzhe.liu/tssv2redzone/sv-examples/reg_convert/AIGC_DEMO_Reg.csv.
表头如下
Block Name,Block Offset,Register Name,Register Offset,Access Mode(RW/RO/WO/W1C/W1T/W1S),Repeat,Register Description,Field,Bits,Access Type(RW/RO/WO/W1C/W1T/W1S),Reset Value,HDL Path,Field Description,Write Out,

其中repeat表示该寄存器实例的数量，寄存器地址按照4 byte递增。细节参考/home/runzhe.liu/tssv2redzone/sv-examples/reg_convert/AIGC_DEMO_Reg.sv中DEBUG_1相关的信号和地址。

输出结果：生成的SV文件和RALF仍在输入文件所在的目录。

### Run the flow 2
此flow用于生成SV文件和RALF文件。
```bash
bsub -q be -Is /home/runzhe.liu/tssv2redzone/tssvRegBlk /home/runzhe.liu/tssv2redzone/sv-examples/reg_convert/AIGC_DEMO_Reg.csv 16
```
其中,16为指定的总线地址位宽，可修改。如像Run the flow 1中不指定，则默认为12。

### Run the flow 3
支持生成Hardware Update类型寄存器。对输入文件的修改参考/sv-examples/gold/Hard_Update2.0.csv
```bash
bsub -q be -Is /home/runzhe.liu/tssv2redzone/tssvRegBlk /home/runzhe.liu/tssv2redzone/sv-examples/gold/Hard_Update2.0.csv
```

### FAQ

1.由于需要Node和gcc环境，如果不采用提交作业的方法，
```bash
/home/runzhe.liu/tssv2redzone/tssvRegBlk /home/runzhe.liu/tssv2redzone/sv-examples/reg_convert/AIGC_DEMO_Reg.csv
```
，可能出错。
```bash
Fatal: kernel too old
```
