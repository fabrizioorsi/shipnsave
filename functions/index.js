const functions = require('firebase-functions');
const upsAPI = require('ups-shipping-api');
const DHLAPI = require('node-shipping-dhl');
const fedexAPI = require('fedex');

exports.quote = functions.https.onRequest((req, res) => {
	const reqJson = req.body;
	const dhl = new DHLAPI.default({
      environment: 'test',
      debug: 'true',
      account: '971691638',
      siteID: 'v62_F79rhTfx25',
      password: '5eBkH7fhIS'
    });

	let imperial = true;
	let dimension = 'IN';
	let weightUnit = 'LB';
	let upsUnitSystem = 'imperial';
	if (reqJson.imperial === 'false') {
		imperial = false;
		dimension = 'CM';
        weightUnit = 'KG';
        upsUnitSystem = 'metric';
	}
    const dhlPackage = {
	  GetQuote: {
	    From: {
	      CountryCode: reqJson.shipper.country,
	      Postalcode: reqJson.shipper.zipcode
	    },
	    BkgDetails: {
	      PaymentCountryCode: reqJson.shipper.country,
	      Date: '2018-12-23',
	      ReadyTime: 'PT10H21M',
	      ReadyTimeGMTOffset: '+01:00',
	      DimensionUnit: dimension,
	      WeightUnit: weightUnit,
	      Pieces: {
	        Piece: {
	          PieceID: 1,
	          Height: reqJson.packages[0].dimensions.height,
	          Depth: reqJson.packages[0].dimensions.length,
	          Width: reqJson.packages[0].dimensions.width,
	          Weight: reqJson.packages[0].weight
	        }
	      },
	      IsDutiable: 'N',
	      NetworkTypeCode: 'AL'
	    },
	    To: {
	      CountryCode: reqJson.recipient.country,
	      Postalcode: reqJson.recipient.zipcode
	    },
	    Dutiable: {
	      DeclaredCurrency: 'CAD',
	      DeclaredValue: '1002.00'
	    }
	  }
	}

	const servicesUPS = {
		"11": "UPS Standard",
		"12": "UPS 3 Day Select",
		"54": "UPS Worldwide Express Plus",
		"65": "UPS Express Saver",
		"70": "UPS Access Point Economy",
		"02": "UPS Expedited",
		"01": "UPS Express",
		"08": "UPS Worldwide Expedited",
		"07": "UPS Worldwide Express",
		"13": "UPS Express Saver",
		"14": "UPS Express Early"
	}

	
	
	// console.log(reqJson.packages[0].weight);
	var ups = new upsAPI({
	  environment: 'sandbox', // or live
	  access_key: '7D52AD12BC8537CC',
	  username: 'shipnsave',
	  password: 'Protel3801!',
	  unit_system : upsUnitSystem
	});

	var fedex = new fedexAPI({
        account_number: '510087640',
        meter_number: '119090267',
        key: 'eJ3Ke1LflxXWORS5',
        password: '0ldkRpLvqJA2O3Vr3lZ9XGccc',
        env: 'test'
    });

    var fedex_shipment = {
        "ReturnTransitAndCommit": true,
  "RequestedShipment": {
    "ShipTimestamp": "2018-12-14T12:34:56-06:00",
    DropoffType: 'REGULAR_PICKUP',
    ServiceType: 'PRIORITY_OVERNIGHT',
    "PackagingType": "YOUR_PACKAGING",
    "PreferredCurrency": "CAD",
    "Shipper": {
      
      "Address": {
        "PostalCode": reqJson.shipper.zipcode,
        "CountryCode": reqJson.shipper.country
      }
    },
    "Recipient": {
      
      "Address": {
        "PostalCode": reqJson.recipient.zipcode,
        "CountryCode": reqJson.recipient.country
      }
    },
    "RateRequestTypes": "LIST",
    "PackageCount": reqJson.packages.length.toString(),
    "RequestedPackageLineItems": {
      "SequenceNumber": "1",
      "GroupNumber": "1",
      "GroupPackageCount": "1",
      "Weight": {
        "Units": weightUnit,
        "Value": reqJson.packages[0].weight
      }
    }
  }
};

// "packages" : [
// 		{
// 			"weight" : 12,
// 			"dimensions" : {
// 				"length": 1,
// 				"width": 1,
// 				"height": 1
// 			}
// 		}
// 	]

	   var test_shipment = {
	    shipper : {
	        address : {
	            country_code : reqJson.recipient.country,
	            postal_code : reqJson.shipper.zipcode,
	        },
	    },
	    ship_to : {
	        address : {
	            country_code : reqJson.recipient.country,
	            postal_code : reqJson.recipient.zipcode,
	        },
	    },
	    package : {
	        weight : reqJson.packages[0].weight, // the weight of the package
	        dimensions : {
	            length : reqJson.packages[0].dimensions.length,
	            width : reqJson.packages[0].dimensions.width,
	            height : reqJson.packages[0].dimensions.height,
	        }
	    }
	}
	//console.log('calling ups');
	ups.retreive_rates(test_shipment)
	.then((rates) => {
	    //console.log(rates);
	    let rates2;
	    if (!rates.Fault)
	    {
		    rates2 = rates.map((rate)=>{
			    	let obj = {}
			    	obj['total'] = rate.TotalCharges.MonetaryValue;
			    	obj['carrier'] = '/static/img/ups.png'
			    	obj['serviceName'] = servicesUPS[rate.Service.Code] + rate.Service.Description
	            
		    	if (rate.GuaranteedDelivery)
		    	{
		    		obj['daysInTransit'] = rate.GuaranteedDelivery.BusinessDaysInTransit
		 			obj['deliveryTime'] = rate.GuaranteedDelivery.DeliveryByTime
		    	} else {
		    		obj['daysInTransit'] = 'NA'
		    		obj['deliveryTime'] = 'NA'
		    	}
		    	//console.log(`Total charges ${JSON.stringify(obj)}`);
		    	return obj
		 		
		 	})
		}
			else
		{
			let obj = {}
	    	obj['total'] = '0';
	    	obj['carrier'] = '/static/img/ups.png'
	    	obj['serviceName'] = rates.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Description;
    		obj['daysInTransit'] = 'NA'
 			obj['deliveryTime'] = 'NA'
			rates2 = [obj];
		}
	    let final = {};
	    fedex.rate(fedex_shipment, (err, ress) => {
	    	//console.log('RESSS',ress);
	    	let rates3;
	        if (ress.RateReplyDetails) {
	    	    rates3 = ress.RateReplyDetails.map((rate) => {
	    	 	  let obj = {}
	    	 	  //console.log(rate.RatedShipmentDetails[0].ShipmentRateDetail.Taxes[0].Amount)
	    	 	  let fdxrate = parseFloat(rate.RatedShipmentDetails[0].ShipmentRateDetail.CurrencyExchangeRate.Rate);
	    	 	  //console.log('fdxrate' + fdxrate)
	    	 	  let amount = parseFloat(rate.RatedShipmentDetails[0].ShipmentRateDetail.TotalNetCharge.Amount);
	    	 	  //console.log('amount' + amount)
	    	 	  let subtotal = parseFloat(rate.RatedShipmentDetails[0].ShipmentRateDetail.TotalBaseCharge.Amount)
	    	 	  let fuel = parseFloat(rate.RatedShipmentDetails[0].ShipmentRateDetail.Surcharges[1].Amount.Amount);
	    	 	  //console.log('fuel' + fuel);
	    	 	  let gst = parseFloat(rate.RatedShipmentDetails[0].ShipmentRateDetail.Taxes[0].Amount.Amount) * fdxrate;
	    	 	  //console.log('gst' + gst);
	    	 	  let pst = 0;
	    	 	  obj['pst'] = 'NA';
	    	 	  if (rate.RatedShipmentDetails[0].ShipmentRateDetail.Taxes.length > 1) {
	    	 	  	pst = parseFloat(rate.RatedShipmentDetails[0].ShipmentRateDetail.Taxes[1].Amount.Amount) * fdxrate;
	    	 	  }
	    	 	  //console.log('pst' + pst);
	    	 	  let taxes = gst + pst;
		    	  obj['subtotal'] = (Number(fdxrate * subtotal) + Number(fdxrate * fuel)).toFixed(2);
		    	  obj['total'] = (Number(obj.subtotal) + Number(taxes)).toFixed(2);
		    	  obj['gst'] = Number(gst).toFixed(2);
		    	  if (pst!=='NA') {
		    	  	obj['pst'] = Number(pst).toFixed(2);
		    	  }
		    	  obj['base'] = Number(subtotal * fdxrate).toFixed(2);
 		    	  obj['fuel'] = Number(fuel).toString();
		    	  obj['fuelPercent'] = rate.RatedShipmentDetails[0].ShipmentRateDetail.FuelSurchargePercent;
		    	  obj['serviceName'] = rate.ServiceDescription.Description;
		    	  obj['carrier'] = '/static/img/fdx.png'
		    	  obj['daysInTransit'] = 'NA'
		    	  obj['deliveryTime'] = 'NA'
		    	  return obj;
	    	   })
	    	} else {
	    		let obj = {}
		    	obj['total'] = '0';
		    	obj['serviceName'] = ress.Notifications[0].Message;
		    	obj['carrier'] = '/static/img/fdx.png'
		    	obj['daysInTransit'] = 'NA'
		    	obj['deliveryTime'] = 'NA'
		    	rates3 = [obj];
	    	}
	    	   final = rates2.concat(rates3);
	    	   dhl.getServices(dhlPackage, (err, result) => {
		        if (err) {
		          logger.debug('results from server err', err);
		          //console.log(err);
		        }
		        
		        let rates4;
		        //console.log(result['res:DCTResponse'].GetQuoteResponse.BkgDetails)
		        if(result['res:DCTResponse'].GetQuoteResponse.BkgDetails)
		        {
			        if (Array.isArray(result['res:DCTResponse'].GetQuoteResponse.BkgDetails.QtdShp))
			        {
				        rates4 = result['res:DCTResponse'].GetQuoteResponse.BkgDetails.QtdShp.map((dhlrate)=>{
				          //console.log(dhlrate.ShippingCharge)
				          let obj = {}
				    	  obj['total'] = parseFloat(dhlrate.ShippingCharge).toFixed(2) + ' EUR';
				    	  obj['serviceName'] = dhlrate.ProductShortName;
				    	  obj['carrier'] = '/static/img/dhl.png'
				    	  obj['daysInTransit'] = dhlrate.TotalTransitDays;
				    	  obj['deliveryTime'] = 'NA'
				    	  return obj;
				        });
				    } else {
				    	//console.log(result['res:DCTResponse'].GetQuoteResponse.BkgDetails.QtdShp)
				    	let obj = {}
			    	    obj['total'] = '0';
			    	    obj['serviceName'] = result['res:DCTResponse'].GetQuoteResponse.BkgDetails.QtdShp.ProductShortName;
			    	    obj['carrier'] = '/static/img/dhl.png'
			    	    obj['daysInTransit'] = result['res:DCTResponse'].GetQuoteResponse.BkgDetails.QtdShp.TotalTransitDays;
			    	    obj['deliveryTime'] = 'NA'
			    	    rates4 = [obj];
				    }
				} else {
					let obj = {}
					//console.log(result['res:DCTResponse'].GetQuoteResponse);
		    	    obj['total'] = '0';
		    	    obj['serviceName'] = result['res:DCTResponse'].GetQuoteResponse.Note.Condition.ConditionData;
		    	    obj['carrier'] = '/static/img/dhl.png'
		    	    obj['daysInTransit'] = 'NA'
		    	    obj['deliveryTime'] = 'NA'
		    	    rates4 = [obj];
				}
		        final = final.concat(rates4);
		        res.status(200).send(final);
		      });
	    	   
		});
	})
	.catch((err) => {
		//console.log(err);
	});
	//res.status(200).send('values');
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
