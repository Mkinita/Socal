/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mostrarEcxel.js":
/*!********************************!*\
  !*** ./src/js/mostrarEcxel.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nfunction exportTableToExcel(tableID, filename = ''){\r\n    var downloadLink;\r\n    var dataType = 'application/vnd.ms-excel';\r\n    var tableSelect = document.getElementById(tableID);\r\n    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');\r\n    \r\n    // Specify file name\r\n    filename = filename?filename+'.xls':'excel_data.xls';\r\n    \r\n    // Create download link element\r\n    downloadLink = document.createElement(\"a\");\r\n    \r\n    document.body.appendChild(downloadLink);\r\n    \r\n    if(navigator.msSaveOrOpenBlob){\r\n        var blob = new Blob(['ufeff', tableHTML], {\r\n            type: dataType\r\n        });\r\n        navigator.msSaveOrOpenBlob( blob, filename);\r\n    }else{\r\n        // Create a link to the file\r\n        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;\r\n    \r\n        // Setting the file name\r\n        downloadLink.download = filename;\r\n        \r\n        //triggering the function\r\n        downloadLink.click();\r\n    }\r\n}\n\n//# sourceURL=webpack://socal_mvc/./src/js/mostrarEcxel.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mostrarEcxel.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;