"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = exports.Interface = exports.Expr = exports.Sig = void 0;
class Sig {
    constructor(name) {
        this.toString = () => {
            return this.name;
        };
        this.name = name;
        this.type = 'Sig';
    }
}
exports.Sig = Sig;
class Expr {
    constructor(name) {
        this.toString = () => {
            return this.name;
        };
        this.name = name;
        this.type = 'Expr';
    }
}
exports.Expr = Expr;
var BinaryOp;
(function (BinaryOp) {
    BinaryOp["MULTIPLY"] = "*";
    BinaryOp["ADD"] = "+";
    BinaryOp["SUBTRACT"] = "-";
    BinaryOp["BITWISE_AND"] = "&";
    BinaryOp["BITWISE_OR"] = "|";
})(BinaryOp || (BinaryOp = {}));
class Interface {
    constructor(name, params = {}, role = undefined, signals = {}) {
        this.name = name;
        this.params = params;
        this.role = role;
        this.signals = signals;
    }
    interfaceName() {
        let vName = `${this.name}_${Object.values(this.params).join('_')}`;
        return vName;
    }
    writeSystemVerilog() {
        let signalArray = [];
        Object.keys(this.signals).map((key) => {
            let rangeString = "";
            let signString = (this.signals[key].isSigned) ? " signed" : "";
            if ((this.signals[key].width || 0) > 1) {
                rangeString = `[${Number(this.signals[key].width) - 1}:0]`;
            }
            signalArray.push(`${this.signals[key].type || 'logic'}${signString} ${rangeString} ${key}`);
        });
        let signalString = `   ${signalArray.join(';\n   ')}`;
        let modportsString = '';
        for (var modport in this.modports) {
            let thisModport = this.modports[modport];
            let modportArray = [];
            Object.keys(thisModport).map((name) => {
                modportArray.push(`      ${thisModport[name]} ${name}`);
            });
            modportsString += `
    modport ${modport} (
${modportArray.join(',\n')}
    );           
`;
        }
        let verilog = `
interface ${this.interfaceName()};

${signalString};

${modportsString}

endinterface
        
`;
        return verilog;
    }
}
exports.Interface = Interface;
class Module {
    constructor(params = {}, IOs = {}, signals = {}, body = "") {
        this.bindingRules = {
            'input': ['input', 'wire', 'reg', 'const', 'logic', 'enum'],
            'output': ['output', 'wire', 'logic', 'enum'],
            'inout': ['inout', 'wire']
        };
        this.registerBlocks = {};
        this.params = params;
        if (typeof params.name === 'string') {
            this.name = params.name;
        }
        else {
            let mapFunc = (p) => {
                if (typeof p === 'object') {
                    return this.simpleHash(p.toString());
                }
                return p;
            };
            this.name = this.constructor.name + '_' + Object.values(params).filter((p) => (p !== undefined)).map(mapFunc).join('_');
        }
        this.params.name = this.name;
        this.IOs = IOs;
        this.signals = signals;
        this.body = body;
        this.submodules = {};
        this.interfaces = {};
    }
    addInterface(instanceName, _interface) {
        if (this.interfaces[instanceName])
            throw Error(`${instanceName} interface already exists`);
        this.interfaces[instanceName] = _interface;
        return _interface;
    }
    addSubmodule(instanceName, submodule, bindings, autoBind = true) {
        if (this.submodules.instanceName !== undefined)
            throw Error(`submodule with instance name ${instanceName} already exists`);
        let thisModule = {
            module: submodule,
            bindings: bindings
        };
        this.submodules[instanceName] = thisModule;
        if (autoBind) {
            for (var port in submodule.IOs) {
                if (!thisModule.bindings[port]) {
                    if (this.IOs[port]) {
                        thisModule.bindings[port] = port;
                    }
                    else if (this.signals[port]) {
                        thisModule.bindings[port] = port;
                    }
                    else if (submodule.IOs[port].direction === 'input') {
                        throw Error(`unbound input on ${submodule.name}: ${port}`);
                    }
                }
            }
            for (var _interface in submodule.interfaces) {
                let thisInterface = submodule.interfaces[_interface];
                if (thisInterface.role && thisInterface.modports) {
                    if (!thisModule.bindings[_interface]) {
                        if (this.interfaces[_interface]) {
                            thisModule.bindings[_interface] = _interface;
                        }
                        else {
                            throw Error(`unbound interface on ${submodule.name}: ${_interface}`);
                        }
                    }
                }
            }
        }
        for (var port in thisModule.bindings) {
            const thisPort = submodule.IOs[port];
            const thisInterface = submodule.interfaces[port];
            if (thisPort) {
                let thisSig = this.findSignal(bindings[port], true, this.addSubmodule);
                if (!(this.bindingRules[thisPort.direction].includes(thisSig.type || 'logic')))
                    throw Error(`illegal binding ${port}(${bindings[port]})`);
            }
            else if (thisInterface && (typeof port === 'string')) {
                let thisInt = this.interfaces[bindings[port].toString()];
                if (thisInt.role) {
                    if (thisInt.role !== thisInterface.role)
                        throw Error(`${port} interface role mismatch on ${submodule.name}`);
                }
            }
            else {
                throw Error(`${port} not found on module ${submodule.name}`);
            }
        }
        return thisModule.module;
    }
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
        }
        // Convert to 32bit unsigned integer in base 36 and pad with "0" to ensure length is 7.
        return (hash >>> 0).toString(36).padStart(7, '0');
    }
    findSignal(sig, throwOnFalse = false, caller = null) {
        const thisSig = this.IOs[sig.toString()] || this.signals[sig.toString()];
        if (!thisSig && throwOnFalse) {
            let errString = "";
            if (typeof caller === 'function') {
                errString = `${sig.toString()} signal not found in ${caller.name}()`;
            }
            else {
                errString = `${caller.toString()}: ${sig.toString()} signal not found`;
            }
            throw Error(errString);
        }
        return thisSig;
    }
    addSignal(name, signal) {
        if (this.findSignal(name))
            throw Error(`${name} signal already exists`);
        this.signals[name] = signal;
        return new Sig(name);
    }
    addRegister(io) {
        let qName = io.q;
        if ((typeof io.d === 'string') || (io.d.type === 'Sig')) {
            const dSig = this.findSignal(io.d, true, this.addRegister);
            if (io.q === undefined) {
                qName = `${io.d}_q`;
                if (this.signals[qName] || this.IOs[qName])
                    throw Error(`${qName} signal already exists`);
                this.signals[qName] = { ...dSig, type: 'logic' };
            }
        }
        if (io.q) {
            let qSig = this.findSignal(io.q, true, this.addRegister);
            switch (qSig.type) {
                case undefined:
                case 'wire':
                    qSig.type = 'logic';
                    break;
                case 'reg':
                case 'logic':
                    break;
                default:
                    throw Error(`${io.q} is unsupported signal type ${qSig.type}`);
            }
            qName = io.q;
        }
        if (qName === undefined) {
            throw Error(`addRegister(${JSON.stringify(io)}) auto q naming only allowed when d is a simple signal, not an expression`);
        }
        const d = io.d.toString();
        const clkSig = this.findSignal(io.clk, true, this.addRegister);
        if (!clkSig.isClock)
            throw Error('${io.clk} is not a clock signal');
        let resetSensitivity = '';
        let resetCondition = '#NONE#';
        if (io.reset) {
            const rstSig = this.findSignal(io.reset, true, this.addRegister);
            if (!rstSig.isReset)
                throw Error(`${io.reset} is not a reset signal`);
            switch (rstSig.isReset) {
                case 'highasync':
                    resetSensitivity = ` or posedge ${io.reset}`;
                    resetCondition = `${io.reset}`;
                    break;
                case 'lowasync':
                    resetSensitivity = ` or negedge ${io.reset}`;
                    resetCondition = `!${io.reset}`;
                    break;
                case 'lowsync':
                    resetCondition = `!${io.reset}`;
                    break;
                case 'highsync':
                    resetCondition = `${io.reset}`;
                    break;
                default:
            }
        }
        const sensitivityList = `@( ${clkSig.isClock} ${io.clk} ${resetSensitivity} )`;
        let enableExpr = "#NONE#";
        if (io.en !== undefined) {
            enableExpr = io.en.toString();
        }
        //console.log(`d: ${d}`)
        //console.log(`sensitivity: ${sensitivityList}`)
        if (!this.registerBlocks[sensitivityList]) {
            this.registerBlocks[sensitivityList] = {};
        }
        if (!this.registerBlocks[sensitivityList][resetCondition]) {
            this.registerBlocks[sensitivityList][resetCondition] = {};
        }
        if (!this.registerBlocks[sensitivityList][resetCondition][enableExpr]) {
            this.registerBlocks[sensitivityList][resetCondition][enableExpr] = {};
        }
        this.registerBlocks[sensitivityList][resetCondition][enableExpr][qName.toString()] = { d: d, resetVal: io.resetVal };
        if (typeof qName === 'string') {
            return new Sig(qName);
        }
        return qName;
    }
    bitWidth(a, isSigned = false) {
        return (Math.ceil(Math.log2(Math.abs(Number(a)) + Number(a >= 0)) + Number(isSigned || (a < 0))));
    }
    addRound(io, roundMode = 'roundUp') {
        if (roundMode !== 'roundUp')
            throw Error(`FIXME: ${roundMode} not implemented yet`);
        const inSig = this.findSignal(io.in, true, this.addRound);
        const outSig = this.findSignal(io.out, true, this.addRound);
        let rShiftString = io.rShift.toString();
        if (typeof io.rShift !== 'number') {
            const rShiftSig = this.findSignal(io.rShift, true, this.addRound);
            if (rShiftSig.isSigned)
                throw Error(`right shift signal ${io.rShift} must be unsigned`);
        }
        if (inSig.isSigned != outSig.isSigned)
            throw Error(`sign mode must match ${io.in}, ${io.out}`);
        this.body += `   assign ${io.out} = ${outSig.width}'((${io.in} + (${inSig.width}'d1<<(${rShiftString}-1)))>>>${rShiftString});\n`;
        if (typeof io.out === 'string') {
            return new Sig(io.out);
        }
        return io.out;
    }
    addSaturate(io, satMode = 'simple') {
        if (satMode !== 'simple')
            throw Error(`FIXME: ${satMode} not implemented yet`);
        const inSig = this.findSignal(io.in, true, this.addSaturate);
        const outSig = this.findSignal(io.out, true, this.addSaturate);
        if (inSig.isSigned != outSig.isSigned)
            throw Error(`sign mode must match ${io.in}, ${io.out}`);
        if (inSig.isSigned) {
            const sat = 1 << ((outSig.width || 1) - 1);
            const maxSatStringIn = `${inSig.width}'sd${sat - 1}`;
            const minSatStringIn = `-${inSig.width}'sd${sat}`;
            const maxSatString = `${outSig.width}'sd${sat - 1}`;
            const minSatString = `-${outSig.width}'sd${sat}`;
            this.body +=
                `   assign ${io.out} = (${io.in} > ${maxSatStringIn}) ? ${maxSatString} :
                       ((${io.in} < ${minSatStringIn}) ? ${minSatString} : ${outSig.width}'(${io.in}));
`;
        }
        else {
            const sat = (1 << ((outSig.width || 1) - 1)) - 1;
            const maxSatStringIn = `${outSig.width}'d${sat}`;
            const maxSatString = `${outSig.width}'d${sat}`;
            this.body +=
                `   assign ${io.out} = (${io.in} > ${maxSatStringIn}) ? ${maxSatString} : ${outSig.width}'(${io.in});
`;
        }
        if (typeof io.out === 'string') {
            return new Sig(io.out);
        }
        return io.out;
    }
    addOperation(op, io) {
        const nameMap = {
            '*': {
                name: 'prod',
                autoWidth: (a, b) => { return a + b; }
            },
            '-': {
                name: 'diff',
                autoWidth: (a, b) => { return Math.max(a, b) + 1; }
            },
            '+': {
                name: 'sum',
                autoWidth: (a, b) => { return Math.max(a, b) + 1; }
            },
            '&': {
                name: 'mask',
                autoWidth: (a, b) => { return Math.max(a, b); }
            },
            '|': {
                name: 'bitset',
                autoWidth: (a, b) => { return Math.max(a, b); }
            }
        };
        let aOperand = undefined;
        let bOperand = undefined;
        let aAuto = io.a;
        let bAuto = io.b;
        let aWidth = 0;
        let bWidth = 0;
        let aSigned = false;
        let bSigned = false;
        if (typeof io.a !== 'bigint') {
            const aSig = this.findSignal(io.a, true, this.addOperation);
            aOperand = io.a;
            aWidth = Number(aSig.width);
            aSigned = aSig.isSigned || false;
        }
        else {
            aWidth = this.bitWidth(io.a);
            aSigned = (io.a < 0);
            aOperand = (aSigned) ? `-${aWidth}'sd${Math.abs(Number(io.a))}` : `${aWidth}'d${io.a}`;
            aAuto = aOperand.replace('-', 'm').replace("'", "");
        }
        if (typeof io.b !== 'bigint') {
            const bSig = this.findSignal(io.b, true, this.addOperation);
            bOperand = io.b;
            bWidth = Number(bSig.width);
            bSigned = bSig.isSigned || false;
        }
        else {
            bWidth = this.bitWidth(io.b);
            bSigned = (io.b < 0);
            bOperand = (bSigned) ? `-${bWidth}'sd${Math.abs(Number(io.b))}` : `${bWidth}'d${io.b}`;
            bAuto = bOperand.replace('-', 'm').replace("'", "");
        }
        let result = "#NONE#";
        if (io.result !== undefined) {
            const resultSig = this.findSignal(io.result, true, this.addOperation);
            if (resultSig.isSigned === undefined) {
                resultSig.isSigned = (aSigned || bSigned);
            }
            if ((aSigned || bSigned) && (!(resultSig.isSigned)))
                throw Error(`${io.result} must be signed`);
            console.log();
            if ((resultSig.width || 0) < nameMap[op].autoWidth(aWidth, bWidth))
                console.warn(`${io.result} truncated output`);
            result = io.result;
        }
        else {
            result = `${nameMap[op].name}_${aAuto}x${bAuto}`;
            this.signals[result] = {
                type: 'logic',
                isSigned: (aSigned || bSigned),
                width: nameMap[op].autoWidth(aWidth, bWidth)
            };
        }
        this.body += `   assign ${result.toString()} = ${aOperand} ${op} ${bOperand};\n`;
        if (typeof result === 'string') {
            return new Sig(result);
        }
        return result;
    }
    addMultiplier(io) {
        return this.addOperation(BinaryOp.MULTIPLY, io);
    }
    addAdder(io) {
        return this.addOperation(BinaryOp.ADD, io);
    }
    addSubtractor(io) {
        return this.addOperation(BinaryOp.SUBTRACT, io);
    }
    addConstSignal(name, value, isSigned = false, width = undefined) {
        const minWidth = this.bitWidth(value, isSigned);
        const resolvedWidth = (width === undefined) ? minWidth : width;
        if (resolvedWidth < minWidth)
            throw Error(`width:${resolvedWidth} is insufficient for value: ${value}`);
        this.signals[name] = { type: 'const', value: value, isSigned: isSigned, width: resolvedWidth };
        return new Sig(name);
    }
    addConstSignals(name, values, isSigned = false, width = undefined) {
        let signalNames = [...Array(values.length).keys()].map((p) => { return `${name}_${p}`; });
        let retVal = [];
        signalNames.forEach((p, i) => {
            retVal.push(this.addConstSignal(p, values[i], isSigned || (values[i] < 0), width));
        });
        return retVal;
    }
    addAssign(io) {
        const outSig = this.findSignal(io.out, true, this.addAssign);
        if (!(outSig.type === 'wire' || outSig.type === 'logic')) {
            throw Error(`${io.out.toString()} signal must be either wire or logic in assign statement`);
        }
        this.body += `  assign ${io.out.toString()} = ${io.in.toString()}`;
        if (typeof io.out === 'string') {
            return new Sig(io.out);
        }
        return io.out;
    }
    addMux(io) {
        const selWidth = Math.ceil(Math.log2(io.in.length));
        let selString = io.sel.toString();
        if ((typeof io.sel === 'string') || (io.sel.type === 'Sig')) {
            const selSig = this.findSignal(io.sel, true, this.addMux);
            if (selSig.width || 1 < selWidth)
                throw Error(`${io.sel.toString()} signal does not have enough bits as Mux select`);
            if (selSig.width || 1 > selWidth) {
                selString = `${io.sel.toString()}[${selWidth - 1}:0]`;
            }
        }
        const outSig = this.findSignal(io.out, true, this.addMux);
        switch (outSig.type) {
            case undefined:
            case 'wire':
                outSig.type = 'logic';
                break;
            case 'reg':
            case 'logic':
                break;
            default:
                throw Error(`${io.out} is unsupported signal type ${outSig.type}`);
        }
        let caseAssignments = '';
        for (var i in io.in) {
            const rhExpr = `${io.in[i].toString()}`;
            caseAssignments += `     case ${selWidth}'d{i}: ${io.out} = ${rhExpr}`;
        }
        this.body +=
            `  always_comb
    unique case(${selString})
${caseAssignments}
      default: {${outSig.width}{1'bx}}
`;
        if (typeof io.out === 'string') {
            return new Sig(io.out);
        }
        return io.out;
    }
    debug() {
        console.log(this.name);
        console.log(this.params);
        console.log(this.IOs);
        console.log(this.signals);
        console.log(this.body);
        console.log(this.registerBlocks);
    }
    writeSystemVerilog() {
        // assemble TSSVParameters
        let paramsArray = [];
        if (this.params) {
            //FIXME - need separate SV Verilog parameter container
            /*
              for (var key of Object.keys(this.params)) {
              let param = this.params[key]
              // console.log(`${key}: ${param} ${typeof param}`)
              if(typeof param === 'number') {
              paramsArray.push(`parameter ${key} = ${param.toString()}`)
              }
              }
            */
        }
        let paramsString = "";
        if (paramsArray.length > 0) {
            paramsString = `    #(${paramsArray.join(',\n    ')})`;
        }
        // construct IO definition
        let IOArray = [];
        let signalArray = [];
        let interfacesString = '';
        Object.keys(this.IOs).map((key) => {
            let rangeString = "";
            let signString = (this.IOs[key].isSigned) ? " signed" : "";
            if ((this.IOs[key].width || 0) > 1) {
                rangeString = `[${Number(this.IOs[key].width) - 1}:0]`;
            }
            IOArray.push(`${this.IOs[key].direction} ${this.IOs[key].type || 'logic'}${signString} ${rangeString} ${key}`);
        });
        Object.keys(this.interfaces).map((key) => {
            let thisInterface = this.interfaces[key];
            if (thisInterface.role) {
                if (thisInterface.modports) {
                    let thisModports = thisInterface.modports[thisInterface.role];
                    if (!thisModports)
                        throw Error(`${thisInterface.name} : inconsistent modports`);
                    /*
                    Object.keys(thisModports).map((name) => {
                        let thisSignal = thisInterface.signals[name]
                        if(!thisSignal) `${thisInterface.name}: modport missing signal ${name}`
                        let rangeString = ""
                        let signString = (thisSignal.isSigned) ? " signed" : ""
                        if((thisSignal.width || 0) > 1) {
                            rangeString = `[${Number(thisSignal.width)-1}:0]`
                        }
                        IOArray.push(`${thisModports[name]} ${thisSignal.type || 'logic'}${signString} ${rangeString} ${name}`)
                    })
                    */
                    if (!Module.printedInterfaces[thisInterface.interfaceName()]) {
                        interfacesString += thisInterface.writeSystemVerilog();
                        Module.printedInterfaces[thisInterface.interfaceName()] = true;
                    }
                    IOArray.push(`${thisInterface.interfaceName()}.${thisInterface.role} ${key}`);
                }
                else {
                    throw Error(`${thisInterface.name} has role/modport inconsistency`);
                }
            }
            else {
                signalArray.push(`${thisInterface.interfaceName()} ${key}`);
            }
        });
        let IOString = `   ${IOArray.join(',\n   ')}`;
        // construct signal list
        Object.keys(this.signals).map((key) => {
            let rangeString = "";
            let signString = (this.signals[key].isSigned) ? " signed" : "";
            if ((this.signals[key].width || 0) > 1) {
                rangeString = `[${Number(this.signals[key].width) - 1}:0]`;
            }
            signalArray.push(`${this.signals[key].type || 'logic'}${signString} ${rangeString} ${key}`);
        });
        let signalString = `   ${signalArray.join(';\n   ')}`;
        if (signalArray.length)
            signalString += ';';
        for (var sensitivity in this.registerBlocks) {
            for (var resetCondition in this.registerBlocks[sensitivity]) {
                for (var enable in this.registerBlocks[sensitivity][resetCondition]) {
                    const regs = this.registerBlocks[sensitivity][resetCondition][enable];
                    let resetString = "   ";
                    if (resetCondition != "#NONE#") {
                        let resetAssignments = [];
                        Object.keys(regs).map((key) => {
                            const reg = regs[key];
                            //console.log(reg)
                            resetAssignments.push(`           ${key} <= 'd${reg.resetVal || 0};`);
                        });
                        resetString =
                            `     if(${resetCondition})
        begin
${resetAssignments.join('\n')}
        end
      else `;
                    }
                    let enableString = (enable == "#NONE#") ? "" : `if(${enable})`;
                    let functionalAssigments = [];
                    Object.keys(regs).map((key) => {
                        const reg = regs[key];
                        //console.log(reg)
                        functionalAssigments.push(`           ${key} <= ${reg.d};`);
                    });
                    this.body +=
                        `
   always_ff ${sensitivity}
${resetString}${enableString}
        begin
${functionalAssigments.join('\n')}
        end
`;
                }
            }
        }
        let subModulesString = "";
        for (var moduleInstance in this.submodules) {
            const thisSubmodule = this.submodules[moduleInstance];
            let printed = {};
            if (!printed[thisSubmodule.module.name]) {
                printed[thisSubmodule.module.name] = true;
                subModulesString += thisSubmodule.module.writeSystemVerilog();
            }
            let bindingsArray = [];
            for (var binding in thisSubmodule.bindings) {
                bindingsArray.push(`        .${binding}(${thisSubmodule.bindings[binding]})`);
            }
            this.body +=
                `
    ${thisSubmodule.module.name} ${moduleInstance}
      (
${bindingsArray.join(',\n')}        
      );
`;
        }
        let verilog = `
${interfacesString}        
${subModulesString}
        
/* verilator lint_off WIDTH */        
module ${this.name} ${paramsString}
   (
${IOString}
   );

${signalString}

${this.body}

endmodule
/* verilator lint_on WIDTH */        
`;
        return verilog;
    }
}
exports.Module = Module;
Module.printedInterfaces = {};
exports.default = { Module, Sig, Expr };
