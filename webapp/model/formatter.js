sap.ui.define([
	"sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
	"use strict";

	var mStatusState = {
		"A": "Success",
		"O": "Warning",
		"D": "Error"
	};

	var formatter = {
		/**
		 * Formats the price
		 * @param {string} sValue model price value
		 * @return {string} formatted price
		 */
		price: function (sValue) {
			var numberFormat = NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				minFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ",",
				decimalSeparator: "."
			});
			return numberFormat.format(sValue);
		},

		/**
		 * Sums up the price for all products in the cart
		 * @param {object} oCartEntries current cart entries
		 * @return {string} string with the total value
		 */
		subtotalPrice: function (oCartEntries) {
			var oBundle = this.getResourceBundle(),
				fTotalPrice = 0;

			Object.keys(oCartEntries).forEach(function (sProductId) {
				var oProduct = oCartEntries[sProductId];
				fTotalPrice += parseFloat(oProduct.Price) * oProduct.Quantity;
			});
			var oModel = this.getModel();
			oModel.setProperty("/SubtotalPrice", formatter.price(fTotalPrice));

			return oBundle.getText("cartSubtotalPrice", [formatter.price(fTotalPrice)]);
		},
		//total price include shipping fee and assembly fee
		// totalPrice: function (oCartEntries) {
		// 	var oBundle = this.getResourceBundle(),
		// 		fTotalPrice = 0;

		// 	Object.keys(oCartEntries).forEach(function (sProductId) {
		// 		var oProduct = oCartEntries[sProductId];
		// 		fTotalPrice += parseFloat(oProduct.Price) * oProduct.Quantity;
		// 	});

		// 	var oModel = this.getModel();
		// 	var sDeliveryFee = oModel.getProperty("/SelectedDeliveryAppointment/Fee").replace("$", "");
		// 	var bSelectAssembly = oModel.getProperty("/AssemblyServiceSelected");
		// 	var fAssembly = "";
		// 	if (bSelectAssembly) {
		// 		fAssembly = parseFloat(oModel.getProperty("/AssemblyFee").replace("$", ""));
		// 		fTotalPrice += fAssembly;
		// 	}
		// 	var fDeliveryFee = parseFloat(sDeliveryFee);
		// 	fTotalPrice += fDeliveryFee;

		// 	return oBundle.getText("cartTotalPrice", [formatter.price(fTotalPrice)]);
		// },

		/**
		 * Returns the status text based on the product status
		 * @param {string} sStatus product status
		 * @return {string} the corresponding text if found or the original value
		 */
		statusText: function (sStatus) {
			var oBundle = this.getResourceBundle();

			var mStatusText = {
				"A": oBundle.getText("statusA"),
				"O": oBundle.getText("statusO"),
				"D": oBundle.getText("statusD")
			};

			return mStatusText[sStatus] || sStatus;
		},

		/**
		 * Returns the product state based on the status
		 * @param {string} sStatus product status
		 * @return {string} the state text
		 */
		statusState: function (sStatus) {
			return mStatusState[sStatus] || "None";
		},

		/**
		 * Returns the relative URL to a product picture
		 * @param {string} sUrl image URL
		 * @return {string} relative image URL
		 */
		pictureUrl: function (sUrl) {
			if (sUrl) {
				return sap.ui.require.toUrl(sUrl);
			} else {
				return undefined;
			}
		},

		/**
		 * Returns the footer text for the cart based on the amount of products
		 * @param {object} oSavedForLaterEntries the entries in the cart
		 * @return {string} "" for no products, the i18n text for >0 products
		 */
		footerTextForCart: function (oSavedForLaterEntries) {
			var oBundle = this.getResourceBundle();

			if (Object.keys(oSavedForLaterEntries).length === 0) {
				return "";
			}
			return oBundle.getText("cartSavedForLaterFooterText");
		},

		/**
		 * Checks if one of the collections contains items.
		 * @param {object} oCollection1 First array or object to check
		 * @param {object} oCollection2 Second array or object to check
		 * @return {boolean} true if one of the collections is not empty, otherwise - false.
		 */
		hasItems: function (oCollection1, oCollection2) {
			var bCollection1Filled = !!(oCollection1 && Object.keys(oCollection1).length),
				bCollection2Filled = !!(oCollection2 && Object.keys(oCollection2).length);

			return bCollection1Filled || bCollection2Filled;
		},

		statusTextBy: function (sStatus) {
			var oBundle = this.getResourceBundle();

			var mStatusText = {
				"A": oBundle.getText("statusA") + " By",
				"O": oBundle.getText("statusO") + " By",
				"D": oBundle.getText("statusD") + " By"
			};

			return mStatusText[sStatus] || sStatus;
		},

	};

	return formatter;
});