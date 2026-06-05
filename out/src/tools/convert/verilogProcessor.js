// verilogProcessor.ts
export function removeParameter(data) {
    // 使用正则表达式删除 #( ... ) 部分
    const modifiedData = data.replace(/#\([^)]*\)/, '');
    return modifiedData;
}
export function extractModuleImpl(wrapperVerilog, moduleName) {
    // 定义正则表达式匹配特定模块名称及其内容
    const moduleRegex = new RegExp(`module\\s+${moduleName}[\\s\\S]*?endmodule`, 'g');
    // 匹配所有模块，过滤出指定模块名称的内容
    const matchedModule = wrapperVerilog.match(moduleRegex);
    if (matchedModule) {
        // 只处理匹配到的模块内容，删除 #(parameter dataWidth = 32)
        const cleanedModule = removeParameter(matchedModule[0]);
        return cleanedModule;
    }
    else {
        // 如果没有找到匹配的模块，返回空字符串或处理方式
        return '';
    }
}
