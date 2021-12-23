import Blockly from 'blockly';
const vimlangGenerator = new Blockly.Generator('Vim');

/* How to write generator code */
/* helpurl: https://developers.google.com/blockly/guides/create-custom-blocks/generating-code
 * 1. Collect the Arguments.
 *   - getFieldValue():
 *   - valueToCode():
 *   - statementToCode():
 * 2. Assembling Code.
 */

/* blockly operator precedence */
/* helpurl: https://developers.google.com/blockly/guides/create-custom-blocks/operator-precedence
 * 1. when does these orders needed?
 *   - fetching generated code from a connected value block.
 *      : maximum binding str of any operators adjacent to the sub-block's generated code.
 *      : e.g. ~~ = gen.valueToCode(~~, max_PRECEDENCE_of_sub_blocks);
 *   - returning generated code from a value block. 
 *      : minimum binding str of any operators in the block's generated code.
 *      : e.g. return [code, min_PRECEDENCE_of_any_op];
 */

// helpurl: https://vimhelp.org/eval.txt.html#expression-syntax
/* Highest precedence */

vimlangGenerator.PRECEDENCE = 0;
vimlangGenerator.ORDER_ATOMIC = 0;

vimlangGenerator.ORDER_HIGHEST_PRECEDENCE = 1;
//    number                  number constant
//    "string"                string constant, backslash is special
//    'string'                string constant, ' is doubled
//    [expr1, ...]            List
//    {expr1: expr1, ...}     Dictionary
//    #{key: expr1, ...}      Dictionary
//    &option                 option value
//    (expr1)                 nested expression
//    variable                internal variable
//    va{ria}ble              internal variable with curly braces
//    $VAR                    environment variable
//    @r                      contents of register 'r'
//    function(expr1, ...)    function call
//    func{ti}on(expr1, ...)  function call with curly braces
//    {args -> expr1}         lambda expression

vimlangGenerator.ORDER_LIST_DICT = 2;
//     expr8[expr1]            byte of a String or item of a List
//     expr8[expr1 : expr1]    substring of a String or sublist of a List
//     expr8.name              entry in a Dictionary
//     expr8(expr1, ...)       function call with Funcref variable
//     expr8->name(expr1, ...) method call

vimlangGenerator.ORDER_UNARY_LOGI_NOT = 3;		// +N -N !
vimlangGenerator.ORDER_MUL_DIV = 4;		// * / %
vimlangGenerator.ORDER_ADD_SUB = 5;		// + - . ..
vimlangGenerator.ORDER_LOGICAL_COMP = 6;	// == != > >= < <= =~ !~ ==? ==# is isnot etc.
vimlangGenerator.ORDER_LOGICAL_AND = 7;	// &&
vimlangGenerator.ORDER_LOGICAL_OR = 8;	// ||
vimlangGenerator.ORDER_TRINARY = 9;		// expr2 ? expr1 : expr1
vimlangGenerator.ORDER_NONE = 99;		// (...)
/* Lowest precedence */

vimlangGenerator['vim::literal::number'] = function(block) {
    let base = block.getFieldValue('num_base');
    switch (base){
        case '2':
            base = '0b'
            break;
        case '8':
            base = '0o'
            break;
        case '16':
            base = '0x'
            break;
        case '10':
            base = ''
            break;
    }
    const value = Number(block.getFieldValue('num_value'));
	var order = value >= 0 ? vimlangGenerator.ORDER_ATOMIC : 
				vimlangGenerator.ORDER_UNARY_LOGI_NOT;
    // option 을 받아와야 bin/oct/hex값 구분할 수 있음.
    var code = base + value
    return [code, order];
}

// [ignore this code section]
// 숫자가 너무 길면 (e표시->일반) ex) -0.00004508 >> -4.508e-5
// 숫자가 너무 짧으면 (일반->e표시) ex) 0.1e-1 >> 0.001
/*
vimlangGenerator['vim::literal::float'] = function(block) {
    const value = block.getFieldValue('num_value');
    const valueArray = value.split('.');
    const integerPart = valueArray[0];
    var fractionalPart = valueArray[1];
    var code = '';
    // check output format for floating point
    // should it be like 1.3e+3, -0.2e-5 ... or be like 2.468
    var flag = false;
    for (var i=0; i<fractionalPart.length; i++){
        if(fractionalPart.charAt(i) != '0'){
	    flag = true;
        }
        if(flag){
            code += fractionalPart.charAt(i);
        }
    }
    code = valueArray[0]

    return [code, vimlangGenerator.PRECEDENCE];
}
*/

vimlangGenerator['vim::literal::float'] = function(block) {
    const code = block.getFieldValue('num_value');
    return [code, vimlangGenerator.ORDER_HIGHEST_PRECEDENCE];
}

// string 안에서 작은 따옴표, 큰 따옴표 사용에 제약을 걸어야 하지 않나
vimlangGenerator['vim::literal::string'] = function(block) {
    let code = block.getFieldValue('str_value');
    code =  '\"' + code + '\"' ;
    return [code, vimlangGenerator.ORDER_HIGHEST_PRECEDENCE];
}

vimlangGenerator['vim::literal::literal_string'] = function(block) {
    let code = block.getFieldValue('str_value');
    code =  '\'' + code + '\'' ;
    return [code, vimlangGenerator.ORDER_HIGHEST_PRECEDENCE];
}

// Blob (Binary Large OBject)
vimlangGenerator['vim::literal::blob'] = function(block) {
    var code = block.getFieldValue('byte_value');
    code = '0z' + code;
    return [code, vimlangGenerator.ORDER_HIGHEST_PRECEDENCE];
}

// vim::literal::true, false, none, null 점검필요
vimlangGenerator['vim::literal::true'] = function(block) {
	var code = 'v:true';
    return [code, vimlangGenerator.ORDER_HIGHEST_PRECEDENCE];
}

vimlangGenerator['vim::literal::false'] = function(block) {
    var code = 'v:false';
    return [code, vimlangGenerator.ORDER_HIGHEST_PRECEDENCE];
}

vimlangGenerator['vim::literal::none'] = function(block) {
    var code = 'v:none';
    return [code, vimlangGenerator.ORDER_HIGHEST_PRECEDENCE];
}

vimlangGenerator['vim::literal::null'] = function(block) {
    var code = 'v:null';
    return [code, vimlangGenerator.ORDER_HIGHEST_PRECEDENCE];
}

// TODO
vimlangGenerator['vim::let'] = function(block) {
    let operator = block.getFieldValue('op');
    let var_name = vimlangGenerator.valueToCode(block, 'var_name',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
//    let var_name = vimlangGenerator.statementToCode(block, 'var_name') || '';
    let rhs = vimlangGenerator.valueToCode(block, 'rhs',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
//    let rhs = vimlangGenerator.statementToCode(block, 'rhs') || '';
    switch (operator){
        case 'assign':
            operator = '='
            break;
        case 'add':
	    	operator = '+='
            break;
        case 'sub':
            operator = '-='
            break;
        case 'mul':
            operator = '*='
            break;
        case 'div':
            operator = '/='
            break;
        case 'mod':
            operator = '%='
            break;
        case 'concat':
            operator = '..='
            break;
    }
	// return code를 하니 해결
	// return [code, PRECEDENCE] 와의 차이를 알아야 할듯
	// <해결> -> blockly doc 'Generating Code', 'Type Checks'를 읽어보니 ok.
	let code = 'let' + ' ' + var_name + ' ' + operator + ' ' + rhs;
	return code;

	// generated code의 공백문제로 잠시 하단코드 주석처리
	//return `let ${var_name} ${operator} ${rhs}`;
}

vimlangGenerator['vim::filetype'] = function(block) {
    let operator = block.getFieldValue('onoff');
    switch (operator){
        case 'on':
            operator = 'on'
            break;
        case 'off':
	    	operator = 'off'
            break;
    }
	let code = 'filetype ' + operator;
	return code;
}

vimlangGenerator['vim::finish'] = function(block) {
	var code = 'finish\n';
    return code;
}

//vim options
vimlangGenerator['vim::option::mouse'] = function(block) {
    let op = block.getFieldValue('op');
    let mode = block.getFieldValue('mode');
	let code = '';

    if (op == 'disable'){
        op = '-=';
	} else {
        op = '+=';
	}
	
    code = 'set mouse' + op + mode; 
    return code;
}

vimlangGenerator['vim::option::line_number'] = function(block) {
    let op = block.getFieldValue('op');
	let code = '';

    if (op == 'enable'){
        op = '';
	} else {
        op = 'no';
	}
	
    code = 'set ' + op + 'number'; 
    return code;
}

vimlangGenerator['vim::option::rel_line_number'] = function(block) {
    let op = block.getFieldValue('op');
	let code = '';

    if (op == 'disable'){
        op = 'no';
	} else {
        op = '';
	}
	
    code = 'set ' + op + 'relativenumber'; 
    return code;
}

vimlangGenerator['vim::option::incsearch'] = function(block) {
    let op = block.getFieldValue('op');
	let code = '';

    if (op == 'enable'){
        op = '';
	} else {
        op = 'no';
	}
	
    code = 'set ' + op + 'incsearch'; 
    return code;
}

vimlangGenerator['vim::option::laststatus'] = function(block) {
    let op = block.getFieldValue('op');
	let code = '';

    switch (op){
        case 'disable':
            op = '0'
            break; 
        case 'two_windows':
            op = '1'
            break; 
        case 'always':
            op = '2'
            break; 
	}
	
    code = 'set laststatus' + '=' + op; 
    return code;
}

vimlangGenerator['vim::option::ignorecase'] = function(block) {
    let op = block.getFieldValue('op');
    let add_smart_case = '';
	let code = '';

    switch (op){
        case 'ignore':
            op = 'no'
            break; 
        case 'not_ignore':
            op = ''
            break; 
        case 'smart':
            op = ''
            add_smart_case = '\nset smartcase'
            break; 
	}
	
    code = 'set ' + op + 'ignorecase' + add_smart_case; 
    return code;
}

vimlangGenerator['vim::option::shortmess'] = function(block) {
	var OPTIONS = {
			'file_abbr': 'f',
			'noeol_abbr': 'i',
			'lines_bytes_abbr': 'l',
			'Modified_abbr': 'm',
			'New_File_abbr': 'n',
			'readonly_abbr': 'r',
			'written_abbr': 'w',
			'dos_format_abbr': 'x',
			'all_abbr': 'a',
			'overwrite_msg_wrfile': 'o',
			'overwrite_msg_any': 'O',
			'search_hit_bottom': 's',
			'truncate': 't',
			'Truncate': 'T',
			'written_msg': 'W',
			'attention_msg': 'A',
			'disable_intro_msg': 'I',
			'disable_ins_compl_menu_msg': 'c',
			'recording_msg': 'q',
			'disable_file_info': 'F',
			'disable_search_count': 'S'
	}
    let option = OPTIONS[block.getFieldValue('option')];
    let operator = block.getFieldValue('operator');
    switch (operator){
        case 'enable':
            operator = '-='
            break;
        case 'disable':
            operator = '+='
            break;
	}

	let code = '';

    code = 'set shortmess' + operator + '' + option; 
    return code;
}

vimlangGenerator['vim::option::indent'] = function(block) {
	let code = '';
	let operator  = block.getFieldValue('operator');
    switch (operator){
        case 'enable':
            operator = ''
            break;
        case 'disable':
            operator = 'no'
            break;
	}

	var OPTIONS = {
			'auto': 'auto',
			'c-style': 'c',
			'smart': 'smart',
	}

    let option = OPTIONS[block.getFieldValue('op')];

	if (option == 'smart'){
        code = 'set ' + operator + 'autoindent\n'
	}	
	
    code += 'set ' + operator + option + 'indent'; 
    return code;
}

vimlangGenerator['vim::option::hlsearch'] = function(block) {
	let code = '';
	let operator  = block.getFieldValue('operator');
    switch (operator){
        case 'enable':
            operator = ''
            break;
        case 'disable':
            operator = 'no'
            break;
	}

    code += 'set ' + operator + 'hlsearch'; 
    return code;
}

vimlangGenerator['vim::ident'] = function(block) {
    let option = block.getFieldValue('var_ns');    // gets Json values from k:v
    let var_name = block.getFieldValue('var_name');
    switch (option){
        case 'def':
            option = ''
            break;
        case 'a':
            option = 'a:'
            break;
        case 'b':
            option = 'b:'
            break;
        case 'g':
            option = 'g:'
            break;
        case 'l':
            option = 'l:'
            break;
        case 's':
            option = 's:'
            break;
        case 't':
            option = 'c:'
            break;
        case 'w':
            option = 'w:'
            break;
        case 'v':
            option = 'v:'
            break;
    }
    let code = option + var_name;
    return [code, vimlangGenerator.ORDER_HIGHEST_PRECEDENCE];
}

vimlangGenerator['vim::operator::add'] = function(block) {
    let term1 = vimlangGenerator.valueToCode(block, 'term1',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    let term2 = vimlangGenerator.valueToCode(block, 'term2',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    let code = term1 + ' + ' + term2;
    return [code, vimlangGenerator.ORDER_ADD_SUB];
}

vimlangGenerator['vim::operator::sub'] = function(block) {
    let term1 = vimlangGenerator.valueToCode(block, 'term1',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    let term2 = vimlangGenerator.valueToCode(block, 'term2',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    let code = term1 + ' - ' + term2;
    return [code, vimlangGenerator.ORDER_ADD_SUB];
}

vimlangGenerator['vim::operator::mul'] = function(block) {
    let term1 = vimlangGenerator.valueToCode(block, 'term1',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    let term2 = vimlangGenerator.valueToCode(block, 'term2',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    let code = term1 + ' * ' + term2;
    return [code, vimlangGenerator.ORDER_MUL_DIV];
}

vimlangGenerator['vim::operator::div'] = function(block) {
    let term1 = vimlangGenerator.valueToCode(block, 'term1',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    let term2 = vimlangGenerator.valueToCode(block, 'term2',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    let code = term1 + ' / ' + term2;
    return [code, vimlangGenerator.ORDER_MUL_DIV];
}

vimlangGenerator['vim::operator::mod'] = function(block) {
    let term1 = vimlangGenerator.valueToCode(block, 'term1',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    let term2 = vimlangGenerator.valueToCode(block, 'term2',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    let code = term1 + ' % ' + term2;
    return [code, vimlangGenerator.ORDER_MUL_DIV];
}

vimlangGenerator['vim::operator::unary_add'] = function(block) {
    let code = vimlangGenerator.valueToCode(block, 'base',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    code = '(+' + code + ')'
    return [code, vimlangGenerator.ORDER_UNARY_LOGI_NOT];
}

vimlangGenerator['vim::operator::unary_sub'] = function(block) {
    let code = vimlangGenerator.valueToCode(block, 'base',
		    vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    code = '(+' + code + ')'
    return [code, vimlangGenerator.ORDER_UNARY_LOGI_NOT];
}

vimlangGenerator['vim::operator::concat'] = function(block) {
//    let term1 = vimlangGenerator.statementToCode(block, 'term1') || '';
//    let term2 = vimlangGenerator.statementToCode(block, 'term2') || '';
//    let term1_noindent = term1.trim();
//    let term2_noindent = term2.trim();
//    let code = term1_noindent + ' .. ' + term2_noindent;
    let term1 = vimlangGenerator.valueToCode(block, 'term1', vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    let term2 = vimlangGenerator.valueToCode(block, 'term2', vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
    let code = term1 + ' .. ' + term2;
    return [code, vimlangGenerator.ORDER_ADD_SUB];
}

vimlangGenerator['vim::operator::cmp'] = function(block) {
	let lhs = vimlangGenerator.valueToCode(block, 'lhs',
								vimlangGenerator.ORDER_LOGICAL_COMP);
	let rhs = vimlangGenerator.valueToCode(block, 'rhs',
								vimlangGenerator.ORDER_LOGICAL_COMP);
	let _case = block.getFieldValue('case');
	let comp = block.getFieldValue('comparator');
	let code;

	switch (_case){
		case '':
			_case = ''
			break;
		case '#':
			_case = '#'
			break;
		case '?':
			_case = '?'
			break;
	}
	switch (comp){
        case '==':
		    comp = '=='
			break;
        case '!=':
		    comp = '!='
			break;
        case '>':
		    comp = '>'
			break;
        case '>=':
		    comp = '>='
			break;
        case '<':
		    comp = '<'
			break;
        case '<=':
		    comp = '<='
			break;
        case '=~':
		    comp = '=~'
			break;
	    case '!~':
		    comp = '!~'
			break;
	    case 'is':
		    comp = 'is'
			break;
        case 'isnot':
		    comp = 'isnot'
			break;
	}
	code = lhs + ' ' + comp + _case + ' ' + rhs;
	return [code, vimlangGenerator.ORDER_LOGICAL_COMP];
}


vimlangGenerator['vim::operator::and'] = function(block) {
	let lhs = vimlangGenerator.valueToCode(block, 'term1',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let rhs = vimlangGenerator.valueToCode(block, 'term2',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let code = lhs + ' && ' + rhs;
	return [code, vimlangGenerator.ORDER_LOGICAL_AND];
}

vimlangGenerator['vim::operator::or'] = function(block) {
	let lhs = vimlangGenerator.valueToCode(block, 'term1',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let rhs = vimlangGenerator.valueToCode(block, 'term2',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let code = lhs + ' || ' + rhs;
	return [code, vimlangGenerator.ORDER_LOGICAL_OR];
}

vimlangGenerator['vim::operator::not'] = function(block) {
	let expr = vimlangGenerator.valueToCode(block, 'base',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let code = '!' + expr;
	return [code, vimlangGenerator.ORDER_UNARY_LOGI_NOT];
}

// CHECK IF NESTED BLOCKS CAN BE INTERPRETED (faulty)
vimlangGenerator['vim::operator::trinary'] = function(block) {
	let ctrl = vimlangGenerator.valueToCode(block, 'control',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let iftrue = vimlangGenerator.valueToCode(block, 'true',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let iffalse = vimlangGenerator.valueToCode(block, 'false',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let code = ctrl + ' ? ' + iftrue  + ' : ' + iffalse;
	return [code, vimlangGenerator.ORDER_TRINARY];
}

vimlangGenerator['vim::operator::falsy'] = function(block) {
	let ctrl = vimlangGenerator.valueToCode(block, 'control',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let fallback = vimlangGenerator.valueToCode(block, 'fallback',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let code = ctrl + ' ?? ' + fallback;
	return [code, vimlangGenerator.ORDER_TRINARY];
}

//list
vimlangGenerator['vim::operator::index'] = function(block) {
	let idx = vimlangGenerator.valueToCode(block, 'index',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let base = vimlangGenerator.valueToCode(block, 'base',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let code = base + '[' + idx + ']';
	return [code, vimlangGenerator.ORDER_LIST_DICT];
}

// dictionary
vimlangGenerator['vim::operator::entry'] = function(block) {
	let index = vimlangGenerator.valueToCode(block, 'index',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let base = vimlangGenerator.valueToCode(block, 'base',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let code = base + '.' + index;
	return [code, vimlangGenerator.ORDER_LIST_DICT];
}

//list
vimlangGenerator['vim::operator::slice'] = function(block) {
	let idx_from = vimlangGenerator.valueToCode(block, 'index_from',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let idx_to = vimlangGenerator.valueToCode(block, 'index_to',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let base = vimlangGenerator.valueToCode(block, 'base',
								vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
	let code = base + '[' + idx_from + ':'+ idx_to + ']';
	return [code, vimlangGenerator.ORDER_LIST_DICT];
}

//if statement
// if-endif
// if-else-endif
// if-elseif-else-endif
// ...
// TODO
// to support all the previous statements, mutator is mandatory
vimlangGenerator['vim::function::if'] = function(block) {
	let condition = vimlangGenerator.valueToCode(block, 'condition',
								vimlangGenerator.ORDER_NONE) || '';
//	let do_sth = vimlangGenerator.valueToCode(block, 'do_sth',
//								vimlangGenerator.ORDER_NONE) || '';
    let do_sth = vimlangGenerator.statementToCode(block, 'do_sth') || '';
	let indent = vimlangGenerator.INDENT;
/* after adding Mutator for [vim::function::if] enable these commented-out codes*/

//	let valueCode = do_sth;
//	const values = [];
//	for (var i=0; i<block.itemcount_; i++){
//		let valueCode = vimlangGenerator.valueToCode(block, 'do_sth' + i,
//									vimlangGenerator.ORDER_HIGHEST_PRECEDENCE);
//		if (valueCode) {
//			values.push(valueCode);
//		}
//	}
//	let valueString = values.join(',\n');
//	const indentedValueString = vimlangGenerator.prefixLines(valueString, 
//												vimlangGenerator.INDENT);
//	let codestring = 'if ' + condition + ' \n' + indentedValueString + '\nendif';
    let codestring = 'if' + condition + '\n' + indent + do_sth + '\nendif';
	return codestring;
}

vimlangGenerator['vim::plugin::wrapper'] = function(block) {
    let plugin_list = vimlangGenerator.statementToCode(block, 'vundle_plugins') || '';
//	let indent = vimlangGenerator.INDENT;
//	rtp is runtime path (TODO) make rtp block
    let codestring = 'set rtp+=~/.vim/bundle/Vundle.vim\n' + 
                     'call vundle#begin()\n' + 
                     plugin_list + '\n' + 
                     'call vundle#end()';
	return codestring;
}

vimlangGenerator['vim::plugin::add_plugin'] = function(block) {
	let plugin_repo = vimlangGenerator.valueToCode(block, 'plugin_repo',
								vimlangGenerator.ORDER_NONE) || '';
    let code = 'Plugin ' + plugin_repo;
	return code;
}

vimlangGenerator.scrub_ = function(block, code, opt_thisOnly = false) {
// Author: luma (back-up code)
    const nextBlock = 
        block.nextConnection && block.nextConnection.targetBlock();
    let nextCode = '';
    if (nextBlock) {
        nextCode = 
            opt_thisOnly ? '' : '\n' + vimlangGenerator.blockToCode(nextBlock);
	}
    return code + nextCode;
//  Author: eatch
//    const
//        next_block = block.nextConnection && block.nextConnection.targetBlock(),
//        next_code = opt_thisOnly ? '' : this.blockToCode(next_block);
//    return code + next_code;
};

export default vimlangGenerator;
