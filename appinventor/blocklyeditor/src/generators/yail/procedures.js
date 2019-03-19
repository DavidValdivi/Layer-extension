// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2012 Massachusetts Institute of Technology. All rights reserved.

/**
 * @license
 * @fileoverview Procedure yail generators for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */

'use strict';

goog.provide('Blockly.Yail.procedures');

/**
 * Lyn's History:
 * [lyn, 10/29/13] Fixed bug in handling parameters of zero-arg procedures.
 * [lyn, 10/27/13] Modified procedure names to begin with YAIL_PROC_TAG (currently 'p$')
 *     and parameters to begin with YAIL_LOCAL_VAR_TAG (currently '$').
 *     At least on Kawa-legal first character is necessary to ensure AI identifiers
 *     satisfy Kawa's identifier rules. And the procedure 'p$' tag is necessary to
 *     distinguish procedures from globals (which use the 'g$' tag).
 * [lyn, 01/15/2013] Edited to remove STACK (no longer necessary with DO-THEN-RETURN)
 */

Blockly.Yail.YAIL_PROC_TAG = 'p$'; // See notes on this in generators/yail/variables.js

// Generator code for procedure call with return
// [lyn, 01/15/2013] Edited to remove STACK (no longer necessary with DO-THEN-RETURN)
Blockly.Yail['procedures_defreturn'] = function() {
  var argPrefix = Blockly.Yail.YAIL_LOCAL_VAR_TAG
                  + (Blockly.usePrefixInYail && this.arguments_.length != 0 ? "param_" : "");
  var args = this.arguments_.map(function (arg) {return argPrefix + arg;}).join(' ');
  var procName = Blockly.Yail.YAIL_PROC_TAG + this.getFieldValue('NAME');
  var returnVal = Blockly.Yail.valueToCode(this, 'RETURN', Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE;
  var code = Blockly.Yail.YAIL_DEFINE + Blockly.Yail.YAIL_OPEN_COMBINATION + procName
      + Blockly.Yail.YAIL_SPACER + args + Blockly.Yail.YAIL_CLOSE_COMBINATION 
      + Blockly.Yail.YAIL_SPACER + returnVal + Blockly.Yail.YAIL_CLOSE_COMBINATION;
  return code;
};

// Generator code for procedure call with return
Blockly.Yail['procedures_defnoreturn'] = function() {
  var argPrefix = Blockly.Yail.YAIL_LOCAL_VAR_TAG
                  + (Blockly.usePrefixInYail && this.arguments_.length != 0 ? "param_" : "");
  var args = this.arguments_.map(function (arg) {return argPrefix + arg;}).join(' ');
  var procName = Blockly.Yail.YAIL_PROC_TAG + this.getFieldValue('NAME');
  var body = Blockly.Yail.statementToCode(this, 'STACK', Blockly.Yail.ORDER_NONE)  || Blockly.Yail.YAIL_FALSE;
  var code = Blockly.Yail.YAIL_DEFINE + Blockly.Yail.YAIL_OPEN_COMBINATION + procName
      + Blockly.Yail.YAIL_SPACER + args + Blockly.Yail.YAIL_CLOSE_COMBINATION + body
      + Blockly.Yail.YAIL_CLOSE_COMBINATION;
  return code;
};

// Generator code for yail procedure
Blockly.Yail['procedures_defanonnoreturn'] = function() {
  var argPrefix = Blockly.Yail.YAIL_LOCAL_VAR_TAG
                  + (Blockly.usePrefixInYail && this.arguments_.length != 0 ? "param_" : "");
  var args = this.getVars().map(function (arg) {return argPrefix + arg;}).join(' ');
  var body = Blockly.Yail.statementToCode(this, 'STACK', Blockly.Yail.ORDER_NONE)  || Blockly.Yail.YAIL_FALSE;
  var code = Blockly.Yail.YailCallYialPrimitive(
    "create-yail-procedure",
    Blockly.Yail.YAIL_LAMBDA
      + Blockly.Yail.YAIL_OPEN_COMBINATION + args + Blockly.Yail.YAIL_CLOSE_COMBINATION + Blockly.Yail.YAIL_SPACER
      + body + Blockly.Yail.YAIL_CLOSE_COMBINATION,
    "any", "create procedure");
  return [ code, Blockly.Yail.ORDER_ATOMIC ];
};

// Generator code for yail procedure (with return)
Blockly.Yail['procedures_defanonreturn'] = function() {
  var argPrefix = Blockly.Yail.YAIL_LOCAL_VAR_TAG
                  + (Blockly.usePrefixInYail && this.arguments_.length != 0 ? "param_" : "");
  var args = this.getVars().map(function (arg) {return argPrefix + arg;}).join(' ');
  var returnVal = Blockly.Yail.valueToCode(this, 'RETURN', Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE;
  var code = Blockly.Yail.YailCallYialPrimitive(
    "create-yail-procedure",
    Blockly.Yail.YAIL_LAMBDA
      + Blockly.Yail.YAIL_OPEN_COMBINATION + args + Blockly.Yail.YAIL_CLOSE_COMBINATION + Blockly.Yail.YAIL_SPACER
      + returnVal + Blockly.Yail.YAIL_CLOSE_COMBINATION,
    "any", "create procedure");
  return [ code, Blockly.Yail.ORDER_ATOMIC ];
};

Blockly.Yail['procedure_lexical_variable_get'] = function() {
  return Blockly.Yail.lexical_variable_get.call(this);
}

//call the do return in control category
Blockly.Yail['procedures_do_then_return'] = function() {
  return Blockly.Yail.controls_do_then_return.call(this);
}

// Generator code for procedure call with return
Blockly.Yail['procedures_callnoreturn'] = function() {
  var procName = Blockly.Yail.YAIL_PROC_TAG + this.getFieldValue('PROCNAME');
  var argCode = [];
  for ( var x = 0;this.getInput("ARG" + x); x++) {
    argCode[x] = Blockly.Yail.valueToCode(this, 'ARG' + x, Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE;
  }
  var code = Blockly.Yail.YAIL_OPEN_COMBINATION + Blockly.Yail.YAIL_GET_VARIABLE + procName
      + Blockly.Yail.YAIL_CLOSE_COMBINATION + Blockly.Yail.YAIL_SPACER + argCode.join(' ')
      + Blockly.Yail.YAIL_CLOSE_COMBINATION;
  return code;
};

// Generator code for procedure call with return
Blockly.Yail['procedures_callreturn'] = function() {
  var procName = Blockly.Yail.YAIL_PROC_TAG + this.getFieldValue('PROCNAME');
  var argCode = [];
  for ( var x = 0; this.getInput("ARG" + x); x++) {
    argCode[x] = Blockly.Yail.valueToCode(this, 'ARG' + x, Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE;
  }
  var code = Blockly.Yail.YAIL_OPEN_COMBINATION + Blockly.Yail.YAIL_GET_VARIABLE + procName
      + Blockly.Yail.YAIL_CLOSE_COMBINATION + Blockly.Yail.YAIL_SPACER + argCode.join(' ')
      + Blockly.Yail.YAIL_CLOSE_COMBINATION;
  return [ code, Blockly.Yail.ORDER_ATOMIC ];
};

// Generator code for yail procedure call with no return
Blockly.Yail['procedures_callanonnoreturn'] = function() {
  var argCode = [];
  var argTypes = [];
  argCode.push(Blockly.Yail.valueToCode(this, 'PROCEDURE', Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE);
  argTypes.push("any");
  for (var x=0; this.getInput("ARG" + x); x++) {
    argCode.push(Blockly.Yail.valueToCode(this, 'ARG' + x, Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE);
    argTypes.push('any');
  }
  var code = Blockly.Yail.YailCallYialPrimitive("call-yail-procedure", argCode, argTypes, "call procedure");
  return code;
};

// Generator code for yail procedure call with return
Blockly.Yail['procedures_callanonreturn'] = function() {
  var argCode = [];
  var argTypes = [];
  argCode.push(Blockly.Yail.valueToCode(this, 'PROCEDURE', Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE);
  argTypes.push("any");
  for (var x=0; this.getInput("ARG" + x); x++) {
    argCode.push(Blockly.Yail.valueToCode(this, 'ARG' + x, Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE);
    argTypes.push('any');
  }
  var code = Blockly.Yail.YailCallYialPrimitive("call-yail-procedure", argCode, argTypes, "call procedure");
  return [ code, Blockly.Yail.ORDER_ATOMIC ];
};

// Generator code for yail procedure call with no return (input list version)
Blockly.Yail['procedures_callanonnoreturn_inputlist'] = function() {
  var code = Blockly.Yail.YailCallYialPrimitive(
      "call-yail-procedure-input-list",
      [ Blockly.Yail.valueToCode(this, 'PROCEDURE', Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE,
        Blockly.Yail.valueToCode(this, 'INPUTLIST', Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE ], 
      ["any","any"],
      "call procedure(with input list)");
  return code;
};

// Generator code for yail procedure call with return (input list version)
Blockly.Yail['procedures_callanonreturn_inputlist'] = function() {
  var code = Blockly.Yail.YailCallYialPrimitive(
      "call-yail-procedure-input-list",
      [ Blockly.Yail.valueToCode(this, 'PROCEDURE', Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE,
        Blockly.Yail.valueToCode(this, 'INPUTLIST', Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE ], 
      ["any","any"],
      "call procedure(with input list)");
  return [ code, Blockly.Yail.ORDER_ATOMIC ];
};

Blockly.Yail['procedures_numArgs'] = function() {
  var code = Blockly.Yail.YailCallYialPrimitive(
      "num-args-yail-procedure",
      Blockly.Yail.valueToCode(this, 'PROCEDURE', Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE,
      "any", "get number of arguments");
  return [ code, Blockly.Yail.ORDER_ATOMIC ];
}

Blockly.Yail['procedures_getWithName'] = function() {
  var procName = Blockly.Yail.valueToCode(this, 'PROCEDURENAME', Blockly.Yail.ORDER_NONE) || Blockly.Yail.YAIL_FALSE;
  var code = Blockly.Yail.YailCallYialPrimitive(
      "create-yail-procedure-with-name", procName, "any", "get procedure");
  return [ code, Blockly.Yail.ORDER_ATOMIC ];
}

Blockly.Yail['procedures_getWithDropdown'] = function() {
  var procedure = Blockly.Yail.YAIL_GET_VARIABLE +
      Blockly.Yail.YAIL_PROC_TAG + this.getFieldValue('PROCNAME') + Blockly.Yail.YAIL_CLOSE_COMBINATION;
  var code = Blockly.Yail.YailCallYialPrimitive(
    "create-yail-procedure", procedure, "any", "get procedure");
  return [ code, Blockly.Yail.ORDER_ATOMIC ];
}