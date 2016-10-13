var xpath = require('xpath')
  , dom = require('xmldom').DOMParser
  , SignedXml = require('xml-crypto').SignedXml
  , FileKeyInfo = require('xml-crypto').FileKeyInfo  
  , fs = require('fs')

var xml = fs.readFileSync("demoresponse.xml").toString()
var cleanxml = fs.readFileSync("demoresponse_clean.xml").toString()
var doc = new dom().parseFromString(xml)  

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
var doc = new dom().parseFromString(xml);
var node_signature = select("//soap:Header//wsse:Security//ds:Signature", doc)[0];
var signature = select("//soap:Header//wsse:Security//ds:Signature//ds:SignatureValue", doc)[0].firstChild.data;
var str = select("//soap:Header//wsse:Security//ds:Signature//ds:DigestValue", doc)[0].firstChild.data;
//console.log("signature",signature.toString());
	
/*var sig = new SignedXml()
sig.keyInfoProvider = new FileKeyInfo("tbk.pem", "utf8")
sig.loadSignature(signature.toString())
var res = sig.checkSignature(xml)*/
//if (!res) console.log(sig.validationErrors)
	
console.log("::signature::"); 
console.log(signature);
console.log("::str::");
console.log(str);
	
var k64 = new Buffer( signature , 'base64')//.toString();
var s64 = new Buffer( str, 'base64').toString();

var key = new Buffer( fs.readFileSync("tbk.pem", "utf8").toString() );


console.log("::k64::");
console.log(k64);
console.log("::s64::");
console.log(s64);
console.log("::key::");
console.log(key);

var crypto = require("crypto");
var verifier = crypto.createVerify("SHA1") 
verifier.update(cleanxml) 
var res = verifier.verify( key , k64 )

console.log(res);