# TSSV  Generater SRAM WRAPPER for Samsung SRAMs

Only Javascripts are provided for use to Generater SRAM WRAPPER for Samsung SRAMs

```bash
git clone git@192.168.90.119:runzhe.liu/tssv2redzone.git
cd TSSV
```

### Run the flow
此flow用于生成SV文件和RALF文件。
```bash
bsub -q be -Is /home/runzhe.liu/tssv2redzone/runSramWrapper /home/runzhe.liu/tssv2redzone/sv-examples/test_memWrapper/sram_config1.json 
```

如将wrapper沿depth方向切分，需要指定address mask和en_ptn，参考/sv-examples/test_memWrapper/sram_config4.json文件

由于需要Node和gcc环境，如果不采用提交作业的方法，
```bash
/home/runzhe.liu/tssv2redzone/runSramWrapper /home/runzhe.liu/tssv2redzone/sv-examples/test_memWrapper/sram_config1.json 
```
，可能出错。
```bash
Fatal: kernel too old
```
生成的V文件和sram_list仍在输入文件所在的目录。

在运行上述命令之前，修改其中的Wrapper Configuration路径.
输入文件格式参考/home/runzhe.liu/tssv2redzone/sv-examples/test_memWrapper/sram_config1~4.json.



