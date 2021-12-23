/* eslint-disable no-lone-blocks */
import Blockly from 'blockly';

const init = (() => {
	let called = false;
	return function() {
		if(called) {
			console.warn('Vim component was already initialized; ignoring this call');
			return;
		}
		function is_variable(str) {
			return /^(?:[aglstvw]:)?(?:\w+#)*[A-Za-z_]\w*$/.test(str)
				? str
				: null;
		}
		function is_key(str) {
			return /^\w*$/.test(str)
				? str
				: null;
		}
		function mutator_template(
			ident,
			{ updateShape_, compose, decompose },
			field_name,
			workspace
		) {
			const mixin = {
				mutationToDom() {
					const mutation = Blockly.utils.xml.createElement('mutation');
					for(const x of field_name)
						mutation.setAttribute(x, this.getFieldValue(x));
					return mutation;
				},
				domToMutation(mutation) {
					const args = {};
					for(const x of field_name)
						if(mutation.hasAttribute(x))
							args[x] = mutation.getAttribute(x);
					this.updateShape_(args);
				},
				updateShape_
			};
			if(compose !== undefined) {
				mixin.compose = compose;
				mixin.decompose = decompose;
			}
			Blockly.Extensions.registerMutator(
				ident,
				mixin,
				function() {
					for(const x of field_name)
						this.getField(x).setValidator(y =>
							this.updateShape_({ [x]: y })
						);
				},
				workspace
			);
		}

		{ // top-level commands
			Blockly.Blocks['vim::let'] = {
				init() {
					this.jsonInit({ type: 'vim::let',
						message0: '%1 %2 %3 %4 %5',
						args0: [
							{ name: 'op',
								type: 'field_dropdown',
								options: [
									['Assign', 'assign'],
									['Add', 'add'],
									['Subtract', 'sub'],
									['Multiply', 'mul'],
									['Divide', 'div'],
									['Modulo', 'mod'],
									['Concatenate', 'concat']
								]
							},
							{ name: 'preposition1',
								type: 'field_label_serializable',
								text: 'to'
							},
							{ name: 'var_name',
								type: 'input_value',
								check: 'vim::lvalue'
							},
							{ name: 'preposition2',
								type: 'field_label_serializable',
								text: ''
							},
							{ name: 'rhs',
								type: 'input_value'
							}
						],
						inputsInline: true,
						previousStatement: null,
						nextStatement: null,
						colour: 330,
						tooltip: 'Assign to a variable',
						helpUrl: 'https://vimhelp.org/eval.txt.html#%3Alet',
						mutator: 'vim::let::mutator'
					});
				}
			};
			Blockly.Blocks['vim::filetype'] = {
				init() {
					this.jsonInit({ type: 'vim::filetype',
						message0: '%1 file type',
						args0: [
							{
								name: 'onoff',
								type: 'field_dropdown',
								options: [
									['Detect', 'on'],
									['Don\'t detect', 'off']
								]
							},

						],
						inputsInline: true,
						previousStatement: null,
						nextStatement: null,
						colour: 330,
						tooltip: 'Detect file type to provide additional feature',
						helpUrl: 'https://vimhelp.org/filetype.txt.html#filetype',
					});
				}
			};
			Blockly.Blocks['vim::finish'] = {
				init() {
					this.jsonInit({ type: 'vim::finish',
						message0: 'finish',
						inputsInline: true,
						previousStatement: null,
						nextStatement: null,
						colour: 330,
						tooltip: 'Stop sourcing vim script file',
						helpUrl: 'https://vimhelp.org/repeat.txt.html#%3Afinish',
					});
				}
			};
			Blockly.Blocks['vim::option::mouse'] = {
				init() {
					this.jsonInit({ type: 'vim::option::mouse',
						message0: '%1 mouse in %2 mode',
						args0: [
							{
								name: 'op',
								type: 'field_dropdown',
								options: [
									['Enable', 'enable'],
									['Disable', 'disable']
								]
							},
							{
								name: 'mode',
								type: 'field_dropdown',
								options: [
									['normal and terminal', 'n'],
									['visual', 'v'],
									['insert', 'i'],
									['command-line', 'c'],
									['all', 'a'],
									['prompt', 'r']
								]
							}
						],
						inputsInline: true,
						previousStatement: null,
						nextStatement: null,
						colour: 330,
						tooltip: 'Options to enable/disable the use of mouse clicks',
						helpUrl: 'https://vimhelp.org/options.txt.html#%27mouse%27',
					});
				}
			};
			Blockly.Blocks['vim::option::line_number'] = {
				init() {
					this.jsonInit({ type: 'vim::option::line_number',
						message0: '%1 line number',
						args0: [
							{
								name: 'op',
								type: 'field_dropdown',
								options: [
									['Enable', 'enable'],
									['Disable', 'disable']
								]
							}
						],
						inputsInline: true,
						previousStatement: null,
						nextStatement: null,
						colour: 330,
						tooltip: 'Option to show/hide line number in front of each line',
						helpUrl: 'https://vimhelp.org/options.txt.html#%27number%27',
					});
				}
			};
			Blockly.Blocks['vim::option::rel_line_number'] = {
				init() {
					this.jsonInit({ type: 'vim::option::rel_line_number',
						message0: '%1 relative line number',
						args0: [
							{
								name: 'op',
								type: 'field_dropdown',
								options: [
									['Enable', 'enable'],
									['Disable', 'disable']
								]
							}
						],
						inputsInline: true,
						previousStatement: null,
						nextStatement: null,
						colour: 330,
						tooltip: 'Option to show/hide relative line number',
						helpUrl: 'https://vimhelp.org/options.txt.html#%27relativenumber%27',
					});
				}
			};
			Blockly.Blocks['vim::option::incsearch'] = {
				init() {
					this.jsonInit({ type: 'vim::option::incsearch',
						message0: '%1 incremental search',
						args0: [
							{
								name: 'op',
								type: 'field_dropdown',
								options: [
									['Enable', 'enable'],
									['Disable', 'disable']
								]
							}
						],
						inputsInline: true,
						previousStatement: null,
						nextStatement: null,
						colour: 330,
						tooltip: 'Option to enable/disable to show matching pattern while typing a search command',
						helpUrl: 'https://vimhelp.org/options.txt.html#%27incsearch%27',
					});
				}
			};
			Blockly.Blocks['vim::option::laststatus'] = {
				init() {
					this.jsonInit({ type: 'vim::option::laststatus',
						message0: '%1 status line',
						args0: [
							{
								name: 'op',
								type: 'field_dropdown',
								options: [
									['Disable', 'disable'],
									['Enable (with 2+ windows)', 'two_windows'],
									['Enable (always)', 'always']
								]
							}
						],
						inputsInline: true,
						previousStatement: null,
						nextStatement: null,
						colour: 330,
						tooltip: 'Option to enable/disable status line of vim',
						helpUrl: 'https://vimhelp.org/options.txt.html#%27laststatus%27',
					});
				}
			};
			Blockly.Blocks['vim::option::ignorecase'] = {
				init() {
					this.jsonInit({ type: 'vim::option::ignorecase',
						message0: '%1 in search patterns',
						args0: [
							{
								name: 'op',
								type: 'field_dropdown',
								options: [
									['Ignore case', 'ignore'],
									['Match case (when uppercase letter exists)', 'smart'],
									['Match case (always)', 'not_ignore'],
								]
							}
						],
						inputsInline: true,
						previousStatement: null,
						nextStatement: null,
						colour: 330,
						tooltip: 'Option to choose case-sensitivity in search patterns',
						helpUrl: 'https://vimhelp.org/options.txt.html#%27ignorecase%27',
						//helpUrl1: 'https://vimhelp.org/options.txt.html#%27smartcase%27',
					});
				}
			};
			Blockly.Blocks['vim::option::shortmess'] = {
				init() {
					this.jsonInit({ type: 'vim::option::shortmess',
						message0: 'shortmess %1 %2',
						args0: [
							{
								name: 'operator',
								type: 'field_dropdown',
								options: [
									['Enable', 'enable'],
									['Disable', 'disable']
								]
							},
							{
								name: 'option',
								type: 'field_dropdown',
								options: [
									['f', 'file_abbr'],
									['i', 'noeol_abbr'],
									['l', 'lines_bytes_abbr'],
									['m', 'Modified_abbr'],
									['n', 'New_File_abbr'],
									['r', 'readonly_abbr'],
									['w', 'written_abbr'],
									['x', 'dos_format_abbr'],
									['a', 'all_abbr'],
									['o', 'overwrite_msg_wrfile'],
									['O', 'overwrite_msg_any'],
									['s', 'search_hit_bottom'],
									['t', 'truncate'],
									['T', 'Truncate'],
									['W', 'written_msg'],
									['A', 'attention_msg'],
									['I', 'disable_intro_msg'],
									['c', 'disable_ins_compl_menu_msg'],
									['q', 'recording_msg'],
									['F', 'disable_file_info'],
									['S', 'disable_search_count'],
								]
							},
						],
						inputsInline: true,
						previousStatement: null,
						nextStatement: null,
						colour: 330,
						tooltip: 'Option to choose case-sensitivity in search patterns',
						helpUrl: 'https://vimhelp.org/options.txt.html#%27shortmess%27',
					});
				}
			};
			Blockly.Blocks['vim::option::indent'] = {
				init() {
					this.jsonInit({ type: 'vim::option::indent',
						message0: '%1 %2 indent',
						args0: [
							{
								name: 'operator',
								type: 'field_dropdown',
								options: [
									['Enable', 'enable'],
									['Disable', 'disable'],
								]
							},
							{
								name: 'op',
								type: 'field_dropdown',
								options: [
									['Auto', 'auto'],
									['C-style', 'c-style'],
									['Smart(by syntax/style)', 'smart'],
								]
							}
						],
						inputsInline: true,
						previousStatement: null,
						nextStatement: null,
						colour: 330,
						tooltip: 'Copying indent from current line when starting a new line',
						helpUrl: 'https://vimhelp.org/options.txt.html#%27autoindent%27',
						//helpUrl: 'https://vddimhelp.org/options.txt.html#%27smartindent%27',
					});
				}
			};
			Blockly.Blocks['vim::option::hlsearch'] = {
				init() {
					this.jsonInit({ type: 'vim::option::hlsearch',
						message0: '%1 highlighting',
						args0: [
							{
								name: 'operator',
								type: 'field_dropdown',
								options: [
									['Enable', 'enable'],
									['Disable', 'disable'],
								]
							},
						],
						inputsInline: true,
						previousStatement: null,
						nextStatement: null,
						colour: 330,
						tooltip: 'highlight all matching search pattern',
						helpUrl: 'https://vimhelp.org/options.txt.html#%27hlsearch%27',
					});
				}
			};
		}

		{ // identifier
			Blockly.Blocks['vim::ident'] = {
				init() {
					this.jsonInit({ type: 'vim::ident',
						message0: '%1 %2',
						args0: [
							{ name: 'var_ns',
								type: 'field_dropdown',
								options: [
									['(default)', 'def'],
									['argument', 'a'],
									['buffer', 'b'],
									['global', 'g'],
									['local', 'l'],
									['script', 's'],
									['tab page', 't'],
									['window', 'w'],
									['Vim', 'v']
								]
							},
							{ name: 'var_name',
								type: 'field_input',
								text: 'var'
							}
						],
						output: ['vim::lvalue', 'vim::unknown'],
						colour: 180,
						tooltip: 'A variable name',
						helpUrl: 'https://vimhelp.org/eval.txt.html#internal-variables'
					});
					this.getField('var_name').setValidator(is_variable);
				}
			};
		}

		{ // literals
			Blockly.Blocks['vim::literal::number'] = {
				init() {
					this.jsonInit({ type: 'vim::literal::number',
						message0: '%1 %2',
						args0: [
							{ name: 'num_base',
								type: 'field_dropdown',
								options: [
									['integer', '10'],
									['0b', '2'],
									['0o', '8'],
									['0x', '16']
								]
							},
							{ name: 'num_value',
								type: 'field_input',
								text: '0'
							}
						],
						output: 'vim::number',
						colour: 150,
						tooltip: 'An integer value',
						helpUrl: 'https://vimhelp.org/eval.txt.html#Number'
					});
					this.getField('num_value').setValidator(num_value => {
						const num_base = this.getFieldValue('num_base');
						return {
							2: /^-?[01]+$/,
							8: /^-?[0-7]+$/,
							10: /^-?\d+$/,
							16: /^-?[\da-f]+$/i
						}[num_base].test(num_value)
							? num_value
							: null;
					});
				}
			};
			Blockly.Blocks['vim::literal::float'] = {
				init() {
					this.jsonInit({ type: 'vim::literal::float',
						message0: 'float %1',
						args0: [
							{ name: 'num_value',
								type: 'field_input',
								text: '0.0'
							}
						],
						output: 'vim::float',
						colour: 150,
						tooltip: 'A floating-point value',
						helpUrl: 'https://vimhelp.org/eval.txt.html#Float'
					});
					this.getField('num_value').setValidator(num_value => (
						/^[-+]?\d+\.\d+(?:e[-+]?\d+)?$/i.test(num_value)
							? num_value
							: null
					));
				}
			};
			Blockly.Blocks['vim::literal::string'] = {
				init() {
					this.jsonInit({ type: 'vim::literal::string',
						message0: '"%1"',
						args0: [
							{ name: 'str_value',
								type: 'field_input',
								text: ''
							}
						],
						output: 'vim::string',
						colour: 30,
						tooltip: 'A double-quote string',
						helpUrl: 'https://vimhelp.org/eval.txt.html#String'
					});
					this.getField('str_value').setValidator(str_value => (
						/^(?:[^"\\]|\\(?:[^0-7<UuXx]|[0-7]{1,3}|[Xx][\dA-Fa-f]{1,2}|u[\dA-Fa-f]{1,4}|U[\dA-Fa-f]{1,8}|<[^>]+>))*$/
							.test(str_value)
								? str_value
								: null
					));
				}
			};
			Blockly.Blocks['vim::literal::literal_string'] = {
				init() {
					this.jsonInit({ type: 'vim::literal::literal_string',
						message0: "'%1'",
						args0: [
							{ name: 'str_value',
								type: 'field_input',
								text: ''
							}
						],
						output: 'vim::literal_string',
						colour: 30,
						tooltip: 'A single-quote string without escapes',
						helpUrl: 'https://vimhelp.org/eval.txt.html#literal-string'
					});
					this.getField('str_value').setValidator(str_value => (
						/^(?:[^']|'')*$/.test(str_value)
							? str_value
							: null
					));
				}
			};
			Blockly.Blocks['vim::literal::blob'] = {
				init() {
					this.jsonInit({ type: 'vim::literal::blob',
						message0: '0z%1',
						args0: [
							{ name: 'byte_value',
								type: 'field_input',
								text: ''
							}
						],
						output: 'vim::blob',
						colour: 30,
						tooltip: 'A binary object',
						helpUrl: 'https://vimhelp.org/eval.txt.html#Blob'
					});
					this.getField('byte_value').setValidator(byte_value => (
						/^(?:[\da-f]{2}(?:\.?[\da-f]{2})*)?$/i.test(byte_value)
							? byte_value
							: null
					));
				}
			};
			Blockly.Blocks['vim::literal::true'] = {
				init() {
					this.jsonInit({ type: 'vim::literal::true',
						message0: 'True',
						output: ['vim::number', 'vim::special'],
						colour: 240,
						tooltip: 'A true value',
						helpUrl: 'https://vimhelp.org/eval.txt.html#v%3Atrue'
					});
				}
			};
			Blockly.Blocks['vim::literal::false'] = {
				init() {
					this.jsonInit({ type: 'vim::literal::false',
						message0: 'False',
						output: ['vim::number', 'vim::special'],
						colour: 240,
						tooltip: 'A false value',
						helpUrl: 'https://vimhelp.org/eval.txt.html#v%3Afalse'
					});
				}
			};
			Blockly.Blocks['vim::literal::none'] = {
				init() {
					this.jsonInit({ type: 'vim::literal::none',
						message0: 'None',
						output: ['vim::number', 'vim::special'],
						colour: 240,
						tooltip: 'A none value',
						helpUrl: 'https://vimhelp.org/eval.txt.html#v%3Anone'
					});
				}
			};
			Blockly.Blocks['vim::literal::null'] = {
				init() {
					this.jsonInit({ type: 'vim::literal::null',
						message0: 'Null',
						output: ['vim::number', 'vim::special'],
						colour: 240,
						tooltip: 'A null value',
						helpUrl: 'https://vimhelp.org/eval.txt.html#v%3Anull'
					});
				}
			};
		}

		{ // operators
			{ // precedence 8
				Blockly.Blocks['vim::operator::index'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::index',
							message0: 'item %1 of %2',
							args0: [
								{ name: 'index',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								},
								{ name: 'base',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string', 'vim::list', 'vim::dict', 'vim::blob']
								}
							],
							inputsInline: true,
							// vim::string -> vim::string, vim::blob -> vim::number, * -> vim::unknown
							output: ['vim::lvalue', 'vim::string', 'vim::number', 'vim::unknown'],
							colour: 60,
							tooltip: 'Take an item from n-th position',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-%5B%5D'
						});
					}
				};
				Blockly.Blocks['vim::operator::slice'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::slice',
							message0: 'list of %1th to %2th from %3',
							args0: [
								{ name: 'index_from',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								},
								{ name: 'index_to',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								},
								{ name: 'base',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string', 'vim::list', 'vim::blob']
								}
							],
							inputsInline: true,
							// vim::string -> vim::string, vim::blob -> vim::blob, vim::list -> vim::list
							output: ['vim::lvalue', 'vim::string', 'vim::blob', 'vim::list'],
							colour: 60,
							tooltip: 'Take a substring or sublist',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-%5B%3A%5D'
						});
					}
				};
				Blockly.Blocks['vim::operator::entry'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::entry',
							message0: 'item %1 of %2',
							args0: [
								{ name: 'index',
									type: 'field_input'
								},
								{ name: 'base',
									type: 'input_value',
									check: ['vim::unknown', 'vim::dict']
								}
							],
							inputsInline: true,
							output: ['vim::lvalue', 'vim::unknown'],
							colour: 60,
							tooltip: 'Take an item by name',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-entry'
						});
						this.getField('index').setValidator(is_key);
					}
				};
				Blockly.Blocks['vim::operator::call'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::call',
							message0: 'call %1',
							message1: '%1 %2',
							args0: [
								{ name: 'function',
									type: 'input_value',
									check: ['vim::unknown', 'vim::function', 'vim::funcref'],
									align: 'RIGHT'
								}
							],
							args1: [
								{ name: 'arg_count',
									type: 'field_number',
									value: 0,
									min: 0,
									max: 20,
									precision: 1
								},
								{ name: 'arg_label',
									type: 'field_label_serializable',
									text: 'args'
								}
							],
							inputsInline: false,
							output: 'vim::unknown',
							colour: 120,
							tooltip: 'Call a function',
							helpUrl: 'https://vimhelp.org/eval.txt.html#functions',
							mutator: 'vim::operator::call::mutator'
						});
					}
				};
				Blockly.Blocks['vim::operator::method'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::method',
							message0: 'with %1',
							message1: 'call %1',
							message2: '%1 %2',
							args0: [
								{ name: 'value',
									type: 'input_value',
									align: 'RIGHT'
								}
							],
							args1: [
								{ name: 'function',
									type: 'input_value',
									check: ['vim::unknown', 'vim::function', 'vim::funcref'],
									align: 'RIGHT'
								}
							],
							args2: [
								{ name: 'arg_count',
									type: 'field_number',
									value: 0,
									min: 0,
									max: 20,
									precision: 1
								},
								{ name: 'arg_label',
									type: 'field_label_serializable',
									text: 'args'
								}
							],
							inputsInline: false,
							output: 'vim::unknown',
							colour: 120,
							tooltip: 'Call a method using a value',
							helpUrl: 'https://vimhelp.org/eval.txt.html#method',
							mutator: 'vim::operator::method::mutator'
						});
					}
				};
			}
			{ // precedence 7
				Blockly.Blocks['vim::operator::not'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::not',
							message0: 'not %1',
							args0: [
								{ name: 'base',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::float', 'vim::string']
								}
							],
							inputsInline: true,
							// vim::float -> vim::float, * -> vim::number
							output: ['vim::float', 'vim::number'],
							colour: 240,
							tooltip: 'Negate a value',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-%21'
						});
					}
				};
				Blockly.Blocks['vim::operator::unary_sub'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::unary_sub',
							message0: 'minus %1',
							args0: [
								{ name: 'base',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::float', 'vim::string']
								}
							],
							inputsInline: true,
							output: ['vim::float', 'vim::number'], // vim::float -> vim::float, * -> vim::number
							colour: 150,
							tooltip: 'Flip the sign of a value',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-unary--'
						});
					}
				};
				Blockly.Blocks['vim::operator::unary_add'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::unary_add',
							message0: 'plus %1',
							args0: [
								{ name: 'base',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::float', 'vim::string']
								}
							],
							inputsInline: true,
							output: ['vim::float', 'vim::number'], // vim::float -> vim::float, * -> vim::number
							colour: 150,
							tooltip: 'Leave the number unchanged',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-unary-+'
						});
					}
				};
			}
			{ // precedence 6
				Blockly.Blocks['vim::operator::mul'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::mul',
							message0: '%1 × %2',
							args0: [
								{ name: 'term1',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::float', 'vim::string']
								},
								{ name: 'term2',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::float', 'vim::string']
								}
							],
							inputsInline: true,
							// includes vim::float -> vim::float, * -> vim::number
							output: ['vim::float', 'vim::number'],
							colour: 150,
							tooltip: 'Multiply numbers',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-star'
						});
					}
				};
				Blockly.Blocks['vim::operator::div'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::div',
							message0: '%1 ÷ %2',
							args0: [
								{ name: 'term1',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::float', 'vim::string']
								},
								{ name: 'term2',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::float', 'vim::string']
								}
							],
							inputsInline: true,
							output: ['vim::float', 'vim::number'], // includes vim::float -> vim::float, * -> vim::number
							colour: 150,
							tooltip: 'Divide numbers',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-%2F'
						});
					}
				};
				Blockly.Blocks['vim::operator::mod'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::mod',
							message0: '%1 mod %2',
							args0: [
								{ name: 'term1',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								},
								{ name: 'term2',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								}
							],
							inputsInline: true,
							output: 'vim::number',
							colour: 150,
							tooltip: 'Take remainder of division',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-%25'
						});
					}
				};
			}
			{ // precedence 5
				Blockly.Blocks['vim::operator::add'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::add',
							message0: '%1 + %2',
							args0: [
								{ name: 'term1',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::float', 'vim::string']
								},
								{ name: 'term2',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::float', 'vim::string']
								}
							],
							inputsInline: true,
							// includes vim::float -> vim::float, * -> vim::number
							output: ['vim::float', 'vim::number'],
							colour: 150,
							tooltip: 'Add numbers',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-%2B'
						});
					}
				};
				Blockly.Blocks['vim::operator::sub'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::sub',
							message0: '%1 - %2',
							args0: [
								{ name: 'term1',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::float', 'vim::string']
								},
								{ name: 'term2',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::float', 'vim::string']
								}
							],
							inputsInline: true,
							// includes vim::float -> vim::float, * -> vim::number
							output: ['vim::float', 'vim::number'],
							colour: 150,
							tooltip: 'Subtract numbers',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr--'
						});
					}
				};
				Blockly.Blocks['vim::operator::concat'] = { // .. only, maybe no support for .
					init() {
						this.jsonInit({ type: 'vim::operator::concat',
							message0: '%1 .. %2',
							args0: [
								{ name: 'term1',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								},
								{ name: 'term2',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								}
							],
							inputsInline: true,
							output: 'vim::string',
							colour: 30,
							tooltip: 'Concatenate strings',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-..'
						});
					}
				};
			}
			{ // precedence 4
				Blockly.Blocks['vim::operator::cmp'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::cmp',
							message0: '%1 %2 %3 %4',
							args0: [
								{ name: 'lhs',
									type: 'input_value'
								},
								{ name: 'case',
									type: 'field_dropdown',
									options: [
										['default', ''],
										['case-sensitively', '#'],
										['case-insensitively', '?']
									]
								},
								{ name: 'comparator',
									type: 'field_dropdown',
									options: [
										['==', '=='],
										['!=', '!='],
										['>', '>'],
										['>=', '>='],
										['<', '<'],
										['<=', '<='],
										['match', '=~'],
										['no match', '!~'],
										['same instance', 'is'],
										['different instance', 'isnot']
									]
								},
								{ name: 'rhs',
									type: 'input_value'
								}
							],
							inputsInline: true,
							output: 'vim::number',
							colour: 240,
							tooltip: 'Check if lhs is equal to rhs (follows ignorecase)',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-%3D%3D',
							mutator: 'vim::operator::cmp::mutator'
						});
					}
				};
			}
			{ // precedence 3
				Blockly.Blocks['vim::operator::and'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::and',
							message0: '%1 && %2',
							args0: [
								{ name: 'term1',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								},
								{ name: 'term2',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								}
							],
							inputsInline: true,
							output: 'vim::number',
							colour: 240,
							tooltip: 'Check if all terms are true',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-%26%26'
						});
					}
				};
			}
			{ // precedence 2
				Blockly.Blocks['vim::operator::or'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::or',
							message0: '%1 || %2',
							args0: [
								{ name: 'term1',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								},
								{ name: 'term2',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								}
							],
							inputsInline: true,
							output: 'vim::number',
							colour: 240,
							tooltip: 'Check if at least one term is true',
							helpUrl: 'https://vimhelp.org/eval.txt.html#expr-barbar'
						});
					}
				};
			}
			{ // precedence 1
				Blockly.Blocks['vim::operator::trinary'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::trinary',
							message0: '%1 ? %2 : %3',
							args0: [
								{ name: 'control',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								},
								{ name: 'true',
									type: 'input_value'
								},
								{ name: 'false',
									type: 'input_value'
								}
							],
							inputsInline: true,
							output: 'vim::unknown',
							colour: 240,
							tooltip: 'Select second or third term based on the first term',
							helpUrl: 'https://vimhelp.org/eval.txt.html#trinary'
						});
					}
				};
				Blockly.Blocks['vim::operator::falsy'] = {
					init() {
						this.jsonInit({ type: 'vim::operator::falsy',
							message0: '%1 ?? %2',
							args0: [
								{ name: 'control',
									type: 'input_value'
								},
								{ name: 'fallback',
									type: 'input_value'
								}
							],
							inputsInline: true,
							output: 'vim::unknown',
							colour: 240,
							tooltip: 'Select a term based on the truthiness of first term',
							helpUrl: 'https://vimhelp.org/eval.txt.html#%3F%3F'
						});
					}
				};
			}
			{ // precedence lowest?
				Blockly.Blocks['vim::function::if'] = {
					init() {
						this.jsonInit({ type: 'vim::function::if',
							message0: 'if %1 do %2',
							args0: [
								{
									name: 'condition',
									type: 'input_value',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								},
								{
									name: 'do_sth',
									type: 'input_statement',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								}
							],
							inputsInline: true,
							previousStatement: null,
							nextStatement: null,
							colour: 0,
							tooltip: 'Conditinal statement for handling decisions',
							helpUrl: 'https://vimhelp.org/eval.txt.html#%3Aif',
						    //mutator: 'vim::function::if::mutator'
						});
					}
				};
			}
			{
				Blockly.Blocks['vim::plugin::wrapper'] = {
					init() {
						this.jsonInit({ type: 'vim::plugin::wrapper',
							message0: 'vundle plugin manager %1',
							args0: [
								{
									name: 'vundle_plugins',
									type: 'input_statement',
									check: ['vim::unknown', 'vim::number', 'vim::string']
								},
							],
							inputsInline: true,
							previousStatement: null,
							nextStatement: null,
							colour: 0,
							tooltip: 'Wrapper for vundle plugin manager',
							helpUrl: 'https://github.com/VundleVim/Vundle.vim',
						    //mutator: 'vim::plugin::wrapper::mutator'
						});
					}
				};
			}
			{
				Blockly.Blocks['vim::plugin::add_plugin'] = {
					init() {
						this.jsonInit({ type: 'vim::plugin::add_plugin',
							message0: 'include plugin %1',
							args0: [
								{
									name: 'plugin_repo',
									type: 'input_value',
									check: ['vim::literal_string']
								},
							],
							inputsInline: true,
							previousStatement: null,
							nextStatement: null,
							colour: 0,
							tooltip: 'plugin name set with github repository name',
							helpUrl: 'https://github.com/VundleVim/Vundle.vim',
						    //mutator: 'vim::plugin::wrapper::mutator'
						});
					}
				};
			}
		}

		mutator_template(
			'vim::let::mutator',
			{
				updateShape_(args) {
					const { op } = {
						op: this.getFieldValue('op'),
						...args
					};
					const [preposition1, preposition2, tooltip] = {
						assign: ['to', '', 'Assign to a variable'],
						add: ['to', '', 'Add to a variable'],
						sub: ['from', '', 'Subtract from a variable'],
						mul: ['', 'by', 'Multiply a variable'],
						div: ['', 'by', 'Divide a variable'],
						mod: ['', 'by', 'Take remainder from a variable'],
						concat: ['to', '', 'Concatenate a string to a variable'],
					}[op];
					this.setFieldValue(preposition1, 'preposition1');
					this.setFieldValue(preposition2, 'preposition2');
					this.setTooltip(tooltip);
				}
			},
			['op']
		);
		mutator_template(
			'vim::operator::call::mutator',
			{
				updateShape_(args) {
					const { arg_count } = {
						arg_count: this.getFieldValue('arg_count'),
						...args
					};
					let actual_arg_count = this.inputList.length - 2;
					while(actual_arg_count < arg_count)
						this.appendValueInput(`arg${actual_arg_count++}`);
					while(actual_arg_count > arg_count)
						this.removeInput(`arg${--actual_arg_count}`);
					this.setFieldValue(
						arg_count === 1
							? 'arg'
							: 'args',
						'arg_label'
					);
				}
			},
			['arg_count']
		);
		mutator_template(
			'vim::operator::method::mutator',
			{
				updateShape_(args) {
					const { arg_count } = {
						arg_count: this.getFieldValue('arg_count'),
						...args
					};
					let actual_arg_count = this.inputList.length - 3;
					while(actual_arg_count < arg_count)
						this.appendValueInput(`arg${actual_arg_count++}`);
					while(actual_arg_count > arg_count)
						this.removeInput(`arg${--actual_arg_count}`);
					this.setFieldValue(
						arg_count === 1
							? 'arg'
							: 'args',
						'arg_label'
					);
				}
			},
			['arg_count']
		);
		mutator_template(
			'vim::operator::cmp::mutator',
			{
				updateShape_(args) {
					const { case: case_, comparator } = {
						case: this.getFieldValue('case'),
						comparator: this.getFieldValue('comparator'),
						...args
					};
					const comp_tooltip = {
						'==': 'is equal to',
						'!=': 'is not equal to',
						'>': 'is greater than',
						'>=': 'is greater than or equal to',
						'<': 'is less than',
						'<=': 'is less than or equal to',
						'=~': 'matches',
						'!~': 'does not match',
						'is': 'is the same instance to',
						'isnot': 'is not the same instance to'
					}[comparator];
					const case_tooltip = {
						'': 'follows ignorecase',
						'#': 'case sensitively',
						'?': 'case insensitively'
					}[case_];
					const token = `${comparator}${case_}`;
					this.setTooltip(`Check if lhs ${comp_tooltip} rhs (${case_tooltip})`);
					this.setHelpUrl(`https://vimhelp.org/eval.txt.html#expr-${encodeURIComponent(token)}`);
				}
			},
			['case', 'comparator']
		);
		called = true;
	}
})();

const toolbox = {
	kind: 'categoryToolbox',
	contents: [
		{ name: 'Command',
			kind: 'category',
			contents: [
				{
					kind: 'block',
					type: 'vim::let'
				},
				{
					kind: 'block',
					type: 'vim::filetype'
				},
				{
					kind: 'block',
					type: 'vim::finish'
				},
				{
					kind: 'block',
					type: 'vim::function::if'
				},
				{
					kind: 'category',
					name: 'Option',
					contents: [
						{
							kind: 'block',
							type: 'vim::option::mouse',
						},
						{
							kind: 'block',
							type: 'vim::option::line_number',
						},
						{
							kind: 'block',
							type: 'vim::option::rel_line_number',
						},
						{
							kind: 'block',
							type: 'vim::option::incsearch',
						},
						{
							kind: 'block',
							type: 'vim::option::laststatus',
						},
						{
							kind: 'block',
							type: 'vim::option::ignorecase',
						},
						{
							kind: 'block',
							type: 'vim::option::shortmess',
						},
						{
							kind: 'block',
							type: 'vim::option::indent',
						},
						{
							kind: 'block',
							type: 'vim::option::hlsearch',
						},
					]
				}
			],
			colour: 330
		},
		{ name: 'Arithmetic',
			kind: 'category',
			contents: [
				{
					kind: 'block',
					type: 'vim::literal::number'
				},
				{
					kind: 'block',
					type: 'vim::literal::float'
				},
				{
					kind: 'block',
					type: 'vim::operator::add'
				},
				{
					kind: 'block',
					type: 'vim::operator::sub'
				},
				{
					kind: 'block',
					type: 'vim::operator::mul'
				},
				{
					kind: 'block',
					type: 'vim::operator::div'
				},
				{
					kind: 'block',
					type: 'vim::operator::mod'
				},
				{
					kind: 'block',
					type: 'vim::operator::unary_add'
				},
				{
					kind: 'block',
					type: 'vim::operator::unary_sub'
				}
			],
			colour: 150,
		},
		{ name: 'Logic',
			kind: 'category',
			contents: [
				{
					kind: 'block',
					type: 'vim::literal::true'
				},
				{
					kind: 'block',
					type: 'vim::literal::false'
				},
				{
					kind: 'block',
					type: 'vim::literal::none'
				},
				{
					kind: 'block',
					type: 'vim::literal::null'
				},
				{
					kind: 'block',
					type: 'vim::operator::cmp'
				},
				{
					kind: 'block',
					type: 'vim::operator::and'
				},
				{
					kind: 'block',
					type: 'vim::operator::or'
				},
				{
					kind: 'block',
					type: 'vim::operator::not'
				},
				{
					kind: 'block',
					type: 'vim::operator::trinary'
				},
				{
					kind: 'block',
					type: 'vim::operator::falsy'
				},
			],
			colour: 240,
		},
		{ name: 'String',
			kind: 'category',
			contents: [
				{
					kind: 'block',
					type: 'vim::literal::string'
				},
				{
					kind: 'block',
					type: 'vim::literal::literal_string'
				},
				{
					kind: 'block',
					type: 'vim::literal::blob'
				},
				{
					kind: 'block',
					type: 'vim::operator::concat'
				}
			],
			colour: 30,
		},
		{ name: 'List & Dict',
			kind: 'category',
			contents: [
				{
					kind: 'block',
					type: 'vim::operator::index'
				},
				{
					kind: 'block',
					type: 'vim::operator::entry'
				},
				{
					kind: 'block',
					type: 'vim::operator::slice'
				}
			],
			colour: 60
		},
		{ name: 'Variable',
			kind: 'category',
			contents: [
				{
					kind: 'block',
					type: 'vim::ident'
				}
			],
			colour: 180
		},
		{ name: 'Function',
			kind: 'category',
			contents: [
				{
					kind: 'block',
					type: 'vim::operator::call'
				},
				{
					kind: 'block',
					type: 'vim::operator::method'
				}
			],
			colour: 0,
		},
		{ name: 'Plugin',
			kind: 'category',
			contents: [
				{
					kind: 'block',
					type: 'vim::plugin::wrapper'
				},
				{
					kind: 'block',
					type: 'vim::plugin::add_plugin'
				},
			],
			colour: 0,
		},
	]
};

export { init, toolbox };
