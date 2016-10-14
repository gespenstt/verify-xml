var xpath = require('xpath')
  , dom = require('xmldom').DOMParser
  , SignedXml = require('xml-crypto').SignedXml
  , FileKeyInfo = require('xml-crypto').FileKeyInfo  
  , fs = require('fs')

var xml = fs.readFileSync("tbk/demoresponse.xml").toString();
var doc = new dom().parseFromString(xml);

var select = xpath.useNamespaces(
	{
		"soap": "http://schemas.xmlsoap.org/soap/envelope/",
		"ns2": "http://service.wswebpay.webpay.transbank.com/",
		"ds": "http://www.w3.org/2000/09/xmldsig#",
		"wsse" : "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd",
		"wsu" : "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd",
		"ec" : "http://www.w3.org/2001/10/xml-exc-c14n#"
	}
);

var node_signature = select("//soap:Header//wsse:Security//ds:Signature", doc)[0];

var sig = new SignedXml()
sig.keyInfoProvider = new FileKeyInfo("tbk/tbk.pem");
sig.loadSignature(node_signature.toString())
var res = sig.checkSignature(xml)
if (!res) console.log(sig.validationErrors);


console.log(res);